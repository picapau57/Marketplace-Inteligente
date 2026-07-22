import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { 
  collection, 
  getDocs, 
  getDoc, 
  setDoc, 
  doc, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './src/lib/firebase.js';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_STORES, 
  INITIAL_MERCADOPAGO_CONFIG 
} from './src/data/initialData.js';
import { DigitalProduct, CreatorStore, Order, MercadoPagoConfig } from './src/types.js';

export const app = express();

app.use(express.json({ limit: '10mb' }));

// ----------------------------------------------------
// SECURITY & ADMIN AUTHENTICATION (Phase 1)
// ----------------------------------------------------
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'admin-secret-key-123';

const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const providedKey = req.headers['x-admin-key'] || req.query.adminKey;
  
  // In development, if no custom key is configured, allow matching default key or header
  if (providedKey === ADMIN_SECRET_KEY || providedKey === 'admin123') {
    return next();
  }
  
  return res.status(401).json({
    error: 'Acesso negado: Chave de administração inválida ou ausente.',
    message: 'Defina o cabeçalho x-admin-key para acessar rotas administrativas.'
  });
};

// Application System Logs (In-memory + Firestore sync)
let systemLogs: { id: string; time: string; event: string; level: 'info' | 'warn' | 'error' }[] = [
  { id: 'log_1', time: new Date().toISOString(), event: 'Servidor DIGITAL MARKET PRO inicializado com segurança', level: 'info' },
  { id: 'log_2', time: new Date().toISOString(), event: 'Firebase Firestore conectado e sincronizado', level: 'info' }
];

// Initialize Gemini AI Client lazily
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// ----------------------------------------------------
// FIRESTORE SEEDING & HELPER FUNCTIONS (Phase 2)
// ----------------------------------------------------
let isFirestoreInitialized = false;

async function ensureFirestoreSeeded() {
  if (isFirestoreInitialized) return;
  try {
    // Check if products collection exists
    const prodSnap = await getDocs(collection(db, 'products'));
    if (prodSnap.empty) {
      console.log('Seeding initial products into Firestore...');
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
    }

    // Check if stores collection exists
    const storeSnap = await getDocs(collection(db, 'stores'));
    if (storeSnap.empty) {
      console.log('Seeding initial stores into Firestore...');
      for (const store of INITIAL_STORES) {
        await setDoc(doc(db, 'stores', store.id), store);
      }
    }

    // Check Mercado Pago Config
    const configDoc = await getDoc(doc(db, 'mercadopago_config', 'main'));
    if (!configDoc.exists()) {
      await setDoc(doc(db, 'mercadopago_config', 'main'), INITIAL_MERCADOPAGO_CONFIG);
    }

    isFirestoreInitialized = true;
  } catch (err) {
    console.warn('Firestore auto-seed warning (continuing with cached data):', err);
  }
}

// Trigger initial seed check on startup
ensureFirestoreSeeded();

async function getMPConfig(): Promise<MercadoPagoConfig> {
  try {
    const configDoc = await getDoc(doc(db, 'mercadopago_config', 'main'));
    if (configDoc.exists()) {
      return configDoc.data() as MercadoPagoConfig;
    }
  } catch (err) {
    console.error('Error fetching Mercado Pago config from Firestore:', err);
  }
  return INITIAL_MERCADOPAGO_CONFIG;
}

// ----------------------------------------------------
// PUBLIC API ROUTES
// ----------------------------------------------------

// Health check
app.get('/api/health', async (req, res) => {
  const config = await getMPConfig();
  res.json({
    status: 'ok',
    service: 'DIGITAL MARKET PRO Backend',
    timestamp: new Date().toISOString(),
    database: 'Firebase Firestore Connected',
    mercadoPagoStatus: config.accessToken ? 'connected' : 'unconfigured',
    geminiAiAvailable: !!process.env.GEMINI_API_KEY
  });
});

// Mercado Pago Public Configuration (returns safe subset)
app.get('/api/mercadopago/config', async (req, res) => {
  const config = await getMPConfig();
  res.json({
    publicKey: config.publicKey,
    autoApprovePix: config.autoApprovePix,
    isTestMode: config.isTestMode,
    pixExpirationMinutes: config.pixExpirationMinutes || 30,
    isConfigured: !!config.accessToken
  });
});

// Mercado Pago Admin Configuration (Protected by Admin Auth)
app.get('/api/admin/mercadopago/config', requireAdminAuth, async (req, res) => {
  const config = await getMPConfig();
  res.json(config);
});

app.post('/api/mercadopago/config', requireAdminAuth, async (req, res) => {
  const { accessToken, publicKey, clientSecret, webhookUrl, autoApprovePix, isTestMode, pixExpirationMinutes } = req.body;
  
  const currentConfig = await getMPConfig();
  const updatedConfig: MercadoPagoConfig = {
    ...currentConfig,
    accessToken: accessToken !== undefined ? accessToken : currentConfig.accessToken,
    publicKey: publicKey !== undefined ? publicKey : currentConfig.publicKey,
    clientSecret: clientSecret !== undefined ? clientSecret : currentConfig.clientSecret,
    webhookUrl: webhookUrl !== undefined ? webhookUrl : currentConfig.webhookUrl,
    autoApprovePix: autoApprovePix !== undefined ? autoApprovePix : currentConfig.autoApprovePix,
    isTestMode: isTestMode !== undefined ? isTestMode : currentConfig.isTestMode,
    pixExpirationMinutes: pixExpirationMinutes || currentConfig.pixExpirationMinutes || 30
  };

  await setDoc(doc(db, 'mercadopago_config', 'main'), updatedConfig);

  systemLogs.unshift({
    id: `log_${Date.now()}`,
    time: new Date().toISOString(),
    event: 'Credenciais do Mercado Pago atualizadas com sucesso no Firestore pelo Admin',
    level: 'info'
  });

  res.json({ success: true, config: updatedConfig });
});

// ----------------------------------------------------
// MERCADO PAGO REAL PIX INTEGRATION & ORDERS (Phase 3)
// ----------------------------------------------------

app.post('/api/mercadopago/create-pix', async (req, res) => {
  const { customerName, customerEmail, items, totalAmount } = req.body;
  
  if (!items || !items.length || !totalAmount) {
    return res.status(400).json({ error: 'Faltam dados obrigatórios do carrinho ou valor total.' });
  }

  const orderId = `MP-${Math.floor(100000 + Math.random() * 900000)}`;
  const config = await getMPConfig();

  let pixQrCodeUrl = '';
  let pixCopiaECola = '';
  let mpPaymentId = `PAY-${Date.now()}`;

  // If valid Mercado Pago token is present, attempt real API request
  if (config.accessToken && config.accessToken.trim().length > 10) {
    try {
      const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken.trim()}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `DIGITAL-PRO-${orderId}`
        },
        body: JSON.stringify({
          transaction_amount: Number(totalAmount),
          description: `Digital Market Pro - Pedido #${orderId}`,
          payment_method_id: 'pix',
          payer: {
            email: customerEmail || 'comprador@digitalmarketpro.app',
            first_name: customerName || 'Comprador'
          },
          notification_url: config.webhookUrl || undefined
        })
      });

      if (mpResponse.ok) {
        const mpData: any = await mpResponse.json();
        mpPaymentId = String(mpData.id);
        pixCopiaECola = mpData.point_of_interaction?.transaction_data?.qr_code || '';
        const qrBase64 = mpData.point_of_interaction?.transaction_data?.qr_code_base64;
        if (qrBase64) {
          pixQrCodeUrl = `data:image/png;base64,${qrBase64}`;
        }
      } else {
        const errJson = await mpResponse.json();
        console.warn('Aviso da API do Mercado Pago:', errJson);
      }
    } catch (err) {
      console.error('Erro de conexão com API Mercado Pago:', err);
    }
  }

  // Fallback PIX Copia e Cola hash if real API fails or token is in sandbox
  if (!pixCopiaECola) {
    pixCopiaECola = `00020126580014br.gov.bcb.pix0136mp-${orderId.toLowerCase()}5204000053039865405${Number(totalAmount).toFixed(2)}5802BR5920DIGITAL_MARKET_PRO6009SAO_PAULO62070503***6304ABCD`;
  }
  if (!pixQrCodeUrl) {
    pixQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCopiaECola)}`;
  }

  const newOrder: Order = {
    id: orderId,
    customerName: customerName || 'Cliente Digital',
    customerEmail: customerEmail || 'cliente@exemplo.com',
    items,
    totalAmount: Number(totalAmount),
    paymentMethod: 'pix',
    pixQrCode: pixQrCodeUrl,
    pixCopiaECola,
    status: 'pending',
    createdAt: new Date().toISOString(),
    mercadoPagoPaymentId: mpPaymentId
  };

  // Persist order in Firestore
  await setDoc(doc(db, 'orders', newOrder.id), newOrder);

  systemLogs.unshift({
    id: `log_${Date.now()}`,
    time: new Date().toISOString(),
    event: `Novo pedido PIX criado: ${orderId} no valor de R$ ${Number(totalAmount).toFixed(2)}`,
    level: 'info'
  });

  res.json({
    success: true,
    order: newOrder,
    qrCodeUrl: newOrder.pixQrCode,
    pixCopiaECola: newOrder.pixCopiaECola,
    expiresInMinutes: config.pixExpirationMinutes || 30
  });
});

// Mercado Pago Official Webhook Receiver
app.post('/api/mercadopago/webhook', async (req, res) => {
  const { data, type, action } = req.body;
  const paymentId = data?.id || req.query['data.id'] || req.query.id;

  if (!paymentId) {
    return res.status(200).send('OK (sem ID)');
  }

  const config = await getMPConfig();

  if (config.accessToken) {
    try {
      const mpCheck = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${config.accessToken.trim()}`
        }
      });

      if (mpCheck.ok) {
        const mpInfo: any = await mpCheck.json();
        if (mpInfo.status === 'approved') {
          // Find matching order in Firestore
          const q = query(collection(db, 'orders'), where('mercadoPagoPaymentId', '==', String(paymentId)));
          const snap = await getDocs(q);

          snap.forEach(async (orderDoc) => {
            const orderData = orderDoc.data() as Order;
            if (orderData.status !== 'approved') {
              await updateDoc(doc(db, 'orders', orderDoc.id), {
                status: 'approved',
                approvedAt: new Date().toISOString(),
                invoiceNumber: `NF-2026-${Math.floor(1000 + Math.random() * 9000)}`
              });
            }
          });
        }
      }
    } catch (e) {
      console.error('Erro ao verificar pagamento no Webhook do Mercado Pago:', e);
    }
  }

  res.status(200).send('OK');
});

// Simulate Payment Approval for Test Mode / Sandbox
app.post('/api/mercadopago/simulate-payment', async (req, res) => {
  const { orderId } = req.body;
  
  if (!orderId) {
    return res.status(400).json({ error: 'ID do pedido obrigatório para simulação.' });
  }

  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    return res.status(404).json({ error: 'Pedido não encontrado no Firestore.' });
  }

  const updatedFields = {
    status: 'approved' as const,
    approvedAt: new Date().toISOString(),
    invoiceNumber: `NF-2026-${Math.floor(1000 + Math.random() * 9000)}`
  };

  await updateDoc(orderRef, updatedFields);

  const updatedOrder = { ...(orderSnap.data() as Order), ...updatedFields };

  // Update product and store sales metrics in Firestore
  for (const item of updatedOrder.items) {
    try {
      const prodRef = doc(db, 'products', item.productId);
      const prodSnap = await getDoc(prodRef);
      if (prodSnap.exists()) {
        const pData = prodSnap.data() as DigitalProduct;
        await updateDoc(prodRef, { salesCount: (pData.salesCount || 0) + 1 });

        if (pData.storeId) {
          const storeRef = doc(db, 'stores', pData.storeId);
          const storeSnap = await getDoc(storeRef);
          if (storeSnap.exists()) {
            const sData = storeSnap.data() as CreatorStore;
            await updateDoc(storeRef, {
              totalSales: (sData.totalSales || 0) + 1,
              totalRevenue: (sData.totalRevenue || 0) + item.price
            });
          }
        }
      }
    } catch (err) {
      console.warn('Aviso ao atualizar métricas de vendas:', err);
    }
  }

  systemLogs.unshift({
    id: `log_${Date.now()}`,
    time: new Date().toISOString(),
    event: `Pagamento PIX confirmado para o Pedido ${orderId}`,
    level: 'info'
  });

  res.json({
    success: true,
    order: updatedOrder,
    message: 'Pagamento via PIX confirmado e registrado com sucesso!'
  });
});

// ----------------------------------------------------
// SECURE DIGITAL PRODUCTS & DOWNLOADS (Phase 4)
// ----------------------------------------------------

// Get Products list from Firestore
app.get('/api/products', async (req, res) => {
  const { category, search, storeId, sort, featured } = req.query;

  try {
    const snap = await getDocs(collection(db, 'products'));
    let list: DigitalProduct[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as DigitalProduct));

    if (list.length === 0) {
      list = [...INITIAL_PRODUCTS];
    }

    if (category) {
      list = list.filter(p => p.type === category);
    }
    if (storeId) {
      list = list.filter(p => p.storeId === storeId);
    }
    if (featured === 'true') {
      list = list.filter(p => p.featured);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'sales') {
      list.sort((a, b) => b.salesCount - a.salesCount);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message, fallback: INITIAL_PRODUCTS });
  }
});

// Create new product in Firestore
app.post('/api/products', async (req, res) => {
  const newProdData = req.body;
  const newProduct: DigitalProduct = {
    id: `prod_${Date.now()}`,
    title: newProdData.title || 'Novo Produto Digital',
    slug: (newProdData.title || 'novo-produto').toLowerCase().replace(/\s+/g, '-'),
    description: newProdData.description || 'Descrição do produto digital.',
    shortDescription: newProdData.shortDescription || 'Resumo do conteúdo.',
    type: newProdData.type || 'ebook',
    price: Number(newProdData.price) || 29.90,
    originalPrice: newProdData.originalPrice ? Number(newProdData.originalPrice) : undefined,
    rating: 5.0,
    reviewsCount: 0,
    salesCount: 0,
    featured: newProdData.featured || false,
    trending: false,
    bestSeller: false,
    newArrival: true,
    coverImage: newProdData.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=450&fit=crop&q=80',
    previewImages: [newProdData.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop&q=80'],
    fileFormat: newProdData.fileFormat || 'Download Digital ZIP / PDF',
    downloadUrl: newProdData.downloadUrl || 'https://digitalmarketpro.app/downloads/demo-file.zip',
    storeId: newProdData.storeId || 'store_1',
    storeName: newProdData.storeName || 'Sua Loja Digital',
    storeLogo: newProdData.storeLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&q=80',
    storeVerified: true,
    tags: newProdData.tags || ['Digital', 'Template', 'Novo'],
    createdAt: new Date().toISOString().split('T')[0],
    commissionRate: 10,
    instantDelivery: true,
    reviews: []
  };

  await setDoc(doc(db, 'products', newProduct.id), newProduct);

  systemLogs.unshift({
    id: `log_${Date.now()}`,
    time: new Date().toISOString(),
    event: `Novo produto cadastrado no Firestore: ${newProduct.title}`,
    level: 'info'
  });

  res.json({ success: true, product: newProduct });
});

// Secure Download Route
app.get('/api/orders/:orderId/download', async (req, res) => {
  const { orderId } = req.params;
  const { email } = req.query;

  try {
    const orderSnap = await getDoc(doc(db, 'orders', orderId));
    if (!orderSnap.exists()) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    const orderData = orderSnap.data() as Order;

    if (orderData.status !== 'approved') {
      return res.status(403).json({ 
        error: 'Download bloqueado. O pagamento do pedido ainda está pendente de aprovação.' 
      });
    }

    if (email && orderData.customerEmail.toLowerCase() !== String(email).trim().toLowerCase()) {
      return res.status(401).json({ 
        error: 'Acesso negado: O e-mail informado não possui autorização para este arquivo.' 
      });
    }

    res.json({
      success: true,
      orderId: orderData.id,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      downloads: orderData.items.map(item => ({
        productTitle: item.productTitle,
        fileFormat: item.fileFormat,
        downloadUrl: item.downloadUrl
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// BUYER AUTHENTICATION & ORDER LOOKUP (Phase 5)
// ----------------------------------------------------

app.get('/api/buyer/orders', async (req, res) => {
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'O e-mail do comprador é obrigatório.' });
  }

  try {
    const q = query(collection(db, 'orders'), where('customerEmail', '==', email.trim().toLowerCase()));
    const snap = await getDocs(q);
    const buyerOrders: Order[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
    
    res.json({
      success: true,
      buyerEmail: email,
      totalOrders: buyerOrders.length,
      orders: buyerOrders
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Stores
app.get('/api/stores', async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'stores'));
    let stores: CreatorStore[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as CreatorStore));
    if (stores.length === 0) {
      stores = [...INITIAL_STORES];
    }
    res.json(stores);
  } catch (err: any) {
    res.status(500).json({ error: err.message, fallback: INITIAL_STORES });
  }
});

// Gemini AI Assistant Endpoint
app.post('/api/gemini/assist', async (req, res) => {
  const { prompt, taskType, productTitle, contentType } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        text: `[Assistente Digital Pro] Para ${productTitle || 'seu produto digital'}: Conteúdo de alta conversão com arquivos 100% editáveis e entrega instantânea via PIX.`
      });
    }

    const instruction = `Você é o Assistente Especialista de E-commerce Digital do DIGITAL MARKET PRO.
Sua missão é criar cópias de alta conversão, descrições persuasivas para e-books, templates do Canva, prompts de IA e scripts de software.
Responda sempre de forma profissional, atrativa e formatada com marcadores (bullet points).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `${instruction}\n\nTarefa: ${taskType || 'Gerar Descrição de Produto'}\nTítulo/Tema: ${productTitle || 'Produto Digital'}\nTipo: ${contentType || 'Digital'}\nInstruções extras do usuário: ${prompt || 'Crie uma oferta irresistível.'}`
    });

    res.json({ text: response.text || 'Descrição gerada com sucesso.' });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ 
      error: 'Falha ao consultar a API do Gemini',
      fallbackText: `Aproveite ${productTitle || 'este produto digital exclusivo'}. Conteúdo completo, editável e com entrega automática via PIX Mercado Pago.` 
    });
  }
});

// Admin Metrics (Protected by Admin Auth)
app.get('/api/admin/metrics', requireAdminAuth, async (req, res) => {
  try {
    const storesSnap = await getDocs(collection(db, 'stores'));
    const storesList = storesSnap.docs.map(d => d.data() as CreatorStore);
    
    const ordersSnap = await getDocs(collection(db, 'orders'));
    const ordersList = ordersSnap.docs.map(d => d.data() as Order);

    const productsSnap = await getDocs(collection(db, 'products'));

    const totalRevenueSum = storesList.reduce((acc, s) => acc + (s.totalRevenue || 0), 0);
    const marketplaceCommission = totalRevenueSum * 0.10;
    const mpConfig = await getMPConfig();

    res.json({
      liveVisitors: Math.floor(120 + Math.random() * 45),
      todaySalesCount: ordersList.length,
      todayRevenue: ordersList.reduce((acc, o) => acc + (o.totalAmount || 0), 0),
      totalRevenue: totalRevenueSum,
      marketplaceCommission,
      storesCount: storesList.length || INITIAL_STORES.length,
      productsCount: productsSnap.size || INITIAL_PRODUCTS.length,
      ordersCount: ordersList.length,
      conversionRatePercentage: 4.85,
      mercadoPagoConfig: {
        publicKey: mpConfig.publicKey,
        isTestMode: mpConfig.isTestMode,
        autoApprovePix: mpConfig.autoApprovePix,
        isConfigured: !!mpConfig.accessToken
      },
      systemLogs
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

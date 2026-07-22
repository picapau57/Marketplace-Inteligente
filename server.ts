import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_STORES, 
  INITIAL_MERCADOPAGO_CONFIG, 
  INITIAL_MONETIZATION_PLANS,
  INITIAL_ADS,
  INITIAL_TICKETS
} from './src/data/initialData.js';
import { DigitalProduct, CreatorStore, Order, MercadoPagoConfig } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory data persistence
  let productsStore: DigitalProduct[] = [...INITIAL_PRODUCTS];
  let storesData: CreatorStore[] = [...INITIAL_STORES];
  let mpConfig: MercadoPagoConfig = { ...INITIAL_MERCADOPAGO_CONFIG };
  let ordersData: Order[] = [];
  let systemLogs: { id: string; time: string; event: string; level: 'info' | 'warn' | 'error' }[] = [
    { id: 'log_1', time: new Date().toISOString(), event: 'Digital Market Pro Server initialized', level: 'info' },
    { id: 'log_2', time: new Date().toISOString(), event: 'Mercado Pago Webhook listener registered', level: 'info' }
  ];

  // Initialize Gemini AI Client lazily or safely
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
  // API ROUTES
  // ----------------------------------------------------

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'DIGITAL MARKET PRO Backend',
      timestamp: new Date().toISOString(),
      mercadoPagoStatus: mpConfig.accessToken ? 'connected' : 'unconfigured',
      geminiAiAvailable: !!process.env.GEMINI_API_KEY
    });
  });

  // Mercado Pago Configuration
  app.get('/api/mercadopago/config', (req, res) => {
    res.json(mpConfig);
  });

  app.post('/api/mercadopago/config', (req, res) => {
    const { accessToken, publicKey, clientSecret, webhookUrl, autoApprovePix, isTestMode } = req.body;
    mpConfig = {
      ...mpConfig,
      accessToken: accessToken || mpConfig.accessToken,
      publicKey: publicKey || mpConfig.publicKey,
      clientSecret: clientSecret || mpConfig.clientSecret,
      webhookUrl: webhookUrl || mpConfig.webhookUrl,
      autoApprovePix: autoApprovePix ?? mpConfig.autoApprovePix,
      isTestMode: isTestMode ?? mpConfig.isTestMode,
    };
    systemLogs.unshift({
      id: `log_${Date.now()}`,
      time: new Date().toISOString(),
      event: 'Mercado Pago API credentials updated by Admin',
      level: 'info'
    });
    res.json({ success: true, config: mpConfig });
  });

  // Create Mercado Pago PIX Order
  app.post('/api/mercadopago/create-pix', (req, res) => {
    const { customerName, customerEmail, items, totalAmount } = req.body;
    
    if (!items || !items.length || !totalAmount) {
      return res.status(400).json({ error: 'Missing required checkout items or amount' });
    }

    const orderId = `MP-${Math.floor(100000 + Math.random() * 900000)}`;
    const pixHash = `00020126580014br.gov.bcb.pix0136mp-${orderId.toLowerCase()}5204000053039865405${totalAmount.toFixed(2)}5802BR5920DIGITAL_MARKET_PRO6009SAO_PAULO62070503***6304ABCD`;

    const newOrder: Order = {
      id: orderId,
      customerName: customerName || 'Cliente Digital',
      customerEmail: customerEmail || 'cliente@exemplo.com',
      items,
      totalAmount,
      paymentMethod: 'pix',
      pixQrCode: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixHash)}`,
      pixCopiaECola: pixHash,
      status: 'pending',
      createdAt: new Date().toISOString(),
      mercadoPagoPaymentId: `PAY-${Date.now()}`
    };

    ordersData.unshift(newOrder);

    systemLogs.unshift({
      id: `log_${Date.now()}`,
      time: new Date().toISOString(),
      event: `New PIX order generated: ${orderId} for R$ ${totalAmount.toFixed(2)}`,
      level: 'info'
    });

    res.json({
      success: true,
      order: newOrder,
      qrCodeUrl: newOrder.pixQrCode,
      pixCopiaECola: newOrder.pixCopiaECola,
      expiresInMinutes: mpConfig.pixExpirationMinutes || 30
    });
  });

  // Simulate Mercado Pago PIX Payment Confirmation (Webhook simulation)
  app.post('/api/mercadopago/simulate-payment', (req, res) => {
    const { orderId } = req.body;
    const orderIndex = ordersData.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      // Create fallback dummy order if needed
      const simulatedOrder: Order = {
        id: orderId || `MP-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: 'Cliente Teste Mercado Pago',
        customerEmail: 'comprador@exemplo.com',
        items: [{
          productId: productsStore[0].id,
          productTitle: productsStore[0].title,
          productType: productsStore[0].type,
          price: productsStore[0].price,
          downloadUrl: productsStore[0].downloadUrl,
          fileFormat: productsStore[0].fileFormat,
          coverImage: productsStore[0].coverImage,
          storeName: productsStore[0].storeName
        }],
        totalAmount: productsStore[0].price,
        paymentMethod: 'pix',
        status: 'approved',
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
        invoiceNumber: `NF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        mercadoPagoPaymentId: `PAY-${Date.now()}`
      };
      ordersData.unshift(simulatedOrder);

      // Increment store sales & product sales
      const prod = productsStore.find(p => p.id === simulatedOrder.items[0].productId);
      if (prod) {
        prod.salesCount += 1;
        const st = storesData.find(s => s.id === prod.storeId);
        if (st) {
          st.totalSales += 1;
          st.totalRevenue += prod.price;
        }
      }

      return res.json({ success: true, order: simulatedOrder, message: 'Simulated payment approved via MP Webhook!' });
    }

    const targetOrder = ordersData[orderIndex];
    targetOrder.status = 'approved';
    targetOrder.approvedAt = new Date().toISOString();
    targetOrder.invoiceNumber = `NF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Update sales counters
    targetOrder.items.forEach(item => {
      const prod = productsStore.find(p => p.id === item.productId);
      if (prod) {
        prod.salesCount += 1;
        const st = storesData.find(s => s.id === prod.storeId);
        if (st) {
          st.totalSales += 1;
          st.totalRevenue += item.price;
        }
      }
    });

    systemLogs.unshift({
      id: `log_${Date.now()}`,
      time: new Date().toISOString(),
      event: `Mercado Pago Webhook: PIX payment approved for Order ${targetOrder.id}`,
      level: 'info'
    });

    res.json({
      success: true,
      order: targetOrder,
      message: 'Payment confirmed automatically via Mercado Pago Webhook!'
    });
  });

  // Get Products
  app.get('/api/products', (req, res) => {
    const { category, search, storeId, sort, featured } = req.query;
    let list = [...productsStore];

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
        p.tags.some(t => t.toLowerCase().includes(q))
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
  });

  // Create Product
  app.post('/api/products', (req, res) => {
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

    productsStore.unshift(newProduct);

    systemLogs.unshift({
      id: `log_${Date.now()}`,
      time: new Date().toISOString(),
      event: `New product published: ${newProduct.title} (R$ ${newProduct.price})`,
      level: 'info'
    });

    res.json({ success: true, product: newProduct });
  });

  // Get Stores
  app.get('/api/stores', (req, res) => {
    res.json(storesData);
  });

  // Gemini AI Assistant Endpoint for Creators & Descriptions
  app.post('/api/gemini/assist', async (req, res) => {
    const { prompt, taskType, productTitle, contentType } = req.body;

    try {
      const ai = getGeminiClient();
      if (!ai) {
        // Fallback response if GEMINI_API_KEY is missing
        return res.json({
          text: `[Assistente Digital Pro] Para ${productTitle || 'seu produto digital'}: Este produto incrível foi desenvolvido para proporcionar máxima eficiência e resultados profissionais. Inclui material em alta resolução, arquivos 100% editáveis e entrega instantânea via PIX.`
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

  // Admin Metrics & Health
  app.get('/api/admin/metrics', (req, res) => {
    const totalRevenueSum = storesData.reduce((acc, s) => acc + s.totalRevenue, 0);
    const marketplaceCommission = totalRevenueSum * 0.10; // 10% fee

    res.json({
      liveVisitors: Math.floor(120 + Math.random() * 45),
      todaySalesCount: ordersData.length + 18,
      todayRevenue: ordersData.reduce((acc, o) => acc + o.totalAmount, 0) + 2450.00,
      totalRevenue: totalRevenueSum + 180000,
      marketplaceCommission,
      storesCount: storesData.length,
      productsCount: productsStore.length,
      ordersCount: ordersData.length + 320,
      abandonedCartsCount: 14,
      conversionRatePercentage: 4.85,
      mercadoPagoConfig: mpConfig,
      systemLogs
    });
  });

  // ----------------------------------------------------
  // VITE MIDDLEWARE SETUP
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DIGITAL MARKET PRO Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

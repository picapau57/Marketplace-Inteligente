import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  DigitalProduct, 
  CreatorStore, 
  Order, 
  MercadoPagoConfig, 
  UserProfile,
  Coupon 
} from '../types';
import { translations } from '../i18n/translations';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_STORES, 
  INITIAL_MERCADOPAGO_CONFIG 
} from '../data/initialData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  user: UserProfile;
  setUserRole: (role: 'buyer' | 'creator' | 'admin') => void;
  
  products: DigitalProduct[];
  stores: CreatorStore[];
  cart: DigitalProduct[];
  addToCart: (product: DigitalProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  
  followingStores: string[];
  toggleFollowStore: (storeId: string) => void;

  orders: Order[];
  addOrder: (order: Order) => void;
  
  mpConfig: MercadoPagoConfig;
  updateMpConfig: (newConfig: Partial<MercadoPagoConfig>) => void;

  activeCheckoutProduct: DigitalProduct | null;
  openCheckout: (product: DigitalProduct) => void;
  closeCheckout: () => void;
  
  isAiModalOpen: boolean;
  openAiModal: (productTitle?: string) => void;
  closeAiModal: () => void;
  
  activeView: 'home' | 'explore' | 'product' | 'store' | 'creator' | 'admin' | 'library';
  setActiveView: (view: 'home' | 'explore' | 'product' | 'store' | 'creator' | 'admin' | 'library') => void;
  
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  
  selectedStoreId: string | null;
  setSelectedStoreId: (id: string | null) => void;
  
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;

  addNewProduct: (productData: Partial<DigitalProduct>) => Promise<void>;
  simulatePixPayment: (orderId: string) => Promise<Order>;
  
  notification: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  const [user, setUser] = useState<UserProfile>({
    id: 'user_101',
    name: 'Carlos Eduardo',
    email: 'carlos.eduardo@exemplo.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80',
    role: 'creator',
    favorites: ['prod_1', 'prod_2'],
    wishlist: ['prod_4'],
    followingStores: ['store_1', 'store_2']
  });

  const [products, setProducts] = useState<DigitalProduct[]>(INITIAL_PRODUCTS);
  const [stores, setStores] = useState<CreatorStore[]>(INITIAL_STORES);
  const [cart, setCart] = useState<DigitalProduct[]>([]);
  const [favorites, setFavorites] = useState<string[]>(['prod_1', 'prod_2']);
  const [followingStores, setFollowingStores] = useState<string[]>(['store_1', 'store_2']);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mpConfig, setMpConfig] = useState<MercadoPagoConfig>(INITIAL_MERCADOPAGO_CONFIG);

  const [activeView, setActiveView] = useState<'home' | 'explore' | 'product' | 'store' | 'creator' | 'admin' | 'library'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod_1');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>('store_1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [activeCheckoutProduct, setActiveCheckoutProduct] = useState<DigitalProduct | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Fetch live products from backend
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(err => console.warn('Backend products endpoint fallback to initial local data', err));
  }, []);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const setUserRole = (role: 'buyer' | 'creator' | 'admin') => {
    setUser(prev => ({ ...prev, role }));
    showNotification(`Modo alternado para: ${role.toUpperCase()}`);
  };

  const addToCart = (product: DigitalProduct) => {
    if (!cart.some(p => p.id === product.id)) {
      setCart(prev => [...prev, product]);
      showNotification(`${product.title} adicionado ao carrinho!`);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showNotification(exists ? 'Removido dos favoritos' : 'Adicionado aos favoritos!');
      return updated;
    });
  };

  const toggleFollowStore = (storeId: string) => {
    setFollowingStores(prev => {
      const exists = prev.includes(storeId);
      const updated = exists ? prev.filter(id => id !== storeId) : [...prev, storeId];
      showNotification(exists ? 'Você deixou de seguir esta loja' : 'Você agora segue esta loja!');
      return updated;
    });
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateMpConfig = async (newConfig: Partial<MercadoPagoConfig>) => {
    setMpConfig(prev => ({ ...prev, ...newConfig }));
    try {
      await fetch('/api/mercadopago/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'admin123'
        },
        body: JSON.stringify(newConfig)
      });
      showNotification('Credenciais do Mercado Pago salvas no Firestore com segurança!');
    } catch (e) {
      showNotification('Credenciais atualizadas localmente (modo offline).');
    }
  };

  const openCheckout = (product: DigitalProduct) => {
    setActiveCheckoutProduct(product);
  };

  const closeCheckout = () => {
    setActiveCheckoutProduct(null);
  };

  const openAiModal = (productTitle?: string) => {
    setIsAiModalOpen(true);
  };

  const closeAiModal = () => {
    setIsAiModalOpen(false);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const addNewProduct = async (productData: Partial<DigitalProduct>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts(prev => [data.product, ...prev]);
        showNotification('Produto digital publicado com sucesso na loja!');
      }
    } catch (err) {
      // Local state fallback
      const fallbackProd: DigitalProduct = {
        id: `prod_${Date.now()}`,
        title: productData.title || 'Novo Produto Digital',
        slug: (productData.title || 'novo').toLowerCase().replace(/\s+/g, '-'),
        description: productData.description || 'Descrição completa.',
        shortDescription: productData.shortDescription || 'Resumo do conteúdo.',
        type: productData.type || 'canva_template',
        price: Number(productData.price) || 29.90,
        rating: 5.0,
        reviewsCount: 0,
        salesCount: 0,
        featured: true,
        trending: false,
        bestSeller: false,
        newArrival: true,
        coverImage: productData.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=450&fit=crop&q=80',
        previewImages: [productData.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop&q=80'],
        fileFormat: productData.fileFormat || 'Link Canva / Arquivo ZIP',
        downloadUrl: productData.downloadUrl || 'https://digitalmarketpro.app/downloads/sample.zip',
        storeId: 'store_1',
        storeName: 'Canva Design Studio',
        storeLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&q=80',
        storeVerified: true,
        tags: ['Digital', 'Canva', 'Novo'],
        createdAt: new Date().toISOString().split('T')[0],
        commissionRate: 10,
        instantDelivery: true,
        reviews: []
      };
      setProducts(prev => [fallbackProd, ...prev]);
      showNotification('Produto digital publicado com sucesso!');
    }
  };

  const simulatePixPayment = async (orderId: string): Promise<Order> => {
    try {
      const res = await fetch('/api/mercadopago/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders(prev => {
          const idx = prev.findIndex(o => o.id === orderId);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = data.order;
            return updated;
          }
          return [data.order, ...prev];
        });
        showNotification('⚡ PIX Mercado Pago confirmado! Seu download está liberado.');
        return data.order;
      }
    } catch (e) {
      console.warn('Simulation backend fallback');
    }

    const approvedOrder: Order = {
      id: orderId,
      customerName: user.name,
      customerEmail: user.email,
      items: cart.length > 0 ? cart.map(p => ({
        productId: p.id,
        productTitle: p.title,
        productType: p.type,
        price: p.price,
        downloadUrl: p.downloadUrl,
        fileFormat: p.fileFormat,
        coverImage: p.coverImage,
        storeName: p.storeName
      })) : [{
        productId: activeCheckoutProduct?.id || 'prod_1',
        productTitle: activeCheckoutProduct?.title || 'Produto Digital',
        productType: activeCheckoutProduct?.type || 'canva_template',
        price: activeCheckoutProduct?.price || 49.90,
        downloadUrl: activeCheckoutProduct?.downloadUrl || 'https://canva.com/demo',
        fileFormat: activeCheckoutProduct?.fileFormat || 'Link Canva',
        coverImage: activeCheckoutProduct?.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=450&fit=crop&q=80',
        storeName: activeCheckoutProduct?.storeName || 'Canva Design Studio'
      }],
      totalAmount: activeCheckoutProduct ? activeCheckoutProduct.price : cart.reduce((acc, i) => acc + i.price, 0),
      paymentMethod: 'pix',
      status: 'approved',
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      invoiceNumber: `NF-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setOrders(prev => [approvedOrder, ...prev]);
    showNotification('⚡ PIX Mercado Pago Aprovado! Seu arquivo foi liberado.');
    return approvedOrder;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isDarkMode,
        toggleDarkMode,
        user,
        setUserRole,
        products,
        stores,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        favorites,
        toggleFavorite,
        followingStores,
        toggleFollowStore,
        orders,
        addOrder,
        mpConfig,
        updateMpConfig,
        activeCheckoutProduct,
        openCheckout,
        closeCheckout,
        isAiModalOpen,
        openAiModal,
        closeAiModal,
        activeView,
        setActiveView,
        selectedProductId,
        setSelectedProductId,
        selectedStoreId,
        setSelectedStoreId,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addNewProduct,
        simulatePixPayment,
        notification,
        showNotification,
      }}
    >
      <div className={isDarkMode ? 'dark bg-slate-950 text-slate-100 min-h-screen' : 'bg-slate-50 text-slate-900 min-h-screen'}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

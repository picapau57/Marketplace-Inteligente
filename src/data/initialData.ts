import { Category, CreatorStore, DigitalProduct, MonetizationPlan, AdBanner, SupportTicket, MercadoPagoConfig } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', slug: 'canva_template', nameKey: 'cat_canva_template', icon: 'Palette', descriptionKey: 'Templates editáveis no Canva para Instagram, TikTok e Branding', count: 340 },
  { id: '2', slug: 'ai_prompt', nameKey: 'cat_ai_prompt', icon: 'Sparkles', descriptionKey: 'Prompts de ChatGPT, Midjourney e Claude testados e validados', count: 210 },
  { id: '3', slug: 'ebook', nameKey: 'cat_ebook', icon: 'BookOpen', descriptionKey: 'E-books educativos, guias passo a passo e livros digitais', count: 480 },
  { id: '4', slug: 'course', nameKey: 'cat_course', icon: 'Video', descriptionKey: 'Treinamentos em vídeo, masterclasses e cursos estruturados', count: 195 },
  { id: '5', slug: 'software', nameKey: 'cat_software', icon: 'Code', descriptionKey: 'SaaS, scripts, extensões e automações em Python / Node', count: 120 },
  { id: '6', slug: 'template', nameKey: 'cat_template', icon: 'Layout', descriptionKey: 'Templates de Notion, Webflow, Tailwind e WordPress', count: 310 },
  { id: '7', slug: 'design_pack', nameKey: 'cat_design_pack', icon: 'Layers', descriptionKey: 'Kits de UI/UX, fontes, vetores, mockups e 3D assets', count: 260 },
  { id: '8', slug: 'business_form', nameKey: 'cat_business_form', icon: 'FileText', descriptionKey: 'Contratos, planilhas financeiras e documentos jurídicos', count: 180 },
  { id: '9', slug: 'music', nameKey: 'cat_music', icon: 'Music', descriptionKey: 'Beats, efeitos sonoros (SFX), trilhas livres de direitos', count: 145 },
  { id: '10', slug: 'subscription', nameKey: 'cat_subscription', icon: 'Repeat', descriptionKey: 'Clubes de assinatura de conteúdo e comunidade VIP', count: 85 },
];

export const INITIAL_STORES: CreatorStore[] = [
  {
    id: 'store_1',
    name: 'Canva Design Studio',
    slug: 'canva-design-studio',
    tagline: 'Templates de Alto Impacto para Redes Sociais',
    description: 'Criamos kits visuais completos editáveis no Canva para empreendedores, agências e influenciadores digitais.',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=400&fit=crop&q=80',
    ownerName: 'Juliana Costa',
    ownerEmail: 'juliana@canvastudio.com',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
    verified: true,
    rating: 4.9,
    followersCount: 3840,
    productsCount: 42,
    totalSales: 1290,
    totalRevenue: 64500,
    plan: 'enterprise',
    createdAt: '2025-01-15',
    featuredBadge: true,
    pixKey: 'juliana@canvastudio.com',
  },
  {
    id: 'store_2',
    name: 'Prompt Master AI',
    slug: 'prompt-master-ai',
    tagline: 'Engenharia de Prompts para Produtividade Máxima',
    description: 'Prompts avançados para Midjourney, ChatGPT-4, Claude e Gemini focados em marketing, cópia e geração de imagens 8K.',
    logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&h=200&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop&q=80',
    ownerName: 'Gabriel Santos',
    ownerEmail: 'gabriel@promptmaster.io',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
    verified: true,
    rating: 4.95,
    followersCount: 5210,
    productsCount: 18,
    totalSales: 2450,
    totalRevenue: 98000,
    plan: 'pro',
    createdAt: '2025-02-01',
    featuredBadge: true,
  },
  {
    id: 'store_3',
    name: 'CodeCraft Labs',
    slug: 'codecraft-labs',
    tagline: 'SaaS Boilerplates & Automações Node.js',
    description: 'Sistemas prontos para produção, robôs de automação de vendas via WhatsApp e scripts Python para web scraping.',
    logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=400&fit=crop&q=80',
    ownerName: 'Lucas Oliveira',
    ownerEmail: 'lucas@codecraft.dev',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
    verified: true,
    rating: 4.88,
    followersCount: 1940,
    productsCount: 12,
    totalSales: 610,
    totalRevenue: 122000,
    plan: 'pro',
    createdAt: '2025-03-10',
  },
];

export const INITIAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'prod_1',
    title: 'Kit Social Media 2026 - 1.200 Templates Editáveis no Canva',
    slug: 'kit-social-media-canva-2026',
    description: 'O maior e mais atualizado pacote de artes editáveis no Canva do mercado. Inclui posts para Feed, Stories, Reells, Carrosséis Infinitos e Banners para todas as nichos (Estética, Direito, Saúde, Imóveis, Fitness e Finanças).',
    shortDescription: '1.200+ artes profissionais no Canva prontas para usar com 1 clique.',
    type: 'canva_template',
    price: 49.90,
    originalPrice: 149.90,
    rating: 4.9,
    reviewsCount: 142,
    salesCount: 890,
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=450&fit=crop&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop&q=80'
    ],
    fileFormat: 'Link Direto para o Canva Pro / Free',
    downloadUrl: 'https://canva.com/design/demo-template-pack-digital-market-pro',
    storeId: 'store_1',
    storeName: 'Canva Design Studio',
    storeLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&q=80',
    storeVerified: true,
    tags: ['Canva', 'Instagram', 'Feed', 'Social Media', 'Design'],
    createdAt: '2026-06-01',
    commissionRate: 10,
    instantDelivery: true,
    reviews: [
      { id: 'r1', userName: 'Mariana Silva', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80', rating: 5, comment: 'Excelente qualidade! Economizei horas de trabalho no Instagram do meu cliente.', date: '2026-07-10' },
      { id: 'r2', userName: 'Rodrigo Lima', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80', rating: 5, comment: 'Aprovado instantaneamente após o PIX Mercado Pago. Download na hora!', date: '2026-07-18' }
    ]
  },
  {
    id: 'prod_2',
    title: 'Super Pack 500+ Prompts Avançados para ChatGPT e Midjourney v6',
    slug: 'super-pack-prompts-chatgpt-midjourney',
    description: 'Coletânea definitiva de prompts testados para criação de textos persuasivos de vendas (Copywriting), scripts para Reels, e ilustrações fotorrealistas em 8K no Midjourney.',
    shortDescription: 'Multiplique sua produtividade por 10x com comandos de IA prontos.',
    type: 'ai_prompt',
    price: 39.90,
    originalPrice: 99.00,
    rating: 4.95,
    reviewsCount: 218,
    salesCount: 1540,
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=450&fit=crop&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop&q=80'
    ],
    fileFormat: 'PDF Interativo + Notion Database',
    downloadUrl: 'https://digitalmarketpro.app/downloads/prompts-pack-v6.pdf',
    storeId: 'store_2',
    storeName: 'Prompt Master AI',
    storeLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&h=200&fit=crop&q=80',
    storeVerified: true,
    tags: ['AI', 'ChatGPT', 'Midjourney', 'Copywriting', 'Prompts'],
    createdAt: '2026-06-12',
    commissionRate: 10,
    instantDelivery: true,
    reviews: [
      { id: 'r3', userName: 'Carla Rocha', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80', rating: 5, comment: 'Os prompts de Midjourney funcionam perfeitamente. Fotos ultra realistas!', date: '2026-07-05' }
    ]
  },
  {
    id: 'prod_3',
    title: 'E-book: O Guia Definitivo das Vendas no Mercado Digital 2026',
    slug: 'ebook-guia-vendas-mercado-digital',
    description: 'Aprenda do zero como estruturar um funil de vendas automático para infoprodutos e produtos digitais. Métodos validados de tráfego pago (Meta Ads e TikTok Ads), oferta irresistível e e-mail marketing.',
    shortDescription: 'Aprenda a construir um negócio lucrativo com vendas automáticas.',
    type: 'ebook',
    price: 29.90,
    originalPrice: 79.90,
    rating: 4.85,
    reviewsCount: 88,
    salesCount: 410,
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: true,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=450&fit=crop&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop&q=80'
    ],
    fileFormat: 'PDF (180 Páginas) + Audiobook MP3',
    downloadUrl: 'https://digitalmarketpro.app/downloads/guia-vendas-digital.pdf',
    storeId: 'store_2',
    storeName: 'Prompt Master AI',
    storeLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&h=200&fit=crop&q=80',
    storeVerified: true,
    tags: ['Ebook', 'Vendas', 'Marketing Digital', 'Infoprodutos'],
    createdAt: '2026-07-01',
    commissionRate: 10,
    instantDelivery: true,
    reviews: []
  },
  {
    id: 'prod_4',
    title: 'SaaS Starter Kit - React 19, Express, Tailwind e PIX Mercado Pago',
    slug: 'saas-starter-kit-react-express-pix',
    description: 'Código fonte completo e modular em TypeScript para você lançar sua própria plataforma de assinaturas ou marketplace em poucas horas. Inclui autenticação JWT, integração nativa Mercado Pago PIX, painel admin e banco de dados.',
    shortDescription: 'Boilerplate SaaS completo pronto para deploy com PIX automático.',
    type: 'software',
    price: 199.00,
    originalPrice: 499.00,
    rating: 4.98,
    reviewsCount: 64,
    salesCount: 230,
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: true,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=450&fit=crop&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop&q=80'
    ],
    fileFormat: 'Arquivo ZIP Repository GitHub (12 MB)',
    downloadUrl: 'https://digitalmarketpro.app/downloads/saas-starter-kit-v2.zip',
    storeId: 'store_3',
    storeName: 'CodeCraft Labs',
    storeLogo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop&q=80',
    storeVerified: true,
    tags: ['Software', 'React', 'Node.js', 'Mercado Pago', 'TypeScript'],
    createdAt: '2026-07-10',
    commissionRate: 10,
    instantDelivery: true,
    reviews: [
      { id: 'r4', userName: 'Fernando Dias', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80', rating: 5, comment: 'Código extremamente limpo e bem documentado. Salvei pelo menos 3 semanas de desenvolvimento!', date: '2026-07-15' }
    ]
  },
  {
    id: 'prod_5',
    title: 'Kit de Contratos Jurídicos e Formulários de Negócios 2026',
    slug: 'kit-contratos-juridicos-formularios-negocios',
    description: 'Mais de 80 modelos de contratos editáveis em Word e PDF elaborados por advogados especialistas: Contrato de Prestação de Serviços, Termo de Confidencialidade (NDA), Contrato de Parceria, Termos de Uso de Site e LGPD.',
    shortDescription: 'Documentos e contratos prontos para proteger sua empresa.',
    type: 'business_form',
    price: 59.90,
    originalPrice: 199.00,
    rating: 4.88,
    reviewsCount: 72,
    salesCount: 520,
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: false,
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&h=450&fit=crop&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&h=600&fit=crop&q=80'
    ],
    fileFormat: 'Pacote DOCX + PDF Editável (25 MB)',
    downloadUrl: 'https://digitalmarketpro.app/downloads/kit-contratos-2026.zip',
    storeId: 'store_1',
    storeName: 'Canva Design Studio',
    storeLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&q=80',
    storeVerified: true,
    tags: ['Contratos', 'LGPD', 'Documentos', 'Negócios'],
    createdAt: '2026-05-20',
    commissionRate: 10,
    instantDelivery: true,
    reviews: []
  },
  {
    id: 'prod_6',
    title: 'Masterclass Completa: Tráfego Pago para Produtos Digitais',
    slug: 'masterclass-trafego-pago-produtos-digitais',
    description: 'Treinamento prático em vídeo (mais de 12 horas em HD) ensinando como escalar campanhas de anúncios com ROI positivo. Estratégias para Meta Ads, Google Ads e TikTok Ads.',
    shortDescription: 'Aprenda a escalar suas vendas digitais com anúncios lucrativos.',
    type: 'course',
    price: 147.00,
    originalPrice: 397.00,
    rating: 4.92,
    reviewsCount: 110,
    salesCount: 380,
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: false,
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=450&fit=crop&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80'
    ],
    fileFormat: 'Acesso Imediato à Plataforma de Aulas HD',
    downloadUrl: 'https://digitalmarketpro.app/courses/access-masterclass-trafego',
    storeId: 'store_2',
    storeName: 'Prompt Master AI',
    storeLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&h=200&fit=crop&q=80',
    storeVerified: true,
    tags: ['Curso', 'Tráfego Pago', 'Facebook Ads', 'Marketing'],
    createdAt: '2026-04-18',
    commissionRate: 10,
    instantDelivery: true,
    reviews: []
  }
];

export const INITIAL_MONETIZATION_PLANS: MonetizationPlan[] = [
  {
    id: 'plan_free',
    name: 'Plano Grátis',
    priceMonthly: 0,
    priceAnnual: 0,
    commissionFee: 15,
    maxProducts: 5,
    features: [
      'Até 5 produtos digitais cadastrados',
      'Taxa de comissão: 15% por venda',
      'Integração PIX Mercado Pago',
      'Entrega automática de arquivos',
      'Suporte via e-mail em até 48h'
    ]
  },
  {
    id: 'plan_pro',
    name: 'Plano Pro Store',
    priceMonthly: 49.90,
    priceAnnual: 479.00,
    commissionFee: 8,
    maxProducts: 50,
    features: [
      'Até 50 produtos digitais',
      'Taxa de comissão reduzida: 8% por venda',
      'Domínio próprio personalizado',
      'Cupons de desconto ilimitados',
      'Selo de Criador Verificado',
      'Gerador de Prompts e Descrições com IA Gemini',
      'Suporte Prioritário VIP'
    ],
    popular: true
  },
  {
    id: 'plan_enterprise',
    name: 'Plano Enterprise VIP',
    priceMonthly: 129.90,
    priceAnnual: 1190.00,
    commissionFee: 5,
    maxProducts: 999,
    features: [
      'Produtos digitais ILIMITADOS',
      'Menor taxa de comissão: apenas 5%',
      'Destaque no Banner da Homepage',
      'Recurso de Assinaturas e Comunidade de Membros',
      'Sistema de Afiliados Exclusivo para sua Loja',
      'Gerente de Contas Dedicado',
      'Taxa zero de saque de comissões'
    ]
  }
];

export const INITIAL_MERCADOPAGO_CONFIG: MercadoPagoConfig = {
  accessToken: 'APP_USR-8392104921048201-072210-92a10b4f8c90-1049281',
  publicKey: 'APP_USR-f38192a0-4921-481a-b302-8192a019283a',
  clientSecret: 'secret_mp_digital_market_pro_2026',
  webhookUrl: 'https://digital-market-pro.run.app/api/mercadopago/webhook',
  autoApprovePix: true,
  isTestMode: true,
  pixExpirationMinutes: 30,
};

export const INITIAL_ADS: AdBanner[] = [
  {
    id: 'ad_1',
    title: 'Crie sua Loja Digital em 2 Minutos - Comece Grátis',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=300&fit=crop&q=80',
    linkUrl: '/creator-studio',
    location: 'homepage_hero',
    active: true,
    impressions: 14500,
    clicks: 1240
  },
  {
    id: 'ad_2',
    title: 'Super Lançamento: Templates Canva Pro 2026 com 70% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=300&fit=crop&q=80',
    linkUrl: '/product/kit-social-media-canva-2026',
    location: 'category_top',
    active: true,
    impressions: 8900,
    clicks: 720
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'ticket_101',
    userName: 'Marcos Vinícius',
    userEmail: 'marcos@gmail.com',
    subject: 'Dúvida sobre o link de download após o PIX',
    message: 'Fiz o pagamento via PIX Mercado Pago e o status aprovou em 2 segundos. Onde baixo o e-book?',
    status: 'resolved',
    priority: 'low',
    createdAt: '2026-07-20 14:30'
  },
  {
    id: 'ticket_102',
    userName: 'Camila Ferreira',
    userEmail: 'camila@design.com',
    subject: 'Como cadastrar meu domínio próprio na loja?',
    message: 'Sou assinante do Plano Pro e gostaria de configurar meu subdomínio personalizado na plataforma.',
    status: 'open',
    priority: 'medium',
    createdAt: '2026-07-22 09:15'
  }
];

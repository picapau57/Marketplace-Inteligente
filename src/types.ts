export type Language = 'pt' | 'en' | 'es';

export type ProductType = 
  | 'ebook'
  | 'course'
  | 'template'
  | 'canva_template'
  | 'ai_prompt'
  | 'software'
  | 'design_pack'
  | 'music'
  | 'photo'
  | 'video'
  | 'pdf'
  | 'document'
  | 'business_form'
  | 'subscription'
  | 'membership';

export interface Category {
  id: string;
  slug: ProductType;
  nameKey: string;
  icon: string;
  descriptionKey: string;
  count: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DigitalProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  type: ProductType;
  price: number; // in BRL or primary currency
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  featured: boolean;
  trending: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  coverImage: string;
  previewImages: string[];
  fileFormat: string; // e.g. "ZIP (350 MB)", "PDF (24 Pages)", "Canva Link", "Notion Template"
  downloadUrl: string;
  filePath?: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  storeVerified: boolean;
  tags: string[];
  createdAt: string;
  reviews: Review[];
  commissionRate: number; // e.g., 10%
  demoUrl?: string;
  instantDelivery: boolean;
}

export interface CreatorStore {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  banner: string;
  ownerName: string;
  ownerEmail: string;
  ownerAvatar: string;
  verified: boolean;
  rating: number;
  followersCount: number;
  productsCount: number;
  totalSales: number;
  totalRevenue: number;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  featuredBadge?: boolean;
  pixKey?: string;
  customDomain?: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productType: ProductType;
  price: number;
  downloadUrl: string;
  fileFormat: string;
  coverImage: string;
  storeName: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'pix';
  pixQrCode?: string;
  pixCopiaECola?: string;
  status: 'pending' | 'approved' | 'failed' | 'refunded';
  createdAt: string;
  approvedAt?: string;
  invoiceNumber?: string;
  mercadoPagoPaymentId?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  active: boolean;
  storeId?: string; // string or undefined for global
  usesCount: number;
  expiresAt: string;
}

export interface MercadoPagoConfig {
  accessToken: string;
  publicKey: string;
  clientSecret: string;
  webhookUrl: string;
  autoApprovePix: boolean;
  isTestMode: boolean;
  pixExpirationMinutes: number;
}

export interface MonetizationPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  commissionFee: number; // e.g. 5%
  maxProducts: number;
  features: string[];
  popular?: boolean;
}

export interface AdBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  location: 'homepage_hero' | 'category_top' | 'sidebar' | 'checkout';
  active: boolean;
  impressions: number;
  clicks: number;
}

export interface SupportTicket {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface VisitorMetric {
  date: string;
  liveVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  salesVolume: number;
  countryBreakdown: { country: string; code: string; visitors: number; percentage: number }[];
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  databaseStatus: 'connected' | 'disconnected';
  redisStatus: 'connected' | 'disconnected';
  mercadoPagoStatus: 'operational' | 'degraded';
  lastBackupAt: string;
}

export interface CustomerMessage {
  id: string;
  storeId: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  date: string;
  replied: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'buyer' | 'creator' | 'admin';
  favorites: string[]; // product IDs
  wishlist: string[];
  followingStores: string[]; // store IDs
}

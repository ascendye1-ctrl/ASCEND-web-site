

export interface Product {
  id: number;
  name: string;
  nameAr?: string; // Arabic Name
  price: number;
  category: string;
  categoryAr?: string; // Arabic Category
  image: string;
  description: string;
  descriptionAr?: string; // Arabic Description
  rating: number;
  // Extended properties for filters/admin
  colors?: string[];
  brand?: string;
  inStock?: boolean;
  // Added properties
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  vendorId?: number;
  // Inventory
  cost?: number;
  sku?: string;
  quantity?: number;
  reorderPoint?: number;
  leadTime?: number;
}

export interface CartItem extends Product {
  quantity: number;
  vendorName?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  type?: 'merchant' | 'product';
}

export interface Vendor {
  id: number;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  rating: number;
  reviews: Review[];
  joinedDate: string;
  isVerified: boolean;
  // Aggregator Fields
  platformType?: 'Shopify' | 'WooCommerce' | 'Magento' | 'Custom';
  status?: 'active' | 'pending' | 'suspended';
  apiKey?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  status: 'active' | 'inactive' | 'blocked';
  avatar?: string;
  location?: string;
  // Aggregator Fields
  segment?: 'VIP' | 'New' | 'At Risk' | 'Loyal';
  ltv?: number;
  firstPurchaseDate?: string;
  country?: string;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  itemsCount: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Payout {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'processing' | 'failed';
  method: string; // e.g., 'Bank Transfer ****4242'
  commissionDeducted: number;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  platform: 'Google' | 'Facebook' | 'Instagram' | 'Email';
  status: 'active' | 'paused' | 'ended';
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  date?: string;
  source?: string;
}

// ETL / Data Pipeline Types
export interface Pipeline {
  id: string;
  name: string;
  sourceType: 'CSV' | 'JSON' | 'API';
  lastRun: string;
  status: 'success' | 'failed' | 'idle';
  recordsProcessed: number;
}

export interface TransformationRule {
  sourceField: string;
  targetField: string;
  transform: 'none' | 'uppercase' | 'lowercase' | 'trim' | 'currency_usd' | 'round_number';
}

export type ViewState = 
  | 'HOME' 
  | 'PRODUCT_DETAIL' 
  | 'PAYMENT_GATE' // Added Payment Gate Step
  | 'CHECKOUT_SUCCESS' 
  | 'ADMIN_DASHBOARD' 
  | 'SHOP' 
  | 'COLLECTIONS' 
  | 'ABOUT' 
  | 'CAREERS' 
  | 'PRIVACY'
  | 'TERMS'
  | 'SHIPPING'
  | 'RETURNS'
  | 'NOT_FOUND'
  | 'VENDOR_ONBOARDING'
  | 'STORE_FRONT';

export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface FilterState {
  category: string[];
  priceRange: [number, number];
  brands: string[];
  colors: string[];
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
}
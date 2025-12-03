export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'user' | 'partner' | 'admin';
  preferences: {
    language: 'ru' | 'kz' | 'en';
    notifications: boolean;
    location?: {
      lat: number;
      lng: number;
    };
  };
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Partner {
  id: string;
  name: string;
  type: 'restaurant' | 'store' | 'cafe' | 'bakery' | 'fashion_store';
  description: string;
  logo_url?: string;
  image_urls: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  business_hours: {
    [key: string]: {
      open: string;
      close: string;
      is_open: boolean;
    };
  };
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  // Enhanced seller profile fields
  owner_name?: string;
  tax_id?: string;
  bank_details?: {
    bank_name: string;
    account_number: string;
    bik: string;
  };
  documents?: {
    certificate_url?: string;
    license_url?: string;
    tax_certificate_url?: string;
  };
  settings?: {
    auto_confirm_orders: boolean;
    notification_preferences: {
      new_orders: boolean;
      low_stock: boolean;
      reviews: boolean;
    };
    commission_rate: number;
  };
  stats?: {
    total_products: number;
    total_orders: number;
    total_revenue: number;
    average_rating: number;
    products_sold: number;
  };
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: 'food' | 'fashion';
  subcategory: string;
  images: string[];
  original_price: number;
  discount_price: number;
  discount_percentage: number;
  quantity: number;
  unit: string;
  expiry_date?: Date;
  pickup_time_start: string;
  pickup_time_end: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  partner_id: string;
  tags: string[];
  allergens?: string[];
  condition: 'new' | 'like_new' | 'good' | 'fair';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  discount: number;
  commission: number;
  final_total: number;
  promo_code?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  product: Product;
  quantity: number;
  added_at: Date;
}

export interface Order {
  id: string;
  user_id: string;
  cart: Cart;
  status: 'pending' | 'confirmed' | 'paid' | 'ready' | 'picked_up' | 'cancelled' | 'refunded';
  payment_method: 'kaspi' | 'halyk' | 'card' | 'cash';
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  pickup_code: string;
  pickup_time?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  id: string;
  user_id: string;
  product_id?: string;
  partner_id?: string;
  order_id: string;
  rating: number;
  comment?: string;
  images?: string[];
  created_at: Date;
}

export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  event: string;
  product_id?: string;
  order_id?: string;
  data?: any;
  timestamp: Date;
  source: 'web' | 'mobile' | 'api';
  user_agent?: string;
  ip_address?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order' | 'product' | 'system' | 'promotion';
  data?: any;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high';
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface ProductFilters {
  category?: 'food' | 'fashion';
  subcategory?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  tags?: string[];
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Error types
export class ValidationError extends Error {
  public statusCode = 400;
  public errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class NotFoundError extends Error {
  public statusCode = 404;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  public statusCode = 401;

  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

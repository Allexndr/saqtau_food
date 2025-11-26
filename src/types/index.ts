export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'partner' | 'admin';
  preferences: {
    language: 'ru' | 'kz' | 'en';
    notifications: boolean;
    location?: {
      lat: number;
      lng: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: 'food' | 'fashion';
  subcategory: string;
  images: string[];
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  quantity: number;
  unit: string;
  expiryDate?: Date;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  partnerId: string;
  partnerName: string;
  tags: string[];
  allergens?: string[];
  condition: 'new' | 'like_new' | 'good' | 'fair';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Partner {
  id: string;
  name: string;
  type: 'restaurant' | 'store' | 'cafe' | 'bakery' | 'fashion_store';
  description: string;
  logo?: string;
  images: string[];
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
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  discount: number;
  commission: number; // 15%
  finalTotal: number;
  promoCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  cart: Cart;
  status: 'pending' | 'confirmed' | 'paid' | 'ready' | 'picked_up' | 'cancelled' | 'refunded';
  paymentMethod: 'kaspi' | 'halyk' | 'card' | 'cash';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  pickupCode: string;
  pickupTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIModels {
  recommendation: {
    predict: (userId: string, products: Product[]) => Promise<Product[]>;
    train: (userData: any[]) => Promise<void>;
  };
  pricing: {
    optimize: (product: Product, marketData: any) => Promise<number>;
    predictDemand: (product: Product, location: any) => Promise<number>;
  };
  imageRecognition: {
    classify: (image: File) => Promise<string[]>;
    detectQuality: (image: File) => Promise<number>;
  };
}

export interface AnalyticsEvent {
  event: string;
  userId?: string;
  productId?: string;
  orderId?: string;
  data?: any;
  timestamp: Date;
  source: 'web' | 'mobile' | 'api';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order_update' | 'promotion' | 'partner_news' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  productId?: string;
  partnerId?: string;
  orderId: string;
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: Date;
}

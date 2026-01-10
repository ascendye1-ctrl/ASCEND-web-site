// تأكد من وجود هذا السطر بالضبط في ملف types.ts
export type Currency = 'USD' | 'YER'; 

// وباقي الأنواع يجب أن تكون مصدرة أيضاً
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface Product {
  id: number;
  name: string;
  nameAr: string;
  price: number;
  category: string;
  categoryAr: string;
  image: string;
  description: string;
  descriptionAr: string;
  rating: number;
  brand: string;
  inStock: boolean;
  slug: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface FilterState {
  category: string[];
  priceRange: [number, number];
  brands: string[];
  colors: string[];
  minRating: number;
  inStockOnly: boolean;
  sortBy: string;
}
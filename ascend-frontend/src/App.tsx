import React, { useState, useEffect } from 'react';
import { Star, Moon, Sun, ShoppingCart, Globe, Box, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- تعريف هيكل المنتج ---
export interface Product {
  id: number; 
  name: string; 
  nameAr: string; 
  price: number;
  category: string; 
  categoryAr: string; 
  image: string;
  brandName?: string;
  rating: number;
}

// --- بيانات تجريبية في حال كان السيرفر مغلقاً ---
const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "ASCEND Watch", nameAr: "ساعة أسيند الفاخرة", price: 25000, category: "Watches", categoryAr: "ساعات", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800", brandName: "Elite", rating: 4.9 },
  { id: 2, name: "Travel Bag", nameAr: "حقيبة سفر عصرية", price: 15000, category: "Bags", categoryAr: "حقائب", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800", brandName: "Traveler", rating: 4.7 },
];

export default function App() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isAr, setIsAr] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  // الرابط الخاص بك على Render
  const API_URL = "https://ascend-web-site.onrender.com/api/products";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) setProducts(data);
        }
      } catch (error) {
        console.log("Using fallback data while server wakes up...");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`${isDark ? 'dark' : ''} ${isAr ? 'rtl' : 'ltr'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans">
        
        {/* Navbar - شريط التنقل */}
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ASCEND {isAr ? 'سوق' : 'Market'}
            </h1>
            
            <div className="flex items-center gap-4">
              <button onClick={() => setIsAr(!isAr)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all text-slate-600 dark:text-slate-300">
                <Globe size={20} />
              </button>
              <button onClick={() => setIsDark(!isDark)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section - الهيدر */}
        <header className="py-16 px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-4xl md:text-6xl font-black dark:text-white mb-6">
              {isAr ? 'سوق ASCEND 🌎' : 'ASCEND MARKET 🌎'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              {isAr ? 'اكتشف منتجات البراندات والمتاجر في مكان واحد' : 'Discover premium brands and stores in one place'}
            </p>
          </motion.div>
        </header>

        {/* Products Grid - شبكة المنتجات */}
        <main className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-20 dark:text-white">
                <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-600" />
                <p>{isAr ? 'جاري جلب أحدث المنتجات...' : 'Fetching latest products...'}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-20 dark:text-white opacity-50">
                <Box size={50} className="mx-auto mb-4" />
                <p>{isAr ? 'لا توجد منتجات حالياً' : 'No products available'}</p>
              </div>
            ) : (
              products.map((product) => (
                <motion.div 
                  key={product.id}
                  whileHover={{ y: -8 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800 group"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={product.name} />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm dark:text-white">
                      <Star size={12} className="text-yellow-500 fill-current" /> {product.rating}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black tracking-widest uppercase mb-1 block">
                      🏷️ {isAr ? 'البراند:' : 'Brand:'} {product.brandName || (isAr ? 'عام' : 'General')}
                    </span>
                    <h3 className="text-lg font-bold mb-4 dark:text-white line-clamp-1">
                      {isAr ? product.nameAr : product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xl font-black dark:text-white">{product.price.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{isAr ? 'ريال' : 'YER'}</span>
                      </div>
                      <button className="bg-blue-60
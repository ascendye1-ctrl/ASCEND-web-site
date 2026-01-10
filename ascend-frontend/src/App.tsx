import React, { useState, useEffect } from 'react';
import { ShoppingBag, Globe, Star, X, Moon, Sun, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
export interface Product {
  id: number; name: string; nameAr: string; price: number;
  category: string; categoryAr: string; image: string;
  description: string; descriptionAr: string; rating: number; inStock: boolean;
}

// --- البيانات الاحتياطية لضمان عمل الواجهة ---
const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "ASCEND Classic Watch", nameAr: "ساعة أسيند الكلاسيكية", price: 120, category: "Accessories", categoryAr: "إكسسوارات", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800", description: "Premium Swiss movement.", descriptionAr: "حركة سويسرية فاخرة.", rating: 4.8, inStock: true },
  { id: 2, name: "Modern Backpack", nameAr: "حقيبة ظهر عصرية", price: 85, category: "Bags", categoryAr: "حقائب", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800", description: "Water-resistant design.", descriptionAr: "تصميم مقاوم للماء.", rating: 4.5, inStock: true },
  { id: 3, name: "Wireless Headphones", nameAr: "سماعات لاسلكية", price: 210, category: "Electronics", categoryAr: "إلكترونيات", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800", description: "Noise cancelling technology.", descriptionAr: "تقنية إلغاء الضوضاء.", rating: 4.9, inStock: true },
  { id: 4, name: "Minimalist Wallet", nameAr: "محفظة بسيطة", price: 45, category: "Accessories", categoryAr: "إكسسوارات", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800", description: "RFID protection leather.", descriptionAr: "جلد محمي بتقنية RFID.", rating: 4.7, inStock: true }
];

export default function App() {
  // الحالات (States)
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAr = lang === 'ar';

  // جلب البيانات
  useEffect(() => {
    fetch('https://ascend-web-site.onrender.com/products')
      .then(res => res.json())
      .then(data => { 
        setProducts(data.length > 0 ? data : MOCK_PRODUCTS); 
        setLoading(false); 
      })
      .catch(() => { 
        setProducts(MOCK_PRODUCTS); 
        setLoading(false); 
      });
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
        
        {/* شريط التنقل - Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-all">
          <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white cursor-default">ASCEND</h1>
            
            <div className="flex items-center gap-4">
              <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-yellow-400" />}
              </button>
              
              <button onClick={() => setLang(isAr ? 'en' : 'ar')} className="text-xs font-bold border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                {isAr ? 'ENGLISH' : 'العربية'}
              </button>
              
              <div className="relative cursor-pointer group" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag size={24} className="text-slate-900 dark:text-white group-hover:scale-110 transition-transform" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* سلة التسوق الجانبية - Cart Sidebar */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" />
              <motion.div initial={{ x: isAr ? '-100%' : '100%' }} animate={{ x: 0 }} exit={{ x: isAr ? '-100%' : '100%' }} className={`fixed top-0 ${isAr ? 'left-0' : 'right-0'} w-full max-w-md h-full bg-white dark:bg-slate-900 z-[70] shadow-2xl p-6 flex flex-col`}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold dark:text-white">{isAr ? 'حقيبة التسوق' : 'Shopping Bag'}</h2>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X className="dark:text-white" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {cart.length === 0 ? (
                    <div className="text-center py-20">
                      <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">{isAr ? 'الحقيبة فارغة تماماً' : 'Your bag is empty'}</p>
                    </div>
                  ) : cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-transparent dark:border-slate-800">
                      <img src={item.image} className="w-20 h-20 object-cover rounded-xl" alt={item.name} />
                      <div className="flex-1 text-start">
                        <h4 className="font-bold text-sm dark:text-white leading-tight">{isAr ? item.nameAr : item.name}</h4>
                        <p className="text-blue-600 font-bold mt-1">${item.price}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                            <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:text-blue-600 dark:text-white">-</button>
                            <span className="px-2 text-xs font-bold dark:text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:text-blue-600 dark:text-white">+</button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="mr-auto text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t dark:border-slate-800">
                  <div className="flex justify-between text-xl font-black mb-6 dark:text-white">
                    <span>{isAr ? 'الإجمالي' : 'Total'}</span>
                    <span>${cart.reduce((a, b) => a + (b.price * b.quantity), 0).toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-600/10">
                    {isAr ? 'الدفع الآمن' : 'Secure Checkout'}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* محتوى الصفحة الرئيسي */}
        <main className="pt-24 pb-20">
          {/* قسم البطولة - Hero Section */}
          <section className="max-w-7xl mx-auto px-4 mb-16">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 dark:bg-blue-900/30 rounded-[3rem] p-8 md:p-20 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-2xl text-start">
                <span className="inline-block px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">New Era of Premium</span>
                <h1 className="text-5xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
                  {isAr ? 'ارتقِ بأسلوبك الشخصي' : 'Elevate Your Persona'}
                </h1>
                <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-md font-medium leading-relaxed">
                  {isAr ? 'اكتشف القطع المختارة بعناية لتناسب ذوقك الرفيع.' : 'Curated excellence for those who settle for nothing less than the best.'}
                </p>
                <button className="bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-transform">
                  {isAr ? 'اكتشف المجموعة' : 'Explore Collection'} <ArrowRight size={20} />
                </button>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent hidden lg:block"></div>
            </motion.div>
          </section>

          {/* شبكة المنتجات - Product Grid */}
          <section className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12 text-start">
              <div>
                <h2 className="text-4xl font-black dark:text-white tracking-tight">
                  {isAr ? 'الأكثر مبيعاً' : 'The Bestsellers'}
                </h2>
                <p className="text-gray-500 mt-2 font-medium">{isAr ? 'قطع مختارة من أرقى التصاميم' : 'Curated from top global designers'}</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {products.map(product => (
                  <motion.div 
                    key={product.id} 
                    initial={{ opacity: 0 }} 
                    whileInView={{ opacity: 1 }}
                    whileHover={{ y: -10 }} 
                    className="group bg-white dark:bg-slate-900/50 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-slate-800">
                      <img src={product.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt={product.name} />
                      <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-black shadow-xl">
                        <Star size={14} className="text-yellow-500 fill-current" /> {product.rating}
                      </div>
                    </div>
                    <div className="p-7 text-start">
                      <p className="text-blue-600 text-[10px] font-black uppercase mb-2 tracking-widest opacity-80">{isAr ? product.categoryAr : product.category}</p>
                      <h3 className="text-xl font-bold mb-4 dark:text-white tracking-tight line-clamp-1">{isAr ? product.nameAr : product.name}</h3>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-2xl font-black dark:text-white">${product.price}</span>
                        <button 
                          onClick={() => addToCart(product)} 
                          className="bg-slate-900 dark:bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                        >
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
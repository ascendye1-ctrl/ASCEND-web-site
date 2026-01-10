import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Database } from 'lucide-react';

// استيراد المكونات
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import CartSidebar from './components/CartSidebar';

// تعريف وتصدير الأنواع والبيانات الأولية لحل أخطاء الـ Build
export type Currency = 'USD' | 'YER';
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

// تصدير INITIAL_PRODUCTS لحل خطأ ThemeEditor
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Ascend Essential Phone",
    nameAr: "هاتف أسيند الأساسي",
    price: 299,
    category: "Phones",
    categoryAr: "هواتف",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    description: "High performance smartphone",
    descriptionAr: "هاتف ذكي عالي الأداء",
    rating: 4.8,
    brand: "ASCEND",
    inStock: true,
    slug: "ascend-essential"
  }
];

import { cacheCatalog, getCachedCatalog, setSystemCache, getSystemCache } from './services/localDB';
import SEO from './components/SEO';
import ErrorBoundary from './components/ErrorBoundary';

const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const FeaturedCategories = React.lazy(() => import('./components/FeaturedCategories'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20 w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div>
  </div>
);

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('light');
  const [currency, setCurrency] = useState<Currency>('YER');
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [dbStatus, setDbStatus] = useState<'syncing' | 'ready'>('syncing');

  const EXCHANGE_RATE = 1600;

  const formatPrice = (priceInUSD: number) => {
    if (currency === 'YER') {
      return (priceInUSD * EXCHANGE_RATE).toLocaleString() + ' ريال يمني';
    }
    return '$' + priceInUSD.toFixed(2);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [l, t, c] = await Promise.all([
          getSystemCache('language'),
          getSystemCache('theme'),
          getSystemCache('currency')
        ]);
        if (l) setLanguage(l as Language);
        if (t) setTheme(t as Theme);
        if (c) setCurrency(c as Currency);

        const cached = await getCachedCatalog();
        if (cached && cached.length > 0) setProducts(cached);

        const res = await fetch("https://ascend-web-site.onrender.com/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          await cacheCatalog(data);
        }
        setDbStatus('ready');
      } catch (err) {
        console.error("Init error", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    init();
  }, []);

  const handleCheckout = () => {
    const phone = "9677XXXXXXXX"; 
    let msg = `*طلب جديد من ASCEND YEMEN*\n\n`;
    cart.forEach((item, i) => {
      const p = currency === 'YER' ? item.price * EXCHANGE_RATE : item.price;
      msg += `${i+1}- ${language === 'ar' ? item.nameAr : item.name} (x${item.quantity})\n`;
      msg += `السعر: ${p.toLocaleString()} ${currency}\n\n`;
    });
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        <SEO language={language} path={location.pathname} />
        <ErrorBoundary>
          <Header 
            cartItems={cart} 
            setIsCartOpen={setIsCartOpen} 
            language={language} 
            setLanguage={setLanguage} 
            theme={theme} 
            toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            currency={currency}
            setCurrency={setCurrency}
            onNavigate={() => navigate('/')}
            isMobileMenuOpen={false}
            setIsMobileMenuOpen={() => {}}
          />

          <CartSidebar 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            items={cart} 
            onUpdateQuantity={(id, d) => setCart(curr => curr.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))}
            onRemoveItem={(id) => setCart(curr => curr.filter(i => i.id !== id))}
            onCheckout={handleCheckout}
            language={language}
            currency={currency}
            formatPrice={formatPrice}
          />

          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero language={language} />
                  <Suspense fallback={<LoadingFallback />}>
                    <FeaturedCategories language={language} onNavigate={() => {}} />
                    <ProductList 
                      products={products} 
                      onProductClick={(p) => navigate(`/product/${p.slug}`)} 
                      onAddToCart={(p) => { setCart([...cart, {...p, quantity: 1}]); setIsCartOpen(true); }}
                      language={language}
                      isLoading={isLoadingProducts}
                      formatPrice={formatPrice}
                      filterState={{ category: [], priceRange: [0, 500], brands: [], colors: [], minRating: 0, inStockOnly: false, sortBy: 'relevance' }}
                      setFilterState={() => {}}
                    />
                  </Suspense>
                </>
              } />
              <Route path="/admin" element={<Suspense fallback={<LoadingFallback />}><AdminDashboard language={language} /></Suspense>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="py-10 text-center border-t dark:border-slate-800">
              <p>© 2026 ASCEND YEMEN</p>
              <div className="flex justify-center items-center gap-2 mt-2">
                 <Database size={14} className={dbStatus === 'ready' ? 'text-green-500' : 'text-yellow-500'} />
                 <span className="text-[10px]">{dbStatus.toUpperCase()}</span>
              </div>
          </footer>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
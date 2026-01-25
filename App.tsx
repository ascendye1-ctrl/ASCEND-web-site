
import React, { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import { Product, CartItem, ViewState, Language, Theme, FilterState } from './types';
import { initializeChat } from './services/geminiService';
import { cacheCatalog, getCachedCatalog, setSystemCache, getSystemCache } from './services/localDB';
import { ArrowLeft, ArrowRight, Share2, ShoppingBag } from 'lucide-react';
import { translations } from './utils/translations';
import ErrorBoundary from './components/ErrorBoundary';
import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';

// Lazy load heavy components
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const FeaturedCategories = React.lazy(() => import('./components/FeaturedCategories'));
const AIChat = React.lazy(() => import('./components/AIChat'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20 w-full h-full">
    <div className="relative w-12 h-12">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-slate-700 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-navy dark:border-brand-lime rounded-full border-t-transparent animate-spin"></div>
    </div>
  </div>
);

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Aether Chronograph V2",
    nameAr: "ساعة إيثر النسخة الثانية",
    price: 520.00,
    category: "Accessories",
    categoryAr: "إكسسوارات",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    description: "Military-grade sapphire crystal meets surgical steel in our most precise chronograph yet.",
    descriptionAr: "زجاج ياقوتي عسكري مع فولاذ جراحي في أدق ساعة كرونوغراف لدينا حتى الآن.",
    rating: 4.9,
    brand: "ASCEND",
    inStock: true,
    slug: "aether-chrono-v2"
  },
  {
    id: 2,
    name: "Onyx Modular Pack",
    nameAr: "حقيبة أونيكس المعيارية",
    price: 245.00,
    category: "Accessories",
    categoryAr: "إكسسوارات",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    description: "Ballistic nylon construction with climate-controlled tech sleeves for your most valuable gear.",
    descriptionAr: "هيكل من النايلون الباليستي مع أكمام تقنية متحكم في مناخها لمعداتك الثمينة.",
    rating: 4.8,
    brand: "ASCEND",
    inStock: true,
    slug: "onyx-modular-pack"
  },
  {
    id: 3,
    name: "Nova Hi-Res Headphones",
    nameAr: "سماعات نوفا عالية الدقة",
    price: 390.00,
    category: "Electronics",
    categoryAr: "إلكترونيات",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    description: "Lossless audio streaming with adaptive transparency and 50-hour battery cycle.",
    descriptionAr: "بث صوتي بدون فقدان مع شفافية متكيفة ودورة بطارية تدوم 50 ساعة.",
    rating: 4.7,
    brand: "Sony",
    inStock: true,
    slug: "nova-hires"
  },
  {
    id: 4,
    name: "Prism Smart Lighting",
    nameAr: "إضاءة بريزم الذكية",
    price: 120.00,
    category: "Home",
    categoryAr: "منزل",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=1200&q=80",
    description: "Full spectrum smart lighting integrated with your ecosystem for perfect focus ambiance.",
    descriptionAr: "إضاءة ذكية كاملة الطيف متكاملة مع نظامك للحصول على جو تركيز مثالي.",
    rating: 4.6,
    brand: "ASCEND",
    inStock: true,
    slug: "prism-smart-light"
  }
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const isSharingRef = useRef(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  
  const [filterState, setFilterState] = useState<FilterState>({
    category: [],
    priceRange: [0, 1000],
    brands: [],
    colors: [],
    minRating: 0,
    inStockOnly: false,
    sortBy: 'relevance'
  });

  useEffect(() => {
    const initApp = async () => {
        try {
            const cachedLang = await getSystemCache('language');
            if (cachedLang) setLanguage(cachedLang);
            const cachedTheme = await getSystemCache('theme');
            if (cachedTheme) setTheme(cachedTheme);

            const cachedProducts = await getCachedCatalog();
            if (cachedProducts && cachedProducts.length > 0) {
                setProducts(cachedProducts);
            } else {
                setProducts(INITIAL_PRODUCTS);
                await cacheCatalog(INITIAL_PRODUCTS);
            }
            setIsLoadingProducts(false);
            initializeChat(INITIAL_PRODUCTS);
        } catch (error) {
            setProducts(INITIAL_PRODUCTS);
            setIsLoadingProducts(false);
        }
    };
    initApp();
  }, []);

  useEffect(() => { setSystemCache('language', language); }, [language]);
  useEffect(() => { setSystemCache('theme', theme); }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, vendorName: "ASCEND Official" }];
    });
    setIsCartOpen(true);
  };

  const handleNavigate = (view: ViewState) => {
    switch (view) {
        case 'HOME': navigate('/'); break;
        case 'SHOP': navigate('/shop'); break;
        case 'ABOUT': navigate('/about'); break;
        case 'ADMIN_DASHBOARD': navigate('/admin'); break;
        default: navigate('/'); break;
    }
  };

  const handleShareProduct = async (product: Product) => {
    if (isSharingRef.current) return;
    isSharingRef.current = true;
    
    const shareData = {
      title: product.name,
      text: product.description,
      url: `${window.location.origin}/#/product/${product.slug || product.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert(language === 'ar' ? 'تم نسخ الرابط!' : 'Link copied to clipboard!');
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error("Sharing failed:", err);
      }
    } finally {
      isSharingRef.current = false;
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filterState.category.length > 0) result = result.filter(p => filterState.category.includes(p.category));
    return result;
  }, [products, filterState]);

  return (
    <ErrorBoundary>
      <div className={`${theme} ${theme === 'dark' ? 'dark' : ''} min-h-screen flex flex-col font-sans`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <Header cartItems={cart} setIsCartOpen={setIsCartOpen} onNavigate={handleNavigate} language={language} setLanguage={setLanguage} theme={theme} toggleTheme={toggleTheme} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
          
          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={(id, d) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + d) } : item))} onRemoveItem={(id) => setCart(prev => prev.filter(i => i.id !== id))} onCheckout={() => navigate('/checkout')} language={language} />
          
          <main className="flex-grow">
              <Routes>
                  <Route path="/" element={<><Hero language={language} /><FeaturedCategories onNavigate={handleNavigate} language={language} /><ProductList products={filteredProducts} onProductClick={(p) => navigate(`/product/${p.slug}`)} onAddToCart={addToCart} onShare={handleShareProduct} language={language} isLoading={isLoadingProducts} /></>} />
                  
                  <Route path="/shop" element={<div className="py-20 max-w-7xl mx-auto px-4"><div className="flex justify-between items-end mb-12"><h1 className="text-5xl font-black uppercase tracking-tighter italic text-brand-navy dark:text-white">Shop Now</h1><p className="text-gray-500 max-w-xs text-right hidden sm:block">Explore our curated collection of elite performance and design gear.</p></div><ProductList products={products} onProductClick={(p) => navigate(`/product/${p.slug}`)} onAddToCart={addToCart} onShare={handleShareProduct} language={language} /></div>} />
                  
                  <Route path="/about" element={<div className="py-24 px-8 max-w-5xl mx-auto"><h1 className="text-6xl font-black mb-12 uppercase tracking-tighter text-brand-navy dark:text-white border-b-8 border-brand-lime inline-block">Learn More</h1><div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-lg text-gray-600 dark:text-gray-400"><div className="space-y-6"><h3 className="text-2xl font-bold text-brand-navy dark:text-white">Our Vision</h3><p>ASCEND was founded in 2025 to bridge the gap between human ambition and intelligent tools. We don't just sell goods; we provide the gear that defines your trajectory.</p><p>Every piece in our catalog is rigorously tested for durability, aesthetic alignment, and technical performance.</p></div><div className="space-y-6"><h3 className="text-2xl font-bold text-brand-navy dark:text-white">AI-First Commerce</h3><p>We leverage the latest in GenAI to create a shopping experience that understands you. From our Gemini-powered sales assistant to real-time inventory optimization, we are building the future of retail.</p><div className="pt-6 border-t border-gray-100 dark:border-slate-800"><p className="text-sm italic">"Ascend above the ordinary." — Team ASCEND</p></div></div></div></div>} />
                  
                  <Route path="/product/:slug" element={<ProductDetailRoute onAddToCart={addToCart} onShare={handleShareProduct} language={language} />} />
                  <Route path="/admin" element={<Suspense fallback={<LoadingFallback />}><AdminDashboard language={language} onNavigate={handleNavigate} /></Suspense>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
          </main>

          <Footer language={language} />
          <Suspense fallback={null}><AIChat language={language} /></Suspense>
      </div>
    </ErrorBoundary>
  );
};

const ProductDetailRoute = ({ onAddToCart, onShare, language }: { onAddToCart: (p: Product) => void, onShare: (p: Product) => void, language: Language }) => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const product = INITIAL_PRODUCTS.find(p => p.slug === slug);
    const isRtl = language === 'ar';
    const ArrowBack = isRtl ? ArrowRight : ArrowLeft;

    if (!product) return <div className="p-20 text-center">Product not found</div>;

    return (
        <div className="bg-white dark:bg-brand-dark min-h-screen py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-brand-navy dark:hover:text-brand-lime transition-colors font-bold uppercase text-xs tracking-widest">
                    <ArrowBack className="w-5 h-5" /> {isRtl ? 'رجوع' : 'Back to collection'}
                </button>
                <div className="lg:grid lg:grid-cols-2 gap-16 items-start">
                    <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-slate-800">
                        <img src={product.image} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt={product.name} />
                    </div>
                    <div className="py-4">
                        <div className="mb-6">
                            <span className="text-xs font-black tracking-[0.2em] text-brand-navy dark:text-brand-lime uppercase mb-2 block">{isRtl ? product.categoryAr : product.category}</span>
                            <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase leading-tight dark:text-white">{isRtl ? product.nameAr : product.name}</h1>
                            <p className="text-4xl font-bold text-brand-navy dark:text-white">${product.price.toFixed(2)}</p>
                        </div>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 border-l-4 border-gray-100 dark:border-slate-800 pl-6">{isRtl ? product.descriptionAr : product.description}</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={() => onAddToCart(product)} className="flex-1 bg-brand-navy text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                <ShoppingBag className="w-5 h-5" /> {isRtl ? 'أضف إلى السلة' : 'Add to Cart'}
                            </button>
                            <button onClick={() => onShare(product)} className="p-5 bg-gray-100 dark:bg-slate-800 rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                                <Share2 className="w-6 h-6 text-brand-navy dark:text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;

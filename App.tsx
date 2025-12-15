import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import CartSidebar from './components/CartSidebar';
import { Product, CartItem, ViewState, Language, Theme, FilterState, Vendor } from './types';
import { initializeChat, generateProductDescription } from './services/geminiService';
import { cacheCatalog, getCachedCatalog, setSystemCache, getSystemCache } from './services/localDB';
import { Sparkles, ArrowLeft, ArrowRight, Star, CheckCircle, Search, Filter, Lock, Check, Database, Loader } from 'lucide-react';
import { translations } from './utils/translations';
import SEO from './components/SEO';
import ErrorBoundary from './components/ErrorBoundary';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';

// Lazy load heavy components
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const VendorOnboarding = React.lazy(() => import('./components/VendorOnboarding'));
const StoreFront = React.lazy(() => import('./components/StoreFront'));
const BrandStory = React.lazy(() => import('./components/BrandStory'));
const FeaturedCategories = React.lazy(() => import('./components/FeaturedCategories'));
const PaymentGate = React.lazy(() => import('./components/PaymentGate'));
const AIChat = React.lazy(() => import('./components/AIChat'));
const NotFound = React.lazy(() => import('./components/NotFound'));

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20 w-full h-full">
    <div className="relative w-12 h-12">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-slate-700 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-navy dark:border-brand-lime rounded-full border-t-transparent animate-spin"></div>
    </div>
  </div>
);

// MOCK DATA WITH ARABIC TRANSLATIONS - UPDATED FOR ASCEND BRAND
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "ASCEND Classic Tee",
    nameAr: "تيشيرت ASCEND الكلاسيكي",
    price: 35.00,
    category: "Apparel",
    categoryAr: "ملابس",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "A timeless classic made from 100% organic cotton. Perfect for everyday wear.",
    descriptionAr: "قطعة كلاسيكية خالدة مصنوعة من القطن العضوي 100٪. مثالية للارتداء اليومي.",
    rating: 4.5,
    brand: "ASCEND",
    colors: ["#000000", "#FFFFFF", "#1e3a8a"],
    inStock: true,
    slug: "ascend-classic-tee",
    seoTitle: "ASCEND Classic Tee | Premium Organic Cotton",
    seoDescription: "Shop the ASCEND Classic Tee. Made from 100% organic cotton for ultimate comfort and style.",
    vendorId: 1
  },
  {
    id: 2,
    name: "Urban Explorer Backpack",
    nameAr: "حقيبة المستكشف الحضري",
    price: 120.00,
    category: "Accessories",
    categoryAr: "إكسسوارات",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Rugged durability meets modern design. Water-resistant with laptop compartment.",
    descriptionAr: "متانة قوية تلتقي بالتصميم الحديث. مقاومة للماء مع حجرة للكمبيوتر المحمول.",
    rating: 4.8,
    brand: "NorthFace",
    colors: ["#333333", "#1e3a8a"],
    inStock: true,
    slug: "urban-explorer-backpack",
    seoTitle: "Urban Explorer Backpack | Water Resistant Laptop Bag",
    seoDescription: "The ultimate backpack for city living. Water-resistant, durable, and stylish.",
    vendorId: 2
  },
  {
    id: 3,
    name: "Minimalist Watch",
    nameAr: "ساعة بسيطة",
    price: 189.00,
    category: "Accessories",
    categoryAr: "إكسسوارات",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Elegant simplicity. Swiss movement with a genuine leather strap.",
    descriptionAr: "بساطة أنيقة. حركة سويسرية مع حزام جلد أصلي.",
    rating: 4.7,
    brand: "Fossil",
    colors: ["#000000", "#8B4513"],
    inStock: true,
    slug: "minimalist-watch",
    seoTitle: "Minimalist Watch | Swiss Movement Leather Strap",
    seoDescription: "A watch that defines elegance. Swiss movement and genuine leather.",
    vendorId: 3
  },
  {
    id: 4,
    name: "Studio Headphones",
    nameAr: "سماعات ستوديو",
    price: 249.00,
    category: "Electronics",
    categoryAr: "إلكترونيات",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Immersive sound quality with active noise cancellation.",
    descriptionAr: "جودة صوت غامرة مع إلغاء الضوضاء النشط.",
    rating: 4.9,
    brand: "Sony",
    colors: ["#000000", "#C0C0C0"],
    inStock: false,
    slug: "studio-headphones",
    seoTitle: "Studio Headphones | Noise Cancelling & High Fidelity",
    seoDescription: "Experience sound like never before with our premium Studio Headphones.",
    vendorId: 4
  },
  {
    id: 5,
    name: "Canvas Sneakers",
    nameAr: "حذاء قماش",
    price: 85.00,
    category: "Footwear",
    categoryAr: "أحذية",
    image: "https://images.unsplash.com/photo-1560769629-975e13f0c470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Low-profile sneakers that go with everything.",
    descriptionAr: "أحذية رياضية بسيطة تتناسب مع كل شيء.",
    rating: 4.4,
    brand: "Vans",
    colors: ["#FFFFFF", "#000000", "#FF0000"],
    inStock: true,
    slug: "canvas-sneakers",
    seoTitle: "Classic Canvas Sneakers | Comfortable Everyday Shoes",
    seoDescription: "Versatile and comfortable canvas sneakers for any occasion.",
    vendorId: 5
  },
  {
    id: 6,
    name: "Ceramic Coffee Set",
    nameAr: "طقم قهوة سيراميك",
    price: 45.00,
    category: "Home",
    categoryAr: "منزل",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Handcrafted ceramic mugs for your morning ritual.",
    descriptionAr: "أكواب سيراميك مصنوعة يدوياً لطقوسك الصباحية.",
    rating: 4.6,
    brand: "PotteryBarn",
    colors: ["#FFFFFF", "#E6E6FA"],
    inStock: true,
    slug: "ceramic-coffee-set",
    seoTitle: "Handcrafted Ceramic Coffee Set | Mugs & Saucers",
    seoDescription: "Start your morning right with this beautiful, handcrafted ceramic coffee set.",
    vendorId: 6
  },
  {
    id: 7,
    name: "Polarized Sunglasses",
    nameAr: "نظارة شمسية مستقطبة",
    price: 115.00,
    category: "Accessories",
    categoryAr: "إكسسوارات",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Classic aviator style with UV protection.",
    descriptionAr: "نمط طيار كلاسيكي مع حماية من الأشعة فوق البنفسجية.",
    rating: 4.7,
    brand: "RayBan",
    colors: ["#000000", "#FFD700"],
    inStock: true,
    slug: "polarized-sunglasses",
    seoTitle: "Polarized Aviator Sunglasses | UV Protection",
    seoDescription: "Protect your eyes in style with these classic polarized aviator sunglasses.",
    vendorId: 7
  },
  {
    id: 8,
    name: "Yoga Mat Pro",
    nameAr: "سجادة يوغا برو",
    price: 65.00,
    category: "Fitness",
    categoryAr: "لياقة",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Extra thick anti-slip mat for yoga and pilates.",
    descriptionAr: "سجادة سميكة جداً مانعة للانزلاق لليوجا والبيلاتس.",
    rating: 4.8,
    brand: "Lululemon",
    colors: ["#800080", "#000000"],
    inStock: true,
    slug: "yoga-mat-pro",
    seoTitle: "Yoga Mat Pro | Non-Slip Extra Thick Exercise Mat",
    seoDescription: "Achieve perfect balance with the Yoga Mat Pro. Non-slip and extra thick.",
    vendorId: 8
  }
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 1,
    name: "ASCEND Official",
    slug: "ascend-official",
    logo: "https://ui-avatars.com/api/?name=A&background=1e3a8a&color=fff",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    description: "The official store for premium ASCEND gear.",
    rating: 4.9,
    reviews: [
       { id: 'r1', userName: 'John D.', rating: 5, comment: 'Excellent quality and fast shipping.', date: '2 days ago', type: 'merchant' }
    ],
    joinedDate: '2023-01-01',
    isVerified: true
  },
  {
    id: 2,
    name: "NorthFace",
    slug: "northface",
    logo: "https://ui-avatars.com/api/?name=NF&background=000&color=fff",
    banner: "https://images.unsplash.com/photo-1516934553182-3d719e516a36?auto=format&fit=crop&w=1600&q=80",
    description: "Never Stop Exploring.",
    rating: 4.8,
    reviews: [],
    joinedDate: '2023-02-15',
    isVerified: true
  }
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  // selectedProduct and selectedVendor are derived from URL usually, but for consistency/cache we might update state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [dbStatus, setDbStatus] = useState<'syncing' | 'ready'>('syncing');
  
  // Filtering State
  const [filterState, setFilterState] = useState<FilterState>({
    category: [],
    priceRange: [0, 500],
    brands: [],
    colors: [],
    minRating: 0,
    inStockOnly: false,
    sortBy: 'relevance'
  });

  // Subscribe System State
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  // AI State for dynamic descriptions
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  // --- HYDRATION & DB INIT ---
  useEffect(() => {
    const initApp = async () => {
        try {
            // 1. Try to load settings from DB
            const cachedLang = await getSystemCache('language');
            if (cachedLang) setLanguage(cachedLang);
            
            const cachedTheme = await getSystemCache('theme');
            if (cachedTheme) setTheme(cachedTheme);

            // 2. Try to load Products from DB (Instant Load)
            const cachedProducts = await getCachedCatalog();
            
            if (cachedProducts && cachedProducts.length > 0) {
                console.log("🚀 Loaded products from High-Performance Local DB");
                setProducts(cachedProducts);
                setIsLoadingProducts(false);
                setDbStatus('ready');
            } else {
                // 3. Fallback to Initial Data (Simulated Fetch) and Cache it
                console.log("⚠️ DB Empty. Fetching and Caching...");
                setProducts(INITIAL_PRODUCTS);
                await cacheCatalog(INITIAL_PRODUCTS);
                setIsLoadingProducts(false);
                setDbStatus('ready');
            }
            
            initializeChat(INITIAL_PRODUCTS);
        } catch (error) {
            console.error("DB Initialization Failed:", error);
            // Fallback
            setProducts(INITIAL_PRODUCTS);
            setIsLoadingProducts(false);
        }
    };

    initApp();
  }, []);

  // Persist Settings
  useEffect(() => {
    setSystemCache('language', language);
  }, [language]);

  useEffect(() => {
    setSystemCache('theme', theme);
  }, [theme]);


  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Mock vendor name injection if missing in product data (for old mock data)
      const vendorName = product.vendorId === 1 ? "ASCEND Official" : "Partner Store";
      return [...prev, { ...product, quantity: 1, vendorName }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleNavigate = (view: ViewState) => {
    // Map ViewState to Routes
    switch (view) {
        case 'HOME': navigate('/'); break;
        case 'SHOP': navigate('/shop'); break;
        case 'COLLECTIONS': navigate('/collections'); break;
        case 'ABOUT': navigate('/about'); break;
        case 'CAREERS': navigate('/careers'); break;
        case 'PRIVACY': navigate('/privacy'); break;
        case 'TERMS': navigate('/terms'); break;
        case 'SHIPPING': navigate('/shipping'); break;
        case 'RETURNS': navigate('/returns'); break;
        case 'PAYMENT_GATE': navigate('/checkout'); break;
        case 'CHECKOUT_SUCCESS': navigate('/success'); break;
        case 'ADMIN_DASHBOARD': navigate('/admin'); break;
        case 'VENDOR_ONBOARDING': navigate('/sell'); break;
        default: navigate('/'); break;
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.slug || product.id}`);
  };

  const handleVendorClick = (vendor: Vendor) => {
      navigate(`/store/${vendor.slug}`);
  };

  const handleMagicDescription = async () => {
    if (!selectedProduct) return;
    setIsGeneratingDesc(true);
    const promptLang = language === 'ar' ? "Arabic" : "English";
    const productName = language === 'ar' && selectedProduct.nameAr ? selectedProduct.nameAr : selectedProduct.name;
    const productCat = language === 'ar' && selectedProduct.categoryAr ? selectedProduct.categoryAr : selectedProduct.category;

    const newDesc = await generateProductDescription(productName, productCat + ` (in ${promptLang})`);
    
    // Update locally
    setSelectedProduct(prev => prev ? { 
      ...prev, 
      [language === 'ar' ? 'descriptionAr' : 'description']: newDesc 
    } : null);
    
    // Update in main list
    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id ? { 
         ...p, 
         [language === 'ar' ? 'descriptionAr' : 'description']: newDesc 
      } : p
    );
    setProducts(updatedProducts);
    // Update Cache
    cacheCatalog(updatedProducts);
    
    setIsGeneratingDesc(false);
  };

  // Checkout Logic
  const [checkoutVendor, setCheckoutVendor] = useState<string | undefined>(undefined);

  const handleCheckoutInitiate = (vendorName?: string) => {
      setCheckoutVendor(vendorName);
      navigate('/checkout');
      setIsCartOpen(false);
  };

  const handlePaymentSuccess = () => {
      navigate('/success');
      if (checkoutVendor) {
          // Remove only items from this vendor
          setCart(prev => prev.filter(item => item.vendorName !== checkoutVendor));
      } else {
          // Clear all
          setCart([]);
      }
      setCheckoutVendor(undefined);
      window.scrollTo(0, 0);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    
    setIsSubscribing(true);
    
    // Simulate API call to ascendye1@gmail.com integration
    console.log(`Subscribing ${emailInput} to system email: ascendye1@gmail.com`);
    
    setTimeout(() => {
        setIsSubscribing(false);
        setIsSubscribed(true);
        setEmailInput('');
    }, 1500);
  };

  // --- Filtering Logic ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter Category
    if (filterState.category.length > 0) {
      result = result.filter(p => filterState.category.includes(p.category));
    }

    // 2. Filter Price
    result = result.filter(p => p.price >= filterState.priceRange[0] && p.price <= filterState.priceRange[1]);

    // 3. Filter Brands
    if (filterState.brands.length > 0) {
        result = result.filter(p => p.brand && filterState.brands.includes(p.brand));
    }

    // 4. Filter Colors (If product has ANY of the selected colors)
    if (filterState.colors.length > 0) {
        result = result.filter(p => p.colors && p.colors.some(c => filterState.colors.includes(c)));
    }

    // 5. Filter Rating
    if (filterState.minRating > 0) {
        result = result.filter(p => p.rating >= filterState.minRating);
    }

    // 6. In Stock
    if (filterState.inStockOnly) {
        result = result.filter(p => p.inStock);
    }

    // 7. Sort
    switch (filterState.sortBy) {
        case 'price_asc':
            result.sort((a, b) => a.price - b.price);
            break;
        case 'price_desc':
            result.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            result.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            result.sort((a, b) => b.id - a.id);
            break;
        case 'relevance':
        default:
            // Default ID sort or no sort
            break;
    }

    return result;
  }, [products, filterState]);


  // --- Helpers for current language ---
  const t = translations[language];
  const isRtl = language === 'ar';
  const ArrowBackIcon = isRtl ? ArrowRight : ArrowLeft;

  const getProductName = (p: Product) => (isRtl && p.nameAr) ? p.nameAr : p.name;
  const getProductDesc = (p: Product) => (isRtl && p.descriptionAr) ? p.descriptionAr : p.description;

  // Calculate cart total for payment gate
  const cartTotal = useMemo(() => {
      let items = cart;
      if (checkoutVendor) {
          items = cart.filter(item => item.vendorName === checkoutVendor);
      }
      return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart, checkoutVendor]);

  // --- Render Views Helpers ---

  const renderProductDetail = (product: Product) => {
    return (
      <div className="bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md pt-6 pb-16 sm:pb-24 transition-colors duration-300 animate-fade-in rounded-3xl mx-4 mt-4 shadow-xl border border-white/20">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
            <button 
                onClick={() => navigate('/')}
                className="flex items-center text-sm text-gray-500 hover:text-brand-navy dark:text-gray-400 dark:hover:text-brand-lime mb-8 transition-colors min-h-[44px]"
            >
                <ArrowBackIcon className="w-4 h-4 me-2" /> {t.products.backToCatalog}
            </button>
            
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
                {/* Image */}
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-2xl shadow-2xl bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                    <img
                        src={product.image}
                        alt={getProductName(product)}
                        className="h-full w-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    />
                </div>

                {/* Info */}
                <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                    <div className="flex justify-between items-start">
                        <h1 className="text-4xl font-black tracking-tight text-brand-navy dark:text-white mb-2">{getProductName(product)}</h1>
                        {product.brand && (
                            <span 
                              onClick={() => {
                                 const vendor = MOCK_VENDORS.find(v => v.name.includes(product.brand || ''));
                                 if (vendor) handleVendorClick(vendor);
                              }}
                              className="inline-flex items-center rounded-full bg-white dark:bg-slate-800 px-3 py-1 text-xs font-bold text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-200 dark:ring-slate-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm"
                            >
                                {product.brand}
                            </span>
                        )}
                    </div>
                    
                    <div className="mt-4 mb-6">
                        <p className="text-3xl font-bold text-gray-900 dark:text-brand-lime">${product.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-8">
                         <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
                            ))}
                         </div>
                         <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-2">{product.rating} (120 {t.products.reviews})</span>
                    </div>

                    {/* Color Swatches if available */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Available Colors</h3>
                            <div className="flex gap-3">
                                {product.colors.map(color => (
                                    <button 
                                        key={color} 
                                        className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-lg ring-2 ring-transparent hover:ring-brand-navy dark:hover:ring-brand-lime transition-all"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4 mb-10">
                        <div className="relative group p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 backdrop-blur-sm shadow-sm">
                             <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">{t.products.description}</h3>
                             <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{getProductDesc(product)}</p>
                             <button 
                                onClick={handleMagicDescription}
                                disabled={isGeneratingDesc}
                                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-brand-navy hover:text-brand-sky dark:text-brand-sky dark:hover:text-brand-lime bg-gray-50 dark:bg-slate-800 hover:bg-white rounded-full transition-all shadow-sm"
                                title={t.products.enhanceAi}
                             >
                                <Sparkles className={`w-4 h-4 ${isGeneratingDesc ? 'animate-spin' : ''}`} />
                             </button>
                        </div>
                    </div>

                    <div className="mt-10">
                        <button
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            className={`flex w-full items-center justify-center rounded-full border border-transparent px-8 py-4 text-base font-bold text-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2 dark:ring-offset-slate-900 min-h-[56px] ${
                                product.inStock 
                                ? 'bg-brand-navy dark:bg-white dark:text-brand-navy hover:bg-brand-navy/90' 
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {product.inStock ? t.products.addToBag : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
         </div>
      </div>
    );
  };

  const renderCheckoutSuccess = () => (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="relative z-10 animate-fade-in flex flex-col items-center bg-white/60 dark:bg-brand-dark/60 backdrop-blur-xl p-12 rounded-[3rem] border border-white/20 shadow-2xl">
              <div className="relative w-32 h-32 mb-8">
                  <div className="absolute top-2 left-0 w-24 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800 rounded-lg shadow-md transform -rotate-12 translate-x-2 opacity-60 border border-white/40 dark:border-slate-600/40"></div>
                  <div className="absolute top-1 right-1 w-24 h-16 bg-gradient-to-bl from-brand-navy/20 to-brand-navy/40 dark:from-brand-navy/60 dark:to-brand-navy/80 rounded-lg shadow-lg transform rotate-6 -translate-x-1 border border-white/40 dark:border-slate-600/40 backdrop-blur-sm"></div>
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="rounded-full bg-brand-lime shadow-xl shadow-brand-lime/20 p-4 transform scale-110">
                          <CheckCircle className="w-10 h-10 text-brand-navy" strokeWidth={3} />
                      </div>
                  </div>
                   <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 p-2 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 z-20">
                      <Lock className="w-4 h-4 text-green-500" />
                   </div>
              </div>

              <h2 className="text-4xl font-black tracking-tighter text-brand-navy dark:text-white mb-2">{t.checkout.confirmed}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8 font-medium">
                  {t.checkout.thankYou} {t.checkout.message}
                  <span className="block mt-4 text-sm font-mono bg-white dark:bg-slate-800 py-2 px-6 rounded-full w-fit mx-auto border border-gray-200 dark:border-slate-700 shadow-inner text-gray-500">
                    Order #ASC-{Math.floor(Math.random() * 10000)}
                  </span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <button 
                  onClick={() => navigate('/')}
                  className="flex-1 rounded-full bg-brand-navy px-6 py-4 text-sm font-bold text-white shadow-lg shadow-brand-navy/20 hover:bg-brand-navy/90 hover:shadow-brand-navy/30 transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                    {t.checkout.continue} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
          </div>
      </div>
  );

  const renderShop = () => (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white/50 dark:bg-slate-900/50 p-8 rounded-[2rem] backdrop-blur-sm border border-white/20">
                 <div className="text-center md:text-start">
                    <h1 className="text-4xl font-black text-brand-navy dark:text-white tracking-tight">{t.products.allProducts}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Explore our premium selection.</p>
                 </div>
             </div>
             <ProductList 
                products={filteredProducts} 
                onProductClick={handleProductClick} 
                onAddToCart={addToCart} 
                language={language}
                isLoading={isLoadingProducts}
                filterState={filterState}
                setFilterState={setFilterState}
             />
        </div>
      </div>
  );

  const renderCollections = () => (
     <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
             <div className="text-center mb-16">
                 <h1 className="text-5xl font-black text-brand-navy dark:text-white mb-4 tracking-tighter">{t.pages.collections.title}</h1>
                 <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t.pages.collections.subtitle}</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                    { title: t.pages.collections.men, img: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                    { title: t.pages.collections.women, img: "https://images.unsplash.com/photo-1550614000-4b9519e09265?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                    { title: t.pages.collections.tech, img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                    { title: t.pages.collections.home, img: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
                 ].map((col, idx) => (
                     <div key={idx} className="group relative h-96 rounded-[2rem] overflow-hidden cursor-pointer shadow-xl" onClick={() => navigate('/shop')}>
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10 duration-500"></div>
                         <img src={col.img} alt={col.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                         <div className="absolute inset-0 flex items-center justify-center z-20">
                             <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full transform group-hover:-translate-y-2 transition-transform duration-500">
                                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{col.title}</h3>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
     </div>
  );

  const renderAbout = () => (
      <div className="min-h-screen bg-transparent animate-fade-in">
         <div className="relative h-[500px] overflow-hidden mx-4 mt-4 rounded-[2.5rem]">
             <div className="absolute inset-0 bg-brand-navy/60 z-10 mix-blend-multiply"></div>
             <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" className="w-full h-full object-cover" />
             <div className="absolute inset-0 flex flex-col justify-center items-center z-20 text-white text-center px-4">
                 <span className="inline-block px-4 py-1 rounded-full border border-white/30 text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">Established 2025</span>
                 <h1 className="text-6xl sm:text-7xl font-black tracking-tighter mb-6">{t.pages.about.title}</h1>
                 <p className="text-xl max-w-2xl text-gray-200 font-light leading-relaxed">{t.pages.about.subtitle}</p>
             </div>
         </div>
         <div className="max-w-4xl mx-auto px-6 py-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] -mt-20 relative z-30 shadow-2xl mx-4 sm:mx-auto border border-white/20">
             <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-8 first-letter:text-6xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-brand-navy dark:first-letter:text-brand-lime">
                 {t.pages.about.content1}
             </p>
             <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                 {t.pages.about.content2}
             </p>
         </div>
      </div>
  );

  // Wrappers for URL Params
  const ProductDetailRoute = () => {
      const { slug } = useParams();
      const product = products.find(p => p.slug === slug || p.id.toString() === slug);
      
      useEffect(() => {
        if(product) setSelectedProduct(product);
      }, [product]);

      if (!product) return <Navigate to="/404" replace />;
      return renderProductDetail(product);
  };

  const StoreFrontRoute = () => {
      const { slug } = useParams();
      const vendor = MOCK_VENDORS.find(v => v.slug === slug || v.id.toString() === slug);
      
      if (!vendor) return <Navigate to="/404" replace />;
      
      const vendorProducts = products.filter(p => p.vendorId === vendor.id);
      
      return (
        <Suspense fallback={<LoadingFallback />}>
            <StoreFront vendor={vendor} products={vendorProducts} onProductClick={handleProductClick} onAddToCart={addToCart} language={language} />
        </Suspense>
      );
  };

  return (
    <div className={`${theme} ${theme === 'dark' ? 'dark' : ''} min-h-screen font-sans`} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="min-h-screen flex flex-col transition-colors duration-300 relative z-0">
          <SEO 
             title={selectedProduct ? selectedProduct.seoTitle || selectedProduct.name : undefined}
             description={selectedProduct ? selectedProduct.seoDescription || selectedProduct.description : undefined}
             language={language}
             path={location.pathname}
          />
          
          <ErrorBoundary>
            <Header 
                cartItems={cart} 
                setIsCartOpen={setIsCartOpen}
                onNavigate={handleNavigate}
                language={language}
                setLanguage={setLanguage}
                theme={theme}
                toggleTheme={toggleTheme}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            
            <CartSidebar 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)}
                items={cart}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={() => handleCheckoutInitiate()}
                language={language}
            />

            <main className="flex-grow relative z-10">
                <Routes>
                    <Route path="/" element={
                        <>
                            <Hero language={language} />
                            <Suspense fallback={<div className="h-96 flex items-center justify-center"><LoadingFallback /></div>}>
                                <FeaturedCategories onNavigate={handleNavigate} language={language} />
                            </Suspense>
                            <Suspense fallback={<div className="h-96" />}>
                                <BrandStory />
                            </Suspense>
                            <ProductList 
                                products={filteredProducts} 
                                onProductClick={handleProductClick} 
                                onAddToCart={addToCart}
                                language={language}
                                isLoading={isLoadingProducts}
                                filterState={filterState}
                                setFilterState={setFilterState}
                            />
                        </>
                    } />
                    <Route path="/shop" element={renderShop()} />
                    <Route path="/collections" element={renderCollections()} />
                    <Route path="/about" element={renderAbout()} />
                    
                    <Route path="/careers" element={
                         <div className="min-h-screen py-24 flex items-center justify-center">
                             <div className="text-center">
                                 <h1 className="text-4xl font-black text-brand-navy dark:text-white">Careers</h1>
                                 <p className="text-gray-500 mt-2">Join us.</p>
                             </div>
                         </div>
                    } />
                    <Route path="/privacy" element={
                        <div className="min-h-screen py-24 px-8 max-w-4xl mx-auto">
                            <h1 className="text-3xl font-bold mb-4 dark:text-white">Privacy Policy</h1>
                            <p className="dark:text-gray-300">{translations[language].pages.privacy.intro}</p>
                        </div>
                    } />
                    <Route path="/terms" element={
                        <div className="min-h-screen py-24 px-8 max-w-4xl mx-auto">
                            <h1 className="text-3xl font-bold mb-4 dark:text-white">Terms</h1>
                             <p className="dark:text-gray-300">{translations[language].pages.terms.intro}</p>
                        </div>
                    } />
                    <Route path="/shipping" element={
                        <div className="min-h-screen py-24 px-8 max-w-4xl mx-auto">
                            <h1 className="text-3xl font-bold mb-4 dark:text-white">Shipping</h1>
                             <p className="dark:text-gray-300">{translations[language].pages.shipping.intro}</p>
                        </div>
                    } />
                    <Route path="/returns" element={
                         <div className="min-h-screen py-24 px-8 max-w-4xl mx-auto">
                            <h1 className="text-3xl font-bold mb-4 dark:text-white">Returns</h1>
                             <p className="dark:text-gray-300">{translations[language].pages.returns.intro}</p>
                        </div>
                    } />
                    
                    <Route path="/product/:slug" element={<ProductDetailRoute />} />
                    
                    <Route path="/checkout" element={
                      <Suspense fallback={<LoadingFallback />}>
                        <PaymentGate 
                            total={cartTotal} 
                            onSuccess={handlePaymentSuccess} 
                            onCancel={() => navigate('/')} 
                            language={language}
                        />
                      </Suspense>
                    } />
                    <Route path="/success" element={renderCheckoutSuccess()} />
                    
                    <Route path="/admin" element={
                       <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingFallback /></div>}>
                         <AdminDashboard language={language} onNavigate={handleNavigate} />
                       </Suspense>
                    } />
                    <Route path="/sell" element={
                       <Suspense fallback={<LoadingFallback />}>
                         <VendorOnboarding language={language} onComplete={() => navigate('/admin')} />
                       </Suspense>
                    } />
                    <Route path="/store/:slug" element={<StoreFrontRoute />} />
                    
                    <Route path="/404" element={
                      <Suspense fallback={<LoadingFallback />}>
                        <NotFound language={language} onNavigate={handleNavigate} />
                      </Suspense>
                    } />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </main>

            <Suspense fallback={null}>
               <AIChat language={language} />
            </Suspense>

            {/* Footer with Database Status Indicator */}
            {/* We can simply use location check here */}
            {!location.pathname.startsWith('/admin') && 
             !location.pathname.startsWith('/404') && 
             !location.pathname.startsWith('/sell') && 
             !location.pathname.startsWith('/store') && 
             !location.pathname.startsWith('/checkout') && (
                <footer className="bg-brand-navy dark:bg-slate-950 text-white py-12 transition-colors duration-300 relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-bold mb-4">ASCEND</h3>
                            <p className="text-gray-300 text-sm">{t.footer.desc}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">{t.footer.links}</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li onClick={() => navigate('/about')} className="hover:text-white cursor-pointer hover:underline p-1">{t.footer.about}</li>
                                <li onClick={() => navigate('/careers')} className="hover:text-white cursor-pointer hover:underline p-1">{t.footer.careers}</li>
                                <li onClick={() => navigate('/privacy')} className="hover:text-white cursor-pointer hover:underline p-1">{t.footer.privacy}</li>
                                <li onClick={() => navigate('/terms')} className="hover:text-white cursor-pointer hover:underline p-1">{t.footer.terms}</li>
                                <li onClick={() => navigate('/shipping')} className="hover:text-white cursor-pointer hover:underline p-1">{t.footer.shipping}</li>
                                <li onClick={() => navigate('/returns')} className="hover:text-white cursor-pointer hover:underline p-1">{t.footer.returns}</li>
                                <li onClick={() => navigate('/sell')} className="hover:text-brand-lime cursor-pointer hover:underline p-1 font-bold text-brand-sky">Sell on ASCEND</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">{t.footer.newsletter}</h3>
                            {isSubscribed ? (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                                    <div className="bg-green-500 rounded-full p-1">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-green-400">Thanks for subscribing!</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="flex relative">
                                    <input 
                                        type="email" 
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        placeholder={t.footer.emailPlaceholder} 
                                        className="bg-brand-navy/80 border border-white/20 dark:bg-slate-900 text-white px-4 py-2 rounded-s-md outline-none focus:ring-1 focus:ring-brand-lime w-full placeholder-gray-400 disabled:opacity-50 min-h-[48px]"
                                        disabled={isSubscribing}
                                        aria-label={t.footer.emailPlaceholder}
                                    />
                                    <button 
                                        type="submit"
                                        disabled={isSubscribing}
                                        className="bg-brand-lime text-brand-navy px-4 py-2 rounded-e-md hover:bg-brand-lime/90 text-sm font-bold transition-colors disabled:opacity-70 min-w-[100px] min-h-[48px]"
                                    >
                                        {isSubscribing ? '...' : t.footer.subscribe}
                                    </button>
                                </form>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-center text-gray-400 text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span>© 2025 ASCEND. {t.footer.rights}</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            <Database className={`w-3 h-3 ${dbStatus === 'ready' ? 'text-green-400' : 'text-yellow-400 animate-pulse'}`} />
                            <span className="text-[10px] font-mono tracking-wider text-gray-400">
                                {dbStatus === 'ready' ? 'HIGH-SPEED CACHE ACTIVE' : 'SYNCING DB...'}
                            </span>
                        </div>
                    </div>
                </footer>
            )}
          </ErrorBoundary>
        </div>
    </div>
  );
};

export default App;
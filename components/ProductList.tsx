
import React, { useState } from 'react';
import { Product, Language, FilterState } from '../types';
import { Plus, SlidersHorizontal, ChevronDown, Check, X, Star, Search, Heart, ShoppingBag } from 'lucide-react';
import { translations } from '../utils/translations';

interface ProductListProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  language: Language;
  isLoading?: boolean;
  filterState?: FilterState;
  setFilterState?: React.Dispatch<React.SetStateAction<FilterState>>;
}

const ProductSkeleton = () => (
  <div className="group relative animate-pulse">
    <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-200 dark:bg-slate-800"></div>
    <div className="mt-4 space-y-2">
       <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4"></div>
       <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/4"></div>
    </div>
  </div>
);

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onProductClick, 
  onAddToCart, 
  language, 
  isLoading = false,
  filterState,
  setFilterState
}) => {
  const t = translations[language].products;
  const isRtl = language === 'ar';
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Available Filter Options
  const availableBrands = ['ASCEND', 'NorthFace', 'Fossil', 'Sony', 'Vans', 'PotteryBarn', 'RayBan', 'Lululemon'];

  const getName = (p: Product) => (isRtl && p.nameAr) ? p.nameAr : p.name;
  const getCategory = (p: Product) => (isRtl && p.categoryAr) ? p.categoryAr : p.category;

  const handleBrandToggle = (brand: string) => {
    if (!setFilterState || !filterState) return;
    const newBrands = filterState.brands.includes(brand)
      ? filterState.brands.filter(b => b !== brand)
      : [...filterState.brands, brand];
    setFilterState({ ...filterState, brands: newBrands });
  };

  const clearFilters = () => {
    if (setFilterState) {
        setFilterState({
            category: [],
            priceRange: [0, 500],
            brands: [],
            colors: [],
            minRating: 0,
            inStockOnly: false,
            sortBy: 'relevance'
        });
    }
  };

  const FilterSidebar = () => {
      if (!filterState || !setFilterState) return null;
      return (
          <div className="space-y-10">
              {/* Brand Filter */}
              <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-brand-navy dark:text-white mb-6">Brands</h3>
                  <div className="space-y-3">
                      {availableBrands.map(brand => (
                          <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${filterState.brands.includes(brand) ? 'bg-brand-navy border-brand-navy dark:bg-brand-lime dark:border-brand-lime' : 'border-gray-300 dark:border-slate-600'}`}>
                                  {filterState.brands.includes(brand) && <Check className="w-3 h-3 text-white dark:text-brand-navy" />}
                              </div>
                              <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={filterState.brands.includes(brand)}
                                onChange={() => handleBrandToggle(brand)}
                              />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-brand-navy dark:group-hover:text-white transition-colors">{brand}</span>
                          </label>
                      ))}
                  </div>
              </div>

              {/* Stock Toggle */}
              <div className="pt-6 border-t border-gray-100 dark:border-slate-800">
                  <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-bold text-brand-navy dark:text-white">In Stock Only</span>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-slate-700 transition-colors">
                          <input 
                            type="checkbox" 
                            className="peer sr-only" 
                            checked={filterState.inStockOnly}
                            onChange={() => setFilterState({...filterState, inStockOnly: !filterState.inStockOnly})}
                          />
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filterState.inStockOnly ? 'translate-x-6 bg-brand-navy dark:bg-brand-lime' : 'translate-x-1'}`} />
                      </div>
                  </label>
              </div>
          </div>
      )
  };

  return (
    <div className="bg-white dark:bg-brand-dark transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Modern Header / Toolbar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
                <h2 className="text-3xl font-black tracking-tighter text-brand-navy dark:text-white mb-2">
                    {t.allProducts}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    {products.length} Items found
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-slate-800 text-brand-navy dark:text-white rounded-full font-bold text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>

                {filterState && setFilterState && (
                    <div className="relative group">
                        <select
                            value={filterState.sortBy}
                            onChange={(e) => setFilterState({...filterState, sortBy: e.target.value as any})}
                            className="appearance-none pl-5 pr-12 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-full text-sm font-bold text-brand-navy dark:text-white focus:ring-2 focus:ring-brand-navy cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <option value="relevance">Sort: Recommended</option>
                            <option value="newest">Newest Arrivals</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="rating">Best Rated</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                )}
            </div>
        </div>

        {/* Active Filters Pills */}
        {filterState && (filterState.brands.length > 0 || filterState.inStockOnly) && (
            <div className="flex flex-wrap items-center gap-2 mb-8 animate-fade-in">
                {filterState.brands.map(b => (
                    <button key={b} onClick={() => handleBrandToggle(b)} className="px-4 py-1.5 rounded-full border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-bold flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors">
                        {b} <X className="w-3 h-3" />
                    </button>
                ))}
                <button onClick={clearFilters} className="text-xs font-bold text-brand-navy dark:text-brand-lime hover:underline ml-2">Clear All</button>
            </div>
        )}

        <div className="lg:grid lg:grid-cols-4 lg:gap-x-12 xl:gap-x-16">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 pt-2">
               <div className="sticky top-24">
                   <FilterSidebar />
               </div>
          </aside>

          {/* Modern Product Grid */}
          <div className="lg:col-span-3">
             {products.length === 0 && !isLoading ? (
                 <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50/50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-slate-800">
                     <Search className="w-12 h-12 text-gray-300 mb-4" />
                     <h3 className="text-xl font-bold text-brand-navy dark:text-white">No matches found</h3>
                     <p className="text-gray-500 mt-2 mb-6 max-w-xs">We couldn't find any products matching your filters.</p>
                     <button onClick={clearFilters} className="px-6 py-2 bg-brand-navy text-white rounded-full font-bold text-sm">Reset Filters</button>
                 </div>
             ) : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading 
                    ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
                    : products.map((product) => (
                    <div key={product.id} className="group relative">
                        {/* Image Container */}
                        <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-slate-800 relative">
                            <img
                                src={product.image}
                                alt={getName(product)}
                                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                {!product.inStock && (
                                    <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Sold Out</span>
                                )}
                                {product.id % 3 === 0 && product.inStock && (
                                    <span className="px-3 py-1 bg-brand-lime text-brand-navy text-[10px] font-bold uppercase tracking-widest rounded-full">New</span>
                                )}
                            </div>

                            {/* Wishlist Button (Visual) */}
                            <button className="absolute top-3 right-3 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 z-10">
                                <Heart className="w-4 h-4" />
                            </button>

                            {/* Hover Action Overlay */}
                            <div className="absolute inset-x-4 bottom-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddToCart(product);
                                    }}
                                    disabled={!product.inStock}
                                    className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                                        product.inStock
                                        ? 'bg-white text-brand-navy hover:bg-brand-navy hover:text-white dark:bg-brand-navy dark:text-white dark:hover:bg-white dark:hover:text-brand-navy'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                   <ShoppingBag className="w-4 h-4" /> {product.inStock ? t.addToCart : 'Out of Stock'}
                                </button>
                            </div>
                            
                            {/* Click Area for Detail */}
                            <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => onProductClick(product)} />
                        </div>

                        {/* Product Info */}
                        <div className="mt-4" onClick={() => onProductClick(product)}>
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 cursor-pointer">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-brand-navy dark:group-hover:text-brand-lime transition-colors">
                                        {getName(product)}
                                    </h3>
                                    <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{getCategory(product)}</p>
                                </div>
                                <p className="text-base font-bold text-brand-navy dark:text-white bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                    ${product.price}
                                </p>
                            </div>
                            
                            {/* Color Swatches */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mt-3 flex gap-1.5">
                                    {product.colors.slice(0, 3).map((color, idx) => (
                                        <div 
                                            key={idx}
                                            className="w-4 h-4 rounded-full border border-gray-200 dark:border-slate-600 shadow-sm"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        ></div>
                                    ))}
                                    {product.colors.length > 3 && (
                                        <span className="text-[10px] text-gray-400 font-medium flex items-center">+{product.colors.length - 3}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    ))
                }
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileFiltersOpen(false)} />
            <div className="fixed inset-x-0 bottom-0 z-50 w-full bg-white dark:bg-slate-900 rounded-t-[2rem] shadow-2xl transition-transform max-h-[85vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
                    <h2 className="text-xl font-black text-brand-navy dark:text-white">Filters</h2>
                    <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 hover:text-brand-navy">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8 overflow-y-auto flex-1">
                    <FilterSidebar />
                </div>
                <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 flex gap-4">
                    <button onClick={() => { clearFilters(); setIsMobileFiltersOpen(false); }} className="flex-1 py-3.5 text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-xl">Reset</button>
                    <button onClick={() => setIsMobileFiltersOpen(false)} className="flex-1 py-3.5 text-sm font-bold text-white bg-brand-navy rounded-xl shadow-lg shadow-brand-navy/20">Show Results</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
    
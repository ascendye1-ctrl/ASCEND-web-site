
import React from 'react';
import { Product, Language, FilterState } from '../types';
import { ShoppingBag, Share2, Star } from 'lucide-react';
import { translations } from '../utils/translations';

interface ProductListProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onShare: (product: Product) => void;
  language: Language;
  isLoading?: boolean;
  filterState?: FilterState;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onProductClick, 
  onAddToCart, 
  onShare,
  language, 
  isLoading = false
}) => {
  const t = translations[language].products;
  const isRtl = language === 'ar';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-4">
            <div className="aspect-[4/5] bg-gray-200 dark:bg-slate-800 rounded-3xl" />
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-2/3" />
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-brand-dark transition-colors duration-500">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
            <div key={product.id} className="group relative flex flex-col">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-gray-100 dark:bg-slate-900 relative shadow-inner">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="h-full w-full object-cover object-center transition-transform duration-[1.2s] ease-out group-hover:scale-110" 
                    />
                    
                    {/* Hover Overlay Actions */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); onShare(product); }}
                        className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-xl rounded-2xl text-white hover:bg-brand-lime hover:text-brand-navy transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-500 z-10 border border-white/20 shadow-2xl"
                        title="Share Product"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>

                    <div className="absolute inset-x-4 bottom-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                            className="w-full py-4 bg-white text-brand-navy rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 hover:bg-brand-navy hover:text-white active:scale-95 transition-all"
                        >
                           <ShoppingBag className="w-4 h-4" /> {t.addToCart}
                        </button>
                    </div>
                    
                    <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => onProductClick(product)} />
                </div>

                <div className="mt-6 flex flex-col flex-1 cursor-pointer" onClick={() => onProductClick(product)}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-brand-navy dark:group-hover:text-brand-lime transition-colors leading-tight uppercase italic tracking-tighter">
                                {isRtl ? product.nameAr : product.name}
                            </h3>
                            <p className="mt-1 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{isRtl ? product.categoryAr : product.category}</p>
                        </div>
                        <p className="text-xl font-bold text-brand-navy dark:text-white">
                            ${product.price.toFixed(0)}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 mt-auto">
                        <Star className="w-3 h-3 fill-brand-lime text-brand-lime" />
                        <span className="text-[10px] font-bold text-gray-500">{product.rating}</span>
                    </div>
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;

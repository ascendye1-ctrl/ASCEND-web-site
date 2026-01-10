import React from 'react';
import { Product, Language, FilterState } from '../types';
import { Star, ShoppingCart, Loader } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  language: Language;
  isLoading?: boolean;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  formatPrice: (price: number) => string;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onProductClick, 
  onAddToCart, 
  language, 
  isLoading,
  formatPrice 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin text-brand-navy" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">
        {language === 'ar' ? 'منتجاتنا' : 'Our Products'}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 group"
          >
            <div 
              className="relative aspect-square overflow-hidden cursor-pointer"
              onClick={() => onProductClick(product)}
            >
              <img 
                src={product.image} 
                alt={language === 'ar' ? product.nameAr : product.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1">
                  {language === 'ar' ? product.nameAr : product.name}
                </h3>
                <div className="flex items-center text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">{product.rating}</span>
                </div>
              </div>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                {language === 'ar' ? product.descriptionAr : product.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-brand-navy dark:text-brand-lime">
                  {formatPrice(product.price)}
                </span>
                <button 
                  onClick={() => onAddToCart(product)}
                  className="bg-slate-900 dark:bg-brand-lime dark:text-slate-900 text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <ShoppingCart size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            {language === 'ar' ? 'لا توجد منتجات تطابق بحثك' : 'No products found matching your search'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
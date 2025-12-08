
import React, { useState } from 'react';
import { Vendor, Product, Language } from '../types';
import { MapPin, Star, Calendar, MessageCircle, CheckCircle, Search, Filter } from 'lucide-react';
import ProductList from './ProductList';
import ReviewsList from './ReviewsList';
import { translations } from '../utils/translations';

interface StoreFrontProps {
  vendor: Vendor;
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  language: Language;
}

const StoreFront: React.FC<StoreFrontProps> = ({ vendor, products, onProductClick, onAddToCart, language }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews'>('products');
  const t = translations[language].store;

  // Map internal tab keys to display keys if needed, or just use as logic keys
  // For display we'll use translations

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark pb-20 animate-fade-in">
      {/* Vendor Hero Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        <img 
          src={vendor.banner} 
          alt={`${vendor.name} banner`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-end gap-6">
          <div className="relative">
            <img 
              src={vendor.logo} 
              alt={vendor.name} 
              className="w-20 h-20 sm:w-32 sm:h-32 rounded-xl border-4 border-white dark:border-brand-dark shadow-xl object-cover bg-white" 
            />
            {vendor.isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full shadow-sm border-2 border-white dark:border-brand-dark" title={t.verifiedVendor}>
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-white mb-0 sm:mb-2 w-full">
            <h1 className="text-2xl sm:text-3xl sm:text-4xl font-black tracking-tight">{vendor.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs sm:text-sm sm:text-base text-gray-200">
               <div className="flex items-center gap-1">
                 <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                 <span className="font-bold text-white">{vendor.rating}</span>
                 <span className="opacity-70">({vendor.reviews.length} {translations[language].products.reviews})</span>
               </div>
               <div className="flex items-center gap-1">
                 <MapPin className="w-3 h-3 sm:w-4 sm:h-4 opacity-70" />
                 <span>{t.defaultLocation}</span>
               </div>
               <div className="flex items-center gap-1">
                 <Calendar className="w-3 h-3 sm:w-4 sm:h-4 opacity-70" />
                 <span>{t.joined} {new Date(vendor.joinedDate).getFullYear()}</span>
               </div>
            </div>
          </div>

          <div className="hidden sm:block mb-4">
             <button className="bg-white text-brand-navy font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
               <MessageCircle className="w-4 h-4" /> {t.contact}
             </button>
          </div>
        </div>
      </div>

      {/* Tabs - Scrollable on mobile */}
      <div className="sticky top-16 z-20 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex gap-8 overflow-x-auto no-scrollbar">
             <button
                 onClick={() => setActiveTab('products')}
                 className={`py-4 text-sm font-bold uppercase tracking-wider border-b-4 transition-colors whitespace-nowrap ${
                   activeTab === 'products' 
                     ? 'border-brand-navy text-brand-navy dark:border-brand-lime dark:text-brand-lime' 
                     : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                 }`}
               >
                 {translations[language].nav.shop}
               </button>
               <button
                 onClick={() => setActiveTab('reviews')}
                 className={`py-4 text-sm font-bold uppercase tracking-wider border-b-4 transition-colors whitespace-nowrap ${
                   activeTab === 'reviews' 
                     ? 'border-brand-navy text-brand-navy dark:border-brand-lime dark:text-brand-lime' 
                     : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                 }`}
               >
                 {translations[language].products.reviews}
               </button>
               <button
                 onClick={() => setActiveTab('about')}
                 className={`py-4 text-sm font-bold uppercase tracking-wider border-b-4 transition-colors whitespace-nowrap ${
                   activeTab === 'about' 
                     ? 'border-brand-navy text-brand-navy dark:border-brand-lime dark:text-brand-lime' 
                     : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                 }`}
               >
                 {t.about}
               </button>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {activeTab === 'products' && (
           <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                 <h2 className="text-xl font-bold text-brand-navy dark:text-white">{t.products} ({products.length})</h2>
                 <div className="flex w-full sm:w-auto gap-2">
                    <button className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-500">
                      <Filter className="w-5 h-5" />
                    </button>
                    <div className="relative flex-1 sm:flex-none">
                      <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                      <input 
                        type="text" 
                        placeholder={t.search} 
                        className={`w-full sm:w-64 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-brand-navy ${language === 'ar' ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
                      />
                    </div>
                 </div>
              </div>
              <ProductList 
                products={products} 
                onProductClick={onProductClick} 
                onAddToCart={onAddToCart} 
                language={language} 
              />
           </div>
         )}

         {activeTab === 'reviews' && (
            <div className="max-w-3xl">
               <ReviewsList reviews={vendor.reviews} language={language} />
            </div>
         )}

         {activeTab === 'about' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-800 animate-fade-in max-w-4xl">
               <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-4">{t.about} {vendor.name}</h2>
               <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                 {vendor.description}
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-100 dark:border-slate-800">
                  <div>
                     <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.shipping}</h3>
                     <p className="text-sm text-gray-500">{t.shippingText}</p>
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.returns}</h3>
                     <p className="text-sm text-gray-500">{t.returnsText}</p>
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.satisfaction}</h3>
                     <p className="text-sm text-gray-500">{t.satisfactionText}</p>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default StoreFront;

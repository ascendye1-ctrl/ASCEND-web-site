
import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ViewState, Language } from '../types';

interface FeaturedCategoriesProps {
  onNavigate: (view: ViewState) => void;
  language: Language;
}

const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onNavigate, language }) => {
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const categories = [
    {
      id: 1,
      title: language === 'ar' ? 'للرجال' : 'MEN',
      subtitle: language === 'ar' ? 'أساسيات أنيقة' : 'Refined Essentials',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: language === 'ar' ? 'للنساء' : 'WOMEN',
      subtitle: language === 'ar' ? 'مظهر جريء' : 'Bold Statements',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: language === 'ar' ? 'إكسسوارات' : 'ACCESSORIES',
      subtitle: language === 'ar' ? 'اللمسة الأخيرة' : 'Finishing Touches',
      image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      title: language === 'ar' ? 'تقنية' : 'TECH',
      subtitle: language === 'ar' ? 'معدات المستقبل' : 'Future Gear',
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80',
    }
  ];

  return (
    <div className="py-12 md:py-24 bg-white dark:bg-brand-dark transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
            <div>
                <h2 className="text-3xl md:text-4xl font-black text-brand-navy dark:text-white tracking-tighter mb-2">
                    {language === 'ar' ? 'تسوق حسب الفئة' : 'SHOP BY CATEGORY'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    {language === 'ar' ? 'استكشف مجموعاتنا المميزة' : 'Explore our curated collections'}
                </p>
            </div>
            <button 
                onClick={() => onNavigate('SHOP')}
                className="group flex items-center gap-2 font-bold text-sm text-brand-navy dark:text-brand-lime hover:underline"
            >
                {language === 'ar' ? 'عرض الكل' : 'View All'} <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
        </div>

        {/* 
            Mobile: Stacked Flex or Grid col-1 with auto height
            Desktop: Grid cols-3 with fixed height and spans
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[600px]">
           {/* Card 1: Large (Left on Desktop, Top on Mobile) */}
           <div 
             onClick={() => onNavigate('SHOP')}
             className="relative md:col-span-1 md:row-span-2 group overflow-hidden rounded-[2rem] cursor-pointer h-[300px] md:h-auto"
           >
              <img src={categories[0].image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end">
                  <span className="text-brand-lime text-xs font-bold uppercase tracking-widest mb-2 opacity-100 md:opacity-0 transform md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">{categories[0].subtitle}</span>
                  <h3 className="text-3xl font-black text-white">{categories[0].title}</h3>
                  <div className="h-1 w-12 bg-white mt-4 transition-all duration-500 group-hover:w-full group-hover:bg-brand-lime hidden md:block"></div>
              </div>
           </div>

           {/* Card 2: Top Right */}
           <div 
             onClick={() => onNavigate('SHOP')}
             className="relative md:col-span-1 md:row-span-1 group overflow-hidden rounded-[2rem] cursor-pointer h-[200px] md:h-auto"
           >
              <img src={categories[1].image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors p-6 flex flex-col justify-end">
                   <h3 className="text-2xl font-black text-white">{categories[1].title}</h3>
              </div>
           </div>

           {/* Card 3: Top Far Right */}
           <div 
             onClick={() => onNavigate('SHOP')}
             className="relative md:col-span-1 md:row-span-1 group overflow-hidden rounded-[2rem] cursor-pointer h-[200px] md:h-auto"
           >
              <img src={categories[2].image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors p-6 flex flex-col justify-end">
                   <h3 className="text-2xl font-black text-white">{categories[2].title}</h3>
              </div>
           </div>

           {/* Card 4: Bottom Wide */}
           <div 
             onClick={() => onNavigate('SHOP')}
             className="relative md:col-span-2 md:row-span-1 group overflow-hidden rounded-[2rem] cursor-pointer h-[250px] md:h-auto"
           >
              <img src={categories[3].image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-8 flex flex-col justify-center items-start">
                   <span className="text-brand-sky text-xs font-bold uppercase tracking-widest mb-2">{categories[3].subtitle}</span>
                   <h3 className="text-3xl font-black text-white mb-6">{categories[3].title}</h3>
                   <button className="bg-white text-brand-navy px-6 py-3 rounded-full font-bold text-sm md:opacity-0 group-hover:opacity-100 transform md:translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                       {language === 'ar' ? 'تسوق الآن' : 'Shop Collection'}
                   </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;

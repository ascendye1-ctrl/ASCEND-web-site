import React from 'react';
import { ArrowLeft, ArrowRight, Home, Search } from 'lucide-react';
import { Language, ViewState } from '../types';

interface NotFoundProps {
  language: Language;
  onNavigate: (view: ViewState) => void;
}

const NotFound: React.FC<NotFoundProps> = ({ language, onNavigate }) => {
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  const content = {
    en: {
      code: "404",
      title: "Page Not Found",
      desc: "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.",
      back: "Back to Home",
      search: "Search for Products"
    },
    ar: {
      code: "٤٠٤",
      title: "الصفحة غير موجودة",
      desc: "عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها.",
      back: "العودة للرئيسية",
      search: "البحث عن المنتجات"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center bg-grid-pattern dark:bg-grid-pattern relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-navy/5 dark:bg-brand-lime/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 animate-fade-in max-w-lg mx-auto">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-navy to-brand-sky dark:from-white dark:to-gray-500 opacity-20 dark:opacity-10 select-none">
          {t.code}
        </h1>
        
        <div className="-mt-12 mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy dark:text-white mb-4">
                {t.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {t.desc}
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
                onClick={() => onNavigate('HOME')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-brand-navy rounded-full shadow-lg shadow-brand-navy/20 hover:bg-brand-navy/90 hover:shadow-brand-navy/30 transition-all focus:ring-4 focus:ring-brand-navy/20 min-h-[48px]"
                aria-label={t.back}
            >
                <ArrowIcon className="w-4 h-4" />
                {t.back}
            </button>
            <button 
                onClick={() => onNavigate('SHOP')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-brand-navy dark:text-white bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full hover:bg-gray-50 dark:hover:bg-slate-700 transition-all focus:ring-4 focus:ring-gray-200 dark:focus:ring-slate-700 min-h-[48px]"
                aria-label={t.search}
            >
                <Search className="w-4 h-4" />
                {t.search}
            </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
import React, { useState } from 'react';
import { Search, Menu, ShoppingCart, Moon, Sun, LayoutDashboard, X, ChevronRight, ChevronLeft, Globe, Share2, Check, Banknote } from 'lucide-react';
import { CartItem, Language, Theme, ViewState, Currency } from '../types';
import { translations } from '../utils/translations';

interface HeaderProps {
  cartItems: CartItem[];
  setIsCartOpen: (isOpen: boolean) => void;
  onNavigate: (view: ViewState) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  // الـ Props الجديدة التي طلبت إضافتها:
  currency: Currency;
  setCurrency: (curr: Currency) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartItems, 
  setIsCartOpen, 
  onNavigate, 
  language, 
  setLanguage, 
  theme, 
  toggleTheme, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  currency,
  setCurrency 
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const t = translations[language].nav;
  const isRtl = language === 'ar';
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const AscendLogo = () => (
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('HOME')}>
      <img src="/logo.png" alt="ASCEND YEMEN" className="h-10 w-auto object-contain" />
      <div className="flex flex-col">
        <span className="text-2xl font-black text-brand-navy dark:text-white leading-none">ASCEND</span>
        <span className="text-[10px] font-bold text-brand-lime mt-1 tracking-widest">YEMEN</span>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800/50 transition-all duration-300 h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-brand-navy dark:text-white"><Menu /></button>
          <AscendLogo />
        </div>
        
        <div className="flex items-center gap-2">
          {/* زر تبديل العملة الجديد */}
          <button 
            onClick={() => setCurrency(currency === 'USD' ? 'YER' : 'USD')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-brand-navy dark:text-white hover:bg-brand-lime hover:text-brand-navy transition-colors duration-200"
            title={currency === 'USD' ? "Switch to Rial" : "التحويل للدولار"}
          >
            <Banknote size={16} />
            <span className="text-xs font-bold">{currency}</span>
          </button>

          <button onClick={toggleTheme} className="p-2 text-brand-navy dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
          </button>
          
          <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="p-2 text-brand-navy dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <Globe size={20}/>
          </button>
          
          <button onClick={() => setIsCartOpen(true)} className="p-2 text-brand-navy dark:text-white relative hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ShoppingCart size={20}/>
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-lime text-[10px] px-1.5 py-0.5 rounded-full text-brand-navy font-bold shadow-sm">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
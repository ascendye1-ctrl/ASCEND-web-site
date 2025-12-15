
import React, { useState } from 'react';
import { Search, Menu, ShoppingCart, Moon, Sun, LayoutDashboard, X, ChevronRight, ChevronLeft, User, Globe, Share2, Check } from 'lucide-react';
import { CartItem, Language, Theme, ViewState } from '../types';
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
  setIsMobileMenuOpen
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
    <div className="flex items-center gap-1 group cursor-pointer" onClick={() => onNavigate('HOME')}>
      <span className="text-3xl font-black tracking-tight text-brand-navy dark:text-white transition-colors duration-300">
        ASCEND
      </span>
      <div className="w-2 h-2 rounded-full bg-brand-lime mb-3 animate-pulse"></div>
    </div>
  );

  const NavLink = ({ view, label, onClick }: { view?: ViewState, label: string, onClick?: () => void }) => (
      <button 
        onClick={() => {
            if (view) onNavigate(view);
            if (onClick) onClick();
            setIsMobileMenuOpen(false);
        }}
        className="text-sm font-bold text-gray-600 hover:text-brand-navy dark:text-gray-300 dark:hover:text-brand-lime transition-colors py-2 uppercase tracking-wide relative group"
      >
        {label}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-navy dark:bg-brand-lime transition-all duration-300 group-hover:w-full"></span>
      </button>
  );

  const MobileNavLink = ({ view, label, delay }: { view: ViewState, label: string, delay: number }) => (
      <button 
          onClick={() => {
              onNavigate(view);
              setIsMobileMenuOpen(false);
          }}
          className={`flex items-center justify-between w-full p-4 text-lg font-bold text-brand-navy dark:text-white border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
              isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: `${delay}ms` }}
      >
          {label}
          <ChevronIcon className="w-5 h-5 text-gray-400" />
      </button>
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-brand-dark/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800/50 transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Area */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ms-2 lg:hidden text-brand-navy dark:text-white"
                aria-label="Open menu"
              >
                <Menu className="w-7 h-7" />
              </button>
              <AscendLogo />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex gap-10">
              <NavLink view="HOME" label={t.home} />
              <NavLink view="SHOP" label={t.shop} />
              <NavLink view="SHOP" label={t.newArrivals} />
              <NavLink view="COLLECTIONS" label={t.collections} />
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              
               {/* Search (Desktop) */}
               <button className="hidden sm:flex p-2.5 text-brand-navy dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>

              {/* Share Link */}
              <button 
                onClick={handleShare}
                className="hidden sm:flex p-2.5 text-brand-navy dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Copy Link"
              >
                {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
              </button>

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="hidden sm:flex p-2.5 text-brand-navy dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

               {/* Language Toggle (Desktop) */}
               <button 
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="hidden sm:flex p-2.5 text-brand-navy dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title={translations[language].common.switchLanguage}
              >
                <Globe className="w-5 h-5" />
                <span className="sr-only">{translations[language].common.switchLanguage}</span>
              </button>

               {/* Admin */}
               <button 
                onClick={() => onNavigate('ADMIN_DASHBOARD')}
                className="hidden md:flex p-2.5 text-brand-navy dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Admin"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 text-brand-navy dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
                aria-label={`Cart ${itemCount} items`}
              >
                <ShoppingCart className="w-6 h-6 sm:w-5 sm:h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 end-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-lime text-[10px] font-bold text-brand-navy ring-2 ring-white dark:ring-brand-dark animate-bounce">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
      >
          <div 
            className={`absolute inset-0 bg-brand-navy/60 dark:bg-black/80 backdrop-blur-sm transition-all duration-500 ease-in-out ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          <div 
             className={`absolute inset-y-0 w-[85%] max-w-sm bg-white dark:bg-brand-dark shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col ${
                 isMobileMenuOpen 
                    ? 'translate-x-0' 
                    : (isRtl ? 'translate-x-full' : '-translate-x-full')
             }`}
             style={{ [isRtl ? 'right' : 'left']: 0 }}
          >
              <div className="h-24 flex items-center justify-between px-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
                  <span className={`text-3xl font-black tracking-tighter text-brand-navy dark:text-white transition-all duration-700 delay-100 ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                      MENU
                  </span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-2 -mr-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full transition-all duration-500 delay-100 ${isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
                  >
                      <X className="w-8 h-8" />
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 space-y-1">
                  <MobileNavLink view="HOME" label={t.home} delay={150} />
                  <MobileNavLink view="SHOP" label={t.shop} delay={200} />
                  <MobileNavLink view="COLLECTIONS" label={t.collections} delay={250} />
                  <MobileNavLink view="ABOUT" label={translations[language].footer.about} delay={300} />
                  <MobileNavLink view="CAREERS" label={translations[language].footer.careers} delay={350} />
                  <div className={`my-6 border-t border-gray-100 dark:border-slate-800 mx-6 transition-all duration-700 delay-300 ${isMobileMenuOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 origin-left'}`}></div>
                  <MobileNavLink view="ADMIN_DASHBOARD" label="Seller Dashboard" delay={400} />
              </div>

              <div className={`p-6 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 transition-all duration-700 delay-500 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform"
                      >
                         <Globe className="w-4 h-4" />
                         {translations[language].common.language}
                      </button>
                      <button 
                        onClick={toggleTheme}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform"
                      >
                         {theme === 'light' ? 'Dark' : 'Light'}
                      </button>
                  </div>
                  <button 
                    onClick={handleShare}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-brand-navy text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-navy/20 active:scale-95 transition-transform"
                  >
                     {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                     {isCopied ? 'Link Copied' : 'Share Website'}
                  </button>
              </div>
          </div>
      </div>
    </>
  );
};

export default Header;

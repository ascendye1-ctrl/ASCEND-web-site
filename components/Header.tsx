
import React, { useState, useEffect } from 'react';
import { Menu, ShoppingCart, Moon, Sun, Globe, Bell, Clock } from 'lucide-react';
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [msgIndex, setMsgIndex] = useState(0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const t = translations[language].nav;
  const isRtl = language === 'ar';

  const messages = isRtl 
    ? ["مرحباً بك في ASCEND!", "خصم ١٥٪ للطلبات الجديدة كود: NEW25", "خدمة عملاء ذكية متوفرة ٢٤/٧"]
    : ["Welcome to ASCEND Elite Store", "15% off your first order with code: NEW25", "AI Sales Assistant is online 24/7"];

  useEffect(() => {
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    const msgTimer = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % messages.length);
    }, 4500);

    return () => {
      clearInterval(clockTimer);
      clearInterval(msgTimer);
    };
  }, [messages.length]);

  const formattedTime = new Intl.DateTimeFormat(language === 'ar' ? 'ar-YE' : 'en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  }).format(currentTime);

  const formattedDate = new Intl.DateTimeFormat(language === 'ar' ? 'ar-YE' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(currentTime);

  return (
    <div className="z-50 sticky top-0">
      {/* Dynamic Announcement Bar (Visitor Messages + Live Clock) */}
      <div className="bg-brand-navy dark:bg-slate-950 text-white py-2 px-4 border-b border-white/10 text-[10px] sm:text-xs font-bold uppercase tracking-widest relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3 overflow-hidden">
                <Bell className="w-3.5 h-3.5 text-brand-lime animate-bounce shrink-0" />
                <div className="animate-fade-in whitespace-nowrap" key={messages[msgIndex]}>
                    {messages[msgIndex]}
                </div>
            </div>
            <div className="hidden md:flex items-center gap-6 opacity-80 font-mono tracking-normal">
                <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-brand-lime" />
                    {formattedDate} <span className="text-white/40">|</span> {formattedTime}
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    LIVE_SYNC
                </span>
            </div>
        </div>
        {/* Subtle decorative mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
      </div>

      <header className="bg-white/80 dark:bg-brand-dark/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 lg:hidden text-brand-navy dark:text-white transition-transform active:scale-90">
                <Menu className="w-7 h-7" />
              </button>
              <div className="flex items-center gap-1 cursor-pointer group" onClick={() => onNavigate('HOME')}>
                <span className="text-3xl font-black tracking-tighter text-brand-navy dark:text-white italic group-hover:skew-x-2 transition-transform">ASCEND</span>
                <div className="w-2.5 h-2.5 rounded-full bg-brand-lime mb-4 group-hover:animate-ping"></div>
              </div>
            </div>

            <nav className="hidden lg:flex gap-12">
              <button onClick={() => onNavigate('HOME')} className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-brand-navy dark:hover:text-brand-lime transition-all relative group">
                {t.home}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-lime transition-all group-hover:w-full"></span>
              </button>
              <button onClick={() => onNavigate('SHOP')} className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-brand-navy dark:hover:text-brand-lime transition-all relative group">
                {t.shop}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-lime transition-all group-hover:w-full"></span>
              </button>
              <button onClick={() => onNavigate('ABOUT')} className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-brand-navy dark:hover:text-brand-lime transition-all relative group">
                {isRtl ? 'اعرف المزيد' : 'Learn More'}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-lime transition-all group-hover:w-full"></span>
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="p-2.5 text-brand-navy dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all active:scale-90">
                {theme === 'light' ? <Moon className="w-5.5 h-5.5" /> : <Sun className="w-5.5 h-5.5" />}
              </button>
              <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="p-2.5 text-brand-navy dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all active:scale-90">
                <Globe className="w-5.5 h-5.5" />
              </button>
              <button onClick={() => setIsCartOpen(true)} className="p-2.5 text-brand-navy dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-full relative transition-all active:scale-90">
                <ShoppingCart className="w-5.5 h-5.5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-navy text-[9px] font-black text-white dark:bg-brand-lime dark:text-brand-navy ring-2 ring-white dark:ring-brand-dark">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;

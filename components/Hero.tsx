import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Zap, Star } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface HeroProps {
  language: Language;
}

const Hero: React.FC<HeroProps> = ({ language }) => {
  const t = translations[language].hero;
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const words = language === 'ar' 
    ? ['الحدود', 'التوقعات', 'المألوف'] 
    : ['LIMITS', 'EXPECTATIONS', 'ORDINARY'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    // Removed solid background to let the global "Visual Identity" gradient show through
    <div className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
      
      {/* Additional local overlay to ensure text readability if needed, but keeping it minimal for vibrancy */}
      <div className="absolute inset-0 bg-white/30 dark:bg-brand-dark/80 backdrop-blur-[2px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full flex-grow flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className={`text-center ${isRtl ? 'lg:text-right' : 'lg:text-left'} z-10 order-2 lg:order-1`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-navy/10 dark:bg-white/10 text-brand-navy dark:text-brand-lime text-xs font-black tracking-wider uppercase mb-6 sm:mb-8 animate-fade-in border border-brand-navy/5 dark:border-white/5 backdrop-blur-sm">
              <Zap className="w-3 h-3 fill-current" />
              <span>{t.year} Collection Live</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-brand-navy dark:text-white leading-[0.9] mb-6 sm:mb-8 min-h-[2.7em] lg:min-h-[1.8em] drop-shadow-sm">
              {language === 'ar' ? (
                <>ارتقِ بـ<br/>
                  <span key={activeWordIndex} className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-brand-sky animate-fade-in block filter drop-shadow-sm">
                    {words[activeWordIndex]}
                  </span>
                </>
              ) : (
                <>BEYOND <br/>
                  <span key={activeWordIndex} className="text-transparent bg-clip-text bg-gradient-to-r from-brand-navy via-brand-sky to-brand-lime dark:from-brand-lime dark:to-brand-sky animate-fade-in block pb-2">
                    {words[activeWordIndex]}.
                  </span>
                </>
              )}
            </h1>
            
            <p className="mt-6 text-lg text-brand-navy/80 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              {t.description}
            </p>
            
            <div className={`mt-10 flex flex-col sm:flex-row items-center gap-4 ${isRtl ? 'lg:justify-start' : 'lg:justify-start'} justify-center`}>
              <button className="w-full sm:w-auto rounded-full bg-brand-navy dark:bg-brand-lime text-white dark:text-brand-navy px-8 py-4 text-sm font-black tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
                {t.shopNow} <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto rounded-full px-8 py-4 text-sm font-bold text-brand-navy dark:text-white border-2 border-brand-navy/10 dark:border-white/20 hover:bg-white/50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                {t.learnMore}
              </button>
            </div>
          </div>

          {/* Visual Content (Bento Grid Style) - Mobile Optimized */}
          <div className="relative h-[400px] lg:h-[700px] w-full order-1 lg:order-2">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
                {/* Main Image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-10 lg:right-10 lg:translate-x-0 lg:translate-y-0 w-64 h-80 sm:w-80 sm:h-[450px] rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 z-20 group border-4 border-white dark:border-brand-navy/50">
                    <img 
                      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" 
                      alt="Fashion Model" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Floating Badge */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="block text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">New Arrival</span>
                                <span className="text-sm font-bold text-brand-navy dark:text-white">Summer Fit</span>
                            </div>
                            <span className="text-sm font-bold text-brand-navy dark:text-white">$129</span>
                        </div>
                    </div>
                </div>

                {/* Secondary Image - Hidden on very small screens to save space, visible on sm+ */}
                <div className="hidden sm:block absolute bottom-20 left-10 w-64 h-72 rounded-[2rem] overflow-hidden shadow-xl -rotate-6 hover:rotate-0 transition-transform duration-700 z-10 border-4 border-white dark:border-brand-navy/50 group">
                    <img 
                      src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" 
                      alt="Accessories" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </div>

                {/* Decorative Elements matching brand */}
                <div className="absolute top-0 left-10 lg:left-20 text-brand-lime animate-bounce delay-100 drop-shadow-lg">
                    <Sparkles className="w-12 h-12 lg:w-16 lg:h-16 opacity-90 fill-current" />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Infinite Marquee Strip - Enhanced Branding */}
      <div className="bg-brand-navy dark:bg-brand-lime text-white dark:text-brand-navy py-5 overflow-hidden relative z-20 rotate-1 shadow-2xl border-y-4 border-white/20 mt-auto mb-12 transform -mx-4 sm:mx-0">
          <div className="flex animate-scroll whitespace-nowrap">
              {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center mx-6 gap-6 opacity-100">
                      <span className="text-sm font-black tracking-[0.2em] uppercase">Premium Quality</span>
                      <Star className="w-4 h-4 fill-brand-lime dark:fill-brand-navy text-transparent" />
                      <span className="text-sm font-black tracking-[0.2em] uppercase">Sustainable</span>
                      <Star className="w-4 h-4 fill-brand-lime dark:fill-brand-navy text-transparent" />
                      <span className="text-sm font-black tracking-[0.2em] uppercase">Global Shipping</span>
                      <Star className="w-4 h-4 fill-brand-lime dark:fill-brand-navy text-transparent" />
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Hero;
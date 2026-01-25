
import React from 'react';
import { Mail, Facebook, Instagram, Twitter, MapPin, Phone, Send } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language].footer;
  const isRtl = language === 'ar';

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-900 pt-20 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-1">
              <span className="text-3xl font-black tracking-tighter text-brand-navy dark:text-white italic">ASCEND</span>
              <div className="w-2 h-2 rounded-full bg-brand-lime"></div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
              {t.desc} {isRtl ? 'نحن نسعى للارتقاء فوق العادي من خلال دمج التصميم المتميز مع أحدث تقنيات الذكاء الاصطناعي.' : 'We strive to rise above the ordinary by merging premium design with cutting-edge AI technology.'}
            </p>
            <div className="flex gap-4">
              <button className="p-2 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-400 hover:text-brand-navy dark:hover:text-brand-lime transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-400 hover:text-brand-navy dark:hover:text-brand-lime transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-400 hover:text-brand-navy dark:hover:text-brand-lime transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-brand-navy dark:text-white uppercase tracking-widest text-xs mb-6">{t.links}</h4>
            <ul className="space-y-4">
              {['about', 'careers', 'shipping', 'returns'].map((key) => (
                <li key={key}>
                  <a href={`#/${key}`} className="text-sm text-gray-500 hover:text-brand-navy dark:hover:text-brand-lime transition-colors">
                    {translations[language].footer[key as keyof typeof translations.en.footer]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-brand-navy dark:text-white uppercase tracking-widest text-xs mb-6">{isRtl ? 'اتصل بنا' : 'Contact Us'}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-500">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-navy dark:text-brand-lime" />
                <span>1221 Avenue of the Americas, <br/>New York, NY 10020</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-brand-navy dark:text-brand-lime" />
                <span>+1 (888) ASCEND-01</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Mail className="w-4 h-4 text-brand-navy dark:text-brand-lime" />
                <span>concierge@ascend.store</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-black text-brand-navy dark:text-white uppercase tracking-widest text-xs mb-6">{t.newsletter}</h4>
            <p className="text-xs text-gray-500 mb-4">{isRtl ? 'اشترك للحصول على تحديثات حصرية.' : 'Subscribe for exclusive drops and AI-curated updates.'}</p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t.emailPlaceholder}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-navy dark:focus:ring-brand-lime transition-all"
              />
              <button className={`absolute top-1 bottom-1 px-3 bg-brand-navy text-white rounded-lg hover:bg-brand-navy/90 transition-all ${isRtl ? 'left-1' : 'right-1'}`}>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} ASCEND GLOBAL. {t.rights}</p>
          <div className="flex gap-6">
            <a href="#/privacy" className="hover:text-brand-navy dark:hover:text-white">{t.privacy}</a>
            <a href="#/terms" className="hover:text-brand-navy dark:hover:text-white">{t.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

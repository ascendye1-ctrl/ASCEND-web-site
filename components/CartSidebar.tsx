import React from 'react';
import { X, Minus, Plus, Trash2, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
// استيراد الأنواع المتوفرة فقط وتجنب استيراد ما يسبب أخطاء
import { CartItem, Language } from '../types'; 
import { translations } from '../utils/translations';

// تعريف الأنواع محلياً لضمان عدم توقف الكود
type Currency = 'USD' | 'YER';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  language: Language;
  currency: Currency; 
  formatPrice: (price: number) => string;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout,
  language,
  currency,
  formatPrice
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // تأكد من وجود ترجمة للـ cart لتجنب خطأ undefined
  const t = translations[language]?.cart || {
    title: language === 'ar' ? 'سلة التسوق' : 'Shopping Cart',
    checkout: language === 'ar' ? 'إتمام الطلب' : 'Checkout',
    subtotal: language === 'ar' ? 'المجموع' : 'Subtotal',
    remove: language === 'ar' ? 'حذف' : 'Remove'
  };

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  // دالة لجلب الاسم حسب اللغة المتاحة في المنتج
  const getName = (item: any) => {
    if (language === 'ar' && item.nameAr) return item.nameAr;
    return item.name;
  };

  return (
    <div className={`fixed inset-0 z-[100] overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div className={`absolute inset-y-0 flex max-w-full pointer-events-none ${language === 'ar' ? 'left-0' : 'right-0'}`}>
        <div 
          className={`w-screen max-w-md transform transition-transform duration-500 ease-in-out pointer-events-auto bg-white dark:bg-slate-900 shadow-2xl ${
            isOpen ? 'translate-x-0' : (language === 'ar' ? '-translate-x-full' : 'translate-x-full')
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="px-4 py-6 sm:px-6 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-brand-navy dark:text-white">
                  {t.title}
                </h2>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-gray-300" />
                  <p className="text-gray-500">{language === 'ar' ? 'سلتك فارغة حالياً' : 'Your cart is empty'}</p>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-slate-800">
                        <img src={item.image} alt={getName(item)} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-bold text-brand-navy dark:text-white">
                          <h3 className="line-clamp-1">{getName(item)}</h3>
                          <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-md bg-gray-50 dark:bg-slate-800">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)} 
                              className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 text-sm font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)} 
                              className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-500 text-sm font-bold hover:text-red-700"
                          >
                            {t.remove}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 dark:border-slate-800 px-4 py-6 sm:px-6 bg-gray-50 dark:bg-slate-950">
                <div className="flex justify-between text-lg font-black text-brand-navy dark:text-white mb-4">
                  <span>{t.subtotal}</span>
                  <span className="text-brand-navy dark:text-brand-lime">{formatPrice(subtotal)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-brand-navy dark:bg-brand-lime text-white dark:text-brand-navy rounded-xl font-bold transition-transform active:scale-95 shadow-lg"
                >
                  {t.checkout}
                  <ArrowIcon size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
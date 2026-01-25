import React from 'react';
import { X, Minus, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { CartItem, Language } from '../types';
import { translations } from '../utils/translations';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  language: Language;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout,
  language
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const t = translations[language].cart;
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const getName = (p: CartItem) => (language === 'ar' && p.nameAr) ? p.nameAr : p.name;
  const getCategory = (p: CartItem) => (language === 'ar' && p.categoryAr) ? p.categoryAr : p.category;

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className={`absolute inset-y-0 right-0 flex max-w-full pl-0 pointer-events-none`}
           style={{ [language === 'ar' ? 'left' : 'right']: 0, [language === 'ar' ? 'right' : 'left']: 'auto' }}>
        <div 
          className={`w-screen max-w-md transform transition-transform duration-300 ease-in-out pointer-events-auto bg-white dark:bg-brand-dark shadow-xl ${
            isOpen ? 'translate-x-0' : (language === 'ar' ? '-translate-x-full' : 'translate-x-full')
          }`}
        >
          <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-brand-dark">
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-brand-navy dark:text-white">{t.title}</h2>
                <div className="ms-3 flex h-7 items-center">
                  <button onClick={onClose} className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <Trash2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{t.emptyTitle}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.emptyDesc}</p>
                    <button 
                      onClick={onClose}
                      className="mt-6 text-brand-navy dark:text-brand-lime font-medium hover:text-brand-navy/80 flex items-center gap-1"
                    >
                      {t.continue} <ArrowIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200 dark:divide-slate-800">
                      {items.map((item) => (
                        <li key={item.id} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-slate-800">
                            <img src={item.image} alt={getName(item)} className="h-full w-full object-cover object-center" />
                          </div>

                          <div className="ms-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                <h3>{getName(item)}</h3>
                                <p className="ms-4">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{getCategory(item)}</p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-md">
                                <button 
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-2 font-medium text-gray-900 dark:text-white min-w-[1.5rem] text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              <button 
                                type="button" 
                                onClick={() => onRemoveItem(item.id)}
                                className="font-medium text-red-500 hover:text-red-400"
                              >
                                {t.remove}
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-slate-800 px-4 py-6 sm:px-6 bg-gray-50 dark:bg-slate-950">
                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                  <p>{t.subtotal}</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{t.shippingNote}</p>
                <div className="mt-6">
                  <button
                    onClick={onCheckout}
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-brand-navy px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-brand-navy/90 transition-colors"
                  >
                    {t.checkout} <ArrowIcon className="w-5 h-5 ms-2" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;

import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface PaymentGateProps {
  total: number;
  onSuccess: () => void;
  onCancel: () => void;
  language: Language;
}

const PaymentGate: React.FC<PaymentGateProps> = ({ total, onSuccess, onCancel, language }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  const t = translations[language].payment;
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API delay
    setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
    }, 2500);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
        return parts.join(' ');
    } else {
        return value;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark flex items-center justify-center p-4">
       <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-slate-800 relative z-10 animate-fade-in">
           
           {/* Left: Summary */}
           <div className="bg-brand-navy dark:bg-slate-950 p-10 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden">
               <div className="relative z-10">
                   <button 
                     onClick={onCancel}
                     className="flex items-center gap-2 text-white/70 hover:text-white mb-8 text-sm font-medium"
                   >
                       <ArrowIcon className="w-4 h-4" /> {translations[language].products.backToCatalog}
                   </button>
                   <h2 className="text-3xl font-black tracking-tight mb-2">{t.title}</h2>
                   <p className="text-brand-sky opacity-80">{t.secureTransaction}</p>
                   
                   <div className="mt-12">
                       <p className="text-sm opacity-60 uppercase tracking-widest mb-1">{t.total}</p>
                       <p className="text-5xl font-bold">${total.toFixed(2)}</p>
                   </div>
               </div>
               
               {/* Abstract BG */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-lime opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-sky opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
               
               <div className="relative z-10 mt-8">
                   <div className="flex items-center gap-2 mb-2">
                       <ShieldCheck className="w-5 h-5 text-green-400" />
                       <span className="text-sm font-medium">Bank-Level Encryption</span>
                   </div>
                   <div className="flex items-center gap-2">
                       <CheckCircle className="w-5 h-5 text-green-400" />
                       <span className="text-sm font-medium">Verified Merchant</span>
                   </div>
               </div>
           </div>

           {/* Right: Form */}
           <div className="p-10 md:w-3/5 bg-white dark:bg-slate-900">
               <div className="flex justify-between items-center mb-8">
                   <h3 className="font-bold text-gray-900 dark:text-white">{t.cardDetails}</h3>
                   <div className="flex gap-2">
                       <div className="w-10 h-6 bg-gray-200 dark:bg-slate-700 rounded flex items-center justify-center text-[10px] font-bold text-gray-500">VISA</div>
                       <div className="w-10 h-6 bg-gray-200 dark:bg-slate-700 rounded flex items-center justify-center text-[10px] font-bold text-gray-500">MC</div>
                   </div>
               </div>

               <form onSubmit={handlePay} className="space-y-6">
                   <div>
                       <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.cardNumber}</label>
                       <div className="relative">
                           <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <input 
                               type="text" 
                               value={cardNumber}
                               onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                               placeholder="0000 0000 0000 0000"
                               className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-navy dark:focus:ring-brand-lime transition-all font-mono text-lg"
                               required
                           />
                       </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                       <div>
                           <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.expiry}</label>
                           <input 
                               type="text" 
                               value={expiry}
                               onChange={(e) => setExpiry(e.target.value)}
                               placeholder="MM / YY"
                               className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-navy dark:focus:ring-brand-lime transition-all text-center"
                               required
                           />
                       </div>
                       <div>
                           <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.cvc}</label>
                           <div className="relative">
                               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                               <input 
                                   type="text" 
                                   value={cvc}
                                   onChange={(e) => setCvc(e.target.value)}
                                   placeholder="123"
                                   maxLength={4}
                                   className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-navy dark:focus:ring-brand-lime transition-all"
                                   required
                               />
                           </div>
                       </div>
                   </div>

                   <div>
                       <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.nameOnCard}</label>
                       <input 
                           type="text" 
                           placeholder="John Doe"
                           className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-navy dark:focus:ring-brand-lime transition-all uppercase"
                           required
                       />
                   </div>

                   <button 
                       type="submit"
                       disabled={isProcessing}
                       className="w-full bg-brand-navy text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-navy/20 hover:bg-brand-navy/90 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mt-8"
                   >
                       {isProcessing ? (
                           <>
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             {t.processing}
                           </>
                       ) : (
                           <>
                             {t.payNow} <span className="opacity-80">${total.toFixed(2)}</span>
                           </>
                       )}
                   </button>
               </form>
           </div>
       </div>
    </div>
  );
};

export default PaymentGate;

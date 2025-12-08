
import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Check, 
  ChevronRight, 
  Upload, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  User, 
  MapPin, 
  Lock,
  ArrowLeft,
  ArrowRight,
  X
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface VendorOnboardingProps {
  language: Language;
  onComplete: () => void;
}

const VendorOnboarding: React.FC<VendorOnboardingProps> = ({ language, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    password: '',
    businessType: 'individual',
    country: 'YE', // Default to Yemen
    phone: '',
    idFront: null as string | null,
    idBack: null as string | null,
    bankAccount: '',
    agreed: false
  });

  const t = translations[language].vendor;
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const simulateUpload = (field: 'idFront' | 'idBack') => {
    // Simulate a file upload delay
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        [field]: 'https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?auto=format&fit=crop&w=300&q=80' // Mock ID image
      }));
    }, 1000);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-2">
       {Array.from({ length: totalSteps }).map((_, idx) => (
         <div key={idx} className="flex items-center flex-1 last:flex-none">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step > idx + 1 
                  ? 'bg-green-500 text-white' 
                  : step === idx + 1 
                    ? 'bg-brand-navy text-white scale-110 shadow-lg' 
                    : 'bg-gray-200 text-gray-400'
              }`}
            >
               {step > idx + 1 ? <Check className="w-4 h-4" /> : idx + 1}
            </div>
            {idx < totalSteps - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-300 ${step > idx + 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            )}
         </div>
       ))}
    </div>
  );

  const renderLanding = () => (
    <div className="text-center py-12 animate-fade-in">
        <div className="w-20 h-20 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-brand-navy" />
        </div>
        <h2 className="text-3xl font-black text-brand-navy dark:text-white mb-4">{t.startSelling}</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
            {t.joinThousands}
        </p>
        <ul className="text-start max-w-xs mx-auto space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Check className="w-5 h-5 text-green-500" /> {t.dedicatedStore}
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Check className="w-5 h-5 text-green-500" /> {t.aiAssistant}
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Check className="w-5 h-5 text-green-500" /> {t.instantPayouts}
            </li>
        </ul>
        <button 
            onClick={handleNext}
            className="w-full max-w-xs bg-brand-navy text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-brand-navy/90 transition-all flex items-center justify-center gap-2"
        >
            {t.createAccount} <ArrowIcon className="w-4 h-4" />
        </button>
    </div>
  );

  const renderAccountInfo = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.accountDetails}</h3>
              <p className="text-sm text-gray-500">{t.secureAccess}</p>
          </div>
          
          <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.email}</label>
              <div className="relative">
                  <span className={`absolute top-3 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`}><FileText className="w-5 h-5" /></span>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-brand-navy ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                    placeholder="merchant@example.com"
                  />
              </div>
          </div>

          <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.password}</label>
              <div className="relative">
                  <span className={`absolute top-3 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`}><Lock className="w-5 h-5" /></span>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-brand-navy ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                    placeholder="••••••••"
                  />
              </div>
              {/* Strength Meter Mock */}
              <div className="flex gap-1 mt-2 h-1">
                  <div className={`flex-1 rounded-full ${formData.password.length > 0 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                  <div className={`flex-1 rounded-full ${formData.password.length > 4 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                  <div className={`flex-1 rounded-full ${formData.password.length > 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              </div>
          </div>

           <button 
            onClick={handleNext}
            disabled={!formData.email || !formData.password}
            className="w-full bg-brand-navy text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-brand-navy/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
           >
            {t.continue}
          </button>
      </div>
  );

  const renderBusinessInfo = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.businessProfile}</h3>
              <p className="text-sm text-gray-500">{t.tellUs}</p>
          </div>

          <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.storeName}</label>
              <div className="relative">
                  <span className={`absolute top-3 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`}><User className="w-5 h-5" /></span>
                  <input 
                    type="text" 
                    value={formData.storeName}
                    onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                    className={`w-full py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-brand-navy ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                    placeholder="My Awesome Store"
                  />
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.country}</label>
                  <div className="relative">
                      <span className={`absolute top-3 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`}><MapPin className="w-5 h-5" /></span>
                      <select 
                        className={`w-full py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-brand-navy appearance-none ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                      >
                          <option value="YE">Yemen</option>
                          <option value="US">USA</option>
                          <option value="AE">UAE</option>
                          <option value="SA">KSA</option>
                          <option value="UK">UK</option>
                      </select>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.businessType}</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-brand-navy"
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                  >
                      <option value="individual">Individual</option>
                      <option value="llc">LLC / Company</option>
                  </select>
               </div>
          </div>

          <button 
            onClick={handleNext}
            disabled={!formData.storeName}
            className="w-full bg-brand-navy text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-brand-navy/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
           >
            {t.continue}
          </button>
      </div>
  );

  const renderKYC = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.verifyIdentity}</h3>
              <p className="text-sm text-gray-500">{t.kyc}</p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-navy dark:text-blue-400 mt-0.5" />
              <p className="text-xs text-gray-600 dark:text-gray-300">
                  {t.encrypted}
              </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
              {/* ID Front */}
              <div 
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    formData.idFront 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                    : 'border-gray-300 dark:border-slate-600 hover:border-brand-navy hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
                onClick={() => simulateUpload('idFront')}
              >
                  {formData.idFront ? (
                      <>
                        <Check className="w-8 h-8 text-green-600 mb-2" />
                        <span className="text-sm font-bold text-green-700">{t.uploaded}</span>
                      </>
                  ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.uploadFront}</span>
                        <span className="text-xs text-gray-400 mt-1">{t.tapToCapture}</span>
                      </>
                  )}
              </div>

               {/* ID Back */}
               <div 
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    formData.idBack 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                    : 'border-gray-300 dark:border-slate-600 hover:border-brand-navy hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
                onClick={() => simulateUpload('idBack')}
              >
                   {formData.idBack ? (
                      <>
                        <Check className="w-8 h-8 text-green-600 mb-2" />
                        <span className="text-sm font-bold text-green-700">{t.uploaded}</span>
                      </>
                  ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.uploadBack}</span>
                        <span className="text-xs text-gray-400 mt-1">{t.tapToCapture}</span>
                      </>
                  )}
              </div>
          </div>

          <button 
            onClick={handleNext}
            disabled={!formData.idFront || !formData.idBack}
            className="w-full bg-brand-navy text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-brand-navy/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
           >
            {t.verify}
          </button>
      </div>
  );

  const renderSuccess = () => (
      <div className="text-center py-12 animate-fade-in">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">{t.submitted}</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
              {t.received} <strong>{formData.storeName}</strong> {t.provisioning}
          </p>
          
          <button 
            onClick={onComplete}
            className="w-full max-w-xs bg-brand-navy text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-brand-navy/90 transition-all flex items-center justify-center gap-2 mx-auto"
          >
             {t.dashboard} <ArrowIcon className="w-4 h-4" />
          </button>
      </div>
  );

  return (
    <div className="min-h-screen bg-grid-pattern dark:bg-grid-pattern flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white dark:bg-brand-dark rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800 relative">
          
          {/* Top Bar (if not step 1 or 5) */}
          {step > 1 && step < 5 && (
            <div className="px-6 pt-6 flex items-center justify-between">
                <button onClick={handleBack} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <BackIcon className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.step} {step} {t.of} {totalSteps}</span>
                <div className="w-9"></div> {/* spacer */}
            </div>
          )}

          <div className="p-6 sm:p-8">
              {step > 1 && step < 5 && renderStepIndicator()}
              
              {step === 1 && renderLanding()}
              {step === 2 && renderAccountInfo()}
              {step === 3 && renderBusinessInfo()}
              {step === 4 && renderKYC()}
              {step === 5 && renderSuccess()}
          </div>
      </div>
    </div>
  );
};

export default VendorOnboarding;

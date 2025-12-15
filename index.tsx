import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

interface InitializationWrapperProps {
  children: React.ReactNode;
}

// Wrapper to ensure API Key is selected before loading the app
const InitializationWrapper: React.FC<InitializationWrapperProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      try {
        // 1. Prioritize environment variable if available
        if (process.env.API_KEY) {
            setHasKey(true);
            return;
        }

        // 2. Check AI Studio Environment
        // @ts-ignore
        if (window.aistudio && window.aistudio.hasSelectedApiKey) {
          // @ts-ignore
          const hasSelected = await window.aistudio.hasSelectedApiKey();
          setHasKey(hasSelected);
        } else {
          // 3. Fallback for local/dev environments where aistudio object might be missing
          setHasKey(true); 
        }
      } catch (e) {
        console.error("Failed to check API key status", e);
        // Fallback to true to avoid blocking the UI on error; API calls will fail gracefully if key is missing.
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    try {
      // @ts-ignore
      if (window.aistudio && window.aistudio.openSelectKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        // Assuming success as per instructions to mitigate race condition
        setHasKey(true);
      }
    } catch (e) {
      console.error("Failed to open select key dialog", e);
    }
  };

  if (hasKey === null) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-dark">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-lime"></div>
        </div>
    );
  }

  if (hasKey === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark text-white p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm">
            <div className="w-16 h-16 bg-brand-lime/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-lime"><path d="M12.4 2.8a2 2 0 0 0-2 0l-7 12.8a2 2 0 0 0 2 3.2h14a2 2 0 0 0 2-3.2l-7-12.8Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h1 className="text-2xl font-black mb-3 text-white tracking-tight">Action Required</h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
              To use ASCEND's AI features (Veo Video & Gemini 2.5), please select a valid Google Cloud API Key.
            </p>
            <button 
              onClick={handleSelectKey}
              className="w-full py-3.5 px-4 bg-brand-lime hover:bg-brand-lime/90 text-brand-navy font-bold rounded-xl transition-colors mb-4 flex items-center justify-center gap-2 shadow-lg"
            >
              Select API Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-white underline"
            >
              Billing Information
            </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <InitializationWrapper>
        <App />
      </InitializationWrapper>
    </HashRouter>
  </React.StrictMode>
);
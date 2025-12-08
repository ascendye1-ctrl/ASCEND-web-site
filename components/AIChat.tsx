
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, ChevronDown } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { sendMessageToAI } from '../services/geminiService';
import { translations } from '../utils/translations';

interface AIChatProps {
  language: Language;
}

const AIChat: React.FC<AIChatProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = translations[language].chat;

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: t.welcome,
          timestamp: new Date()
        }
      ]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Reset welcome message when language changes if it's the only message
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome') {
       setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: t.welcome,
          timestamp: new Date()
        }
      ]);
    }
  }, [language]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToAI(userMsg.text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'rotate-90 bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-white' : 'bg-brand-navy text-white hover:bg-brand-navy/90'
        }`}
        style={{ 
            [language === 'ar' ? 'left' : 'right']: '1.5rem', 
            // Hide the toggle button when chat is open on mobile to avoid clutter, using css class
        }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window Container */}
      {/* 
         Mobile: Fixed at bottom, full width, rounded top
         Desktop: Fixed bottom-24, w-96, rounded-2xl
      */}
      <div
        className={`fixed z-50 bg-white dark:bg-brand-dark shadow-2xl border border-gray-100 dark:border-slate-800 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-12 pointer-events-none'
          }
          /* Mobile Styles */
          inset-x-0 bottom-0 h-[85vh] rounded-t-[2rem]
          /* Desktop Styles */
          sm:inset-auto sm:bottom-24 sm:w-96 sm:h-auto sm:rounded-2xl sm:origin-bottom-right
        `}
        style={{ 
            // On desktop, position it left or right based on language
            ...(window.innerWidth >= 640 ? {
                [language === 'ar' ? 'left' : 'right']: '1.5rem',
                [language === 'ar' ? 'right' : 'left']: 'auto'
            } : {}) 
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-brand-navy to-brand-navy/90 rounded-t-[2rem] sm:rounded-t-2xl flex items-center justify-between cursor-pointer" onClick={() => window.innerWidth < 640 && toggleChat()}>
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-brand-lime" />
            <div className="flex flex-col">
                <h3 className="font-semibold text-sm sm:text-base leading-tight">{t.title}</h3>
                <p className="text-[10px] text-gray-300 opacity-80">{t.poweredBy}</p>
            </div>
          </div>
          <button onClick={toggleChat} className="text-white/80 hover:text-white sm:hidden">
              <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-[calc(85vh-140px)] sm:h-96 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-950/50 scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand-navy text-white rounded-be-none'
                    : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 shadow-sm rounded-bs-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl rounded-bs-none px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-brand-lime rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-brand-lime rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-brand-lime rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-brand-dark sm:rounded-b-2xl pb-8 sm:pb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              className="flex-1 bg-gray-100 dark:bg-slate-800 border-0 rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-brand-navy focus:bg-white dark:focus:bg-slate-800 dark:text-white transition-all outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-brand-navy text-white rounded-full hover:bg-brand-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-brand-navy/20"
            >
              <Send className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden transition-opacity duration-300"
            onClick={toggleChat}
        />
      )}
    </>
  );
};

export default AIChat;

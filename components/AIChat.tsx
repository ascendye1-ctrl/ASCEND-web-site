import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, ChevronDown, Mic, MicOff, MapPin, Search as SearchIcon, ExternalLink } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { sendMessageToAI, getGenAIInstance } from '../services/geminiService';
import { translations } from '../utils/translations';
import { LiveClient, LiveServerMessage, Modality } from '@google/genai';

interface AIChatProps {
  language: Language;
}

// --- Audio Helper Functions for Live API ---
function base64ToFloat32Array(base64: string): Float32Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
    }
    return float32;
}

function float32ToPCM16(float32: Float32Array): Uint8Array {
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
        const s = Math.max(-1, Math.min(1, float32[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return new Uint8Array(int16.buffer);
}

function arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(buffer[i]);
    }
    return btoa(binary);
}

const AIChat: React.FC<AIChatProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<(ChatMessage & { grounding?: any })[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice Mode State
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Live API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

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

  // Initial Welcome
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


  // --- Text Chat Handler ---
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
      const response = await sendMessageToAI(userMsg.text);
      const aiMsg: ChatMessage & { grounding?: any } = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        grounding: response.groundingMetadata
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };


  // --- Voice Chat Handlers (Live API) ---

  const startVoiceMode = async () => {
      try {
          setIsVoiceMode(true);
          const ai = getGenAIInstance();
          
          // Initialize Audio Contexts
          const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          
          inputContextRef.current = inputCtx;
          audioContextRef.current = outputCtx;
          nextStartTimeRef.current = outputCtx.currentTime;

          // Connect to Gemini Live
          const sessionPromise = ai.live.connect({
              model: 'gemini-2.5-flash-native-audio-preview-09-2025',
              config: {
                  responseModalities: [Modality.AUDIO],
                  speechConfig: {
                      voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
                  }
              },
              callbacks: {
                  onopen: async () => {
                      setIsVoiceConnected(true);
                      // Setup Microphone Stream
                      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                      const source = inputCtx.createMediaStreamSource(stream);
                      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                      
                      processor.onaudioprocess = (e) => {
                          const inputData = e.inputBuffer.getChannelData(0);
                          // Calculate volume for UI visualization
                          let sum = 0;
                          for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                          setVolumeLevel(Math.sqrt(sum / inputData.length));

                          const pcmData = float32ToPCM16(inputData);
                          const base64Data = arrayBufferToBase64(pcmData);
                          
                          sessionPromise.then(session => {
                              session.sendRealtimeInput({
                                  media: {
                                      mimeType: 'audio/pcm;rate=16000',
                                      data: base64Data
                                  }
                              });
                          });
                      };

                      source.connect(processor);
                      processor.connect(inputCtx.destination);
                  },
                  onmessage: (msg: LiveServerMessage) => {
                      const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                      if (base64Audio && audioContextRef.current) {
                           const ctx = audioContextRef.current;
                           const float32 = base64ToFloat32Array(base64Audio);
                           const buffer = ctx.createBuffer(1, float32.length, 24000);
                           buffer.getChannelData(0).set(float32);
                           
                           const source = ctx.createBufferSource();
                           source.buffer = buffer;
                           source.connect(ctx.destination);
                           
                           // Schedule playback
                           const startTime = Math.max(nextStartTimeRef.current, ctx.currentTime);
                           source.start(startTime);
                           nextStartTimeRef.current = startTime + buffer.duration;
                      }
                  },
                  onclose: () => {
                      setIsVoiceConnected(false);
                  },
                  onerror: (err) => {
                      console.error("Live API Error", err);
                      setIsVoiceConnected(false);
                  }
              }
          });
          sessionPromiseRef.current = sessionPromise;

      } catch (e) {
          console.error("Failed to start voice mode", e);
          setIsVoiceMode(false);
      }
  };

  const stopVoiceMode = () => {
      setIsVoiceMode(false);
      setIsVoiceConnected(false);
      setVolumeLevel(0);
      
      inputContextRef.current?.close();
      audioContextRef.current?.close();
      
      // Close session
      if (sessionPromiseRef.current) {
          sessionPromiseRef.current.then(session => session.close());
      }
  };

  const renderGrounding = (grounding: any) => {
      if (!grounding || !grounding.groundingChunks) return null;
      
      return (
          <div className="mt-2 flex flex-wrap gap-2">
              {grounding.groundingChunks.map((chunk: any, idx: number) => {
                  if (chunk.web) {
                      return (
                          <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded border border-blue-100 dark:border-blue-800 hover:underline">
                              <SearchIcon className="w-3 h-3" /> {chunk.web.title} <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                      );
                  }
                  if (chunk.maps) {
                      return (
                          <a key={idx} href={chunk.maps.uri || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-2 py-1 rounded border border-green-100 dark:border-green-800 hover:underline">
                              <MapPin className="w-3 h-3" /> {chunk.maps.title} <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                      );
                  }
                  return null;
              })}
          </div>
      );
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center ${
            isOpen ? 'bg-white text-gray-800 rotate-90' : 'bg-brand-navy dark:bg-brand-lime text-white dark:text-brand-navy'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 animate-pulse" />}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-brand-dark rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 transform transition-all duration-300 origin-bottom-right z-40 overflow-hidden flex flex-col ${
          isOpen ? 'scale-100 opacity-100 translate-y-0 h-[600px] max-h-[80vh]' : 'scale-90 opacity-0 translate-y-10 pointer-events-none h-0'
      }`}>
          {/* Header */}
          <div className="bg-brand-navy dark:bg-slate-900 p-4 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                     <Sparkles className="w-5 h-5 text-brand-lime" />
                 </div>
                 <div>
                     <h3 className="font-bold text-white text-sm">{t.title}</h3>
                     <p className="text-[10px] text-white/60">{t.poweredBy}</p>
                 </div>
             </div>
             <div className="flex gap-2">
                 <button 
                    onClick={() => isVoiceMode ? stopVoiceMode() : startVoiceMode()}
                    className={`p-2 rounded-full transition-colors ${
                        isVoiceMode ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title="Voice Mode (Live API)"
                 >
                     {isVoiceMode ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                 </button>
                 <button onClick={toggleChat} className="p-2 text-white/60 hover:text-white">
                     <ChevronDown className="w-5 h-5" />
                 </button>
             </div>
          </div>

          {/* Voice Mode Visualizer */}
          {isVoiceMode && (
              <div className="absolute inset-0 z-50 bg-brand-navy/95 dark:bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-100 mb-8 ${isVoiceConnected ? 'bg-brand-lime/20' : 'bg-gray-800'}`}
                       style={{ transform: `scale(${1 + volumeLevel * 2})` }}>
                      <div className="w-24 h-24 rounded-full bg-brand-lime shadow-[0_0_40px_rgba(190,242,100,0.6)] flex items-center justify-center">
                          <Mic className="w-10 h-10 text-brand-navy" />
                      </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">
                      {isVoiceConnected ? "Listening..." : "Connecting..."}
                  </h3>
                  <p className="text-white/60 mb-8">Speak naturally. I'm listening.</p>
                  <button 
                    onClick={stopVoiceMode}
                    className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold shadow-lg"
                  >
                      End Conversation
                  </button>
              </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950/50">
              {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'model' && (
                          <div className="w-8 h-8 rounded-full bg-brand-navy dark:bg-brand-lime flex items-center justify-center shrink-0 mr-2 mt-2">
                              <Sparkles className="w-4 h-4 text-white dark:text-brand-navy" />
                          </div>
                      )}
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          msg.role === 'user' 
                          ? 'bg-brand-navy text-white rounded-tr-sm' 
                          : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-slate-700'
                      }`}>
                          {msg.text}
                          {msg.grounding && renderGrounding(msg.grounding)}
                      </div>
                  </div>
              ))}
              {isLoading && (
                  <div className="flex justify-start">
                       <div className="w-8 h-8 rounded-full bg-brand-navy dark:bg-brand-lime flex items-center justify-center shrink-0 mr-2">
                              <Sparkles className="w-4 h-4 text-white dark:text-brand-navy" />
                       </div>
                       <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-slate-700">
                           <div className="flex gap-1">
                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                           </div>
                       </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-brand-dark border-t border-gray-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-full px-4 py-2 border border-transparent focus-within:border-brand-navy transition-colors">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t.placeholder}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500"
                    disabled={isLoading}
                  />
                  <button 
                    onClick={handleSend} 
                    disabled={!inputValue.trim() || isLoading}
                    className="p-2 bg-brand-navy dark:bg-brand-lime rounded-full text-white dark:text-brand-navy disabled:opacity-50 hover:scale-105 transition-transform"
                  >
                      <Send className="w-4 h-4" />
                  </button>
              </div>
          </div>
      </div>
    </>
  );
};

export default AIChat;
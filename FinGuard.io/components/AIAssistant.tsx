
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, MessageSquare, Send, Sparkles, Volume2, Loader2, Waves, Command, VolumeX } from 'lucide-react';
import { usePond, useTheme, useLanguage, useNavigation } from '../App';
import { getGeminiAnalysis, speakWithElevenLabs, speakWithFallback } from '../services/aiAssistantService';

const AIAssistant: React.FC = () => {
  const { pond } = usePond();
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const { navigate } = useNavigation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPremiumVoice, setIsPremiumVoice] = useState(true);
  const [query, setQuery] = useState('');
  const [transcript, setTranscript] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN'; 

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        handleSendMessage(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Recognition Error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSendMessage = async (textToUse?: string) => {
    const message = textToUse || query;
    if (!message.trim()) return;

    setQuery('');
    setTranscript(prev => [...prev, { role: 'user', text: message }]);
    setIsProcessing(true);

    // Stop current audio/speech immediately
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis.cancel();

    try {
      const aiResponse = await getGeminiAnalysis(message, pond, lang);
      setTranscript(prev => [...prev, { role: 'ai', text: aiResponse.text }]);
      
      // Voice Response Logic
      setIsSpeaking(true);
      const audio = await speakWithElevenLabs(aiResponse.text);
      
      if (audio) {
        setIsPremiumVoice(true);
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        await audio.play().catch(err => {
          console.warn("ElevenLabs Playback Failed, trying fallback.");
          triggerFallback(aiResponse.text);
        });
      } else {
        triggerFallback(aiResponse.text);
      }

      // Navigation Logic
      if (aiResponse.navigate) {
        setTimeout(() => navigate(aiResponse.navigate!), 1500);
      }

    } catch (err) {
      console.error("Chat Error:", err);
      setIsSpeaking(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFallback = async (text: string) => {
    setIsPremiumVoice(false);
    await speakWithFallback(text, lang);
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      
      setIsListening(true);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Start Recognition Failure:", e);
        setIsListening(false);
      }
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-6 z-[70] w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 active:scale-90 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform rounded-full"></div>
        <Sparkles size={24} className="relative z-10" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsOpen(false)} />
      
      <div className={`mt-auto w-full max-w-sm mx-auto rounded-[2.5rem] p-6 shadow-2xl relative animate-in slide-in-from-bottom-20 duration-500 border ${theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-500">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>FinGuard Expert</h3>
              {isSpeaking && (
                <div className="flex items-center space-x-1 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPremiumVoice ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <p className={`text-[10px] font-bold uppercase ${isPremiumVoice ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {isPremiumVoice ? 'Premium AI Voice' : 'Native TTS Mode'}
                  </p>
                </div>
              )}
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto mb-6 space-y-4 no-scrollbar flex flex-col">
          {transcript.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"></div>
                <Volume2 className="text-blue-500 relative z-10" size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Voice Control Active</p>
                <p className={`text-[10px] text-center font-medium italic ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>"What's my health score?" or "Open the market"</p>
              </div>
            </div>
          ) : (
            transcript.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm shadow-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : (theme === 'dark' ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100')
                }`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {isProcessing && (
            <div className="flex justify-start">
              <div className={`p-4 rounded-3xl rounded-tl-none flex items-center space-x-2 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <Loader2 size={16} className="animate-spin text-blue-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assistant Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {isSpeaking && (
          <div className="flex justify-center mb-6 h-10">
            <div className="flex items-center space-x-1.5 h-full">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div 
                  key={i} 
                  className={`w-1 rounded-full animate-wave ${isPremiumVoice ? 'bg-blue-500' : 'bg-amber-400'}`} 
                  style={{ 
                    height: `${Math.random() * 80 + 20}%`,
                    animationDelay: `${i * 0.1}s`
                  }} 
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleListening}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse shadow-red-500/30' 
                : (theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')
            }`}
          >
            <Mic size={24} />
          </button>
          <div className="flex-1 relative">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything..."
              className={`w-full py-4 px-6 rounded-2xl text-sm outline-none transition-all border ${
                theme === 'dark' ? 'bg-slate-800 border-white/5 text-white focus:border-blue-500/50' : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-blue-500/50'
              }`}
            />
            <button 
              onClick={() => handleSendMessage()}
              disabled={isProcessing || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.8); }
        }
        .animate-wave {
          animation: wave 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;


import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, ChevronRight, Play, Volume2, ShieldCheck, Waves } from 'lucide-react';
import { useTheme, useLanguage } from '../App';
import { speakWithElevenLabs, speakWithFallback } from '../services/aiAssistantService';

interface TutorialOverlayProps {
  onComplete: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const [step, setStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const steps = [
    {
      title: "Welcome to FinGuard",
      desc: "I'm your AI farm assistant. I'll help you manage your aquaculture business with precision.",
      voice: "Welcome to Fin Guard. I am your AI farm assistant. I will help you manage your aquaculture business with precision and care. Let's explore your new digital farm."
    },
    {
      title: "Real-time Monitoring",
      desc: "Track pH, Oxygen, and Temperature live. If anything goes wrong, I'll alert you instantly.",
      voice: "Your dashboard shows real-time metrics for your pond. I monitor pH, oxygen, and temperature around the clock. If conditions become critical, I will notify you immediately."
    },
    {
      title: "Voice Commands",
      desc: "You can navigate the whole app using just your voice. Just say 'Go to Market' or 'Scan Fish'.",
      voice: "Did you know you can talk to me? Simply tap the sparkle button and tell me where to go. You can say: 'Go to the market' or 'Analyze a fish disease'. Try it out anytime."
    },
    {
      title: "Ready to Start?",
      desc: "Your farm is live and ready for production. Let's get growing!",
      voice: "You are all set. Your farm is live and synchronized. Tap the button below to start your farming journey. Good luck!"
    }
  ];

  useEffect(() => {
    playStepVoice(0);
    return () => {
      audioRef.current?.pause();
      window.speechSynthesis.cancel();
    };
  }, []);

  const playStepVoice = async (index: number) => {
    if (audioRef.current) audioRef.current.pause();
    window.speechSynthesis.cancel();
    
    setIsSpeaking(true);
    const audio = await speakWithElevenLabs(steps[index].voice);
    
    if (audio) {
      audioRef.current = audio;
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } else {
      // Fallback if ElevenLabs fails
      await speakWithFallback(steps[index].voice, lang);
      setIsSpeaking(false);
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      const next = step + 1;
      setStep(next);
      playStepVoice(next);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className={`w-full max-w-sm rounded-[3rem] p-8 shadow-2xl relative border ${theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}>
        <button 
          onClick={onComplete}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-blue-500/20 rounded-[2.5rem] animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {step === 0 && <Waves size={48} className="text-blue-500" />}
                {step === 1 && <ShieldCheck size={48} className="text-blue-500" />}
                {step === 2 && <Volume2 size={48} className="text-blue-500" />}
                {step === 3 && <Sparkles size={48} className="text-blue-500" />}
              </div>
              {isSpeaking && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-1 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {steps[step].title}
              </h2>
              <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {steps[step].desc}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`} />
            ))}
          </div>

          <button 
            onClick={nextStep}
            className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            <span>{step === steps.length - 1 ? "Start Farming" : "Continue"}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;

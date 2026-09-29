
import React, { useEffect, useState } from 'react';
import { Waves, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [startExit, setStartExit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartExit(true);
      setTimeout(onComplete, 800); // Wait for exit animation
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-[#0066CC] flex flex-col items-center justify-center z-[200] transition-all duration-700 ${startExit ? 'opacity-0 scale-110' : 'opacity-100'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative">
        <div className="animate-float">
          <div className="w-32 h-32 bg-white/10 backdrop-blur-xl rounded-[3.5rem] flex items-center justify-center border border-white/20 shadow-[0_32px_64px_rgba(0,0,0,0.2)]">
            <Waves size={64} className="text-white drop-shadow-lg" />
          </div>
        </div>
        <Sparkles className="absolute -top-4 -right-4 text-emerald-300 animate-pulse" size={24} />
      </div>

      <div className="mt-12 text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-6xl font-black tracking-tighter text-white">
          FINN<span className="opacity-70">GUARD</span>
        </h1>
        <div className="h-1 w-24 bg-white/20 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-white w-1/2 animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>
        <p className="text-white/60 text-xs font-black uppercase tracking-[0.4em] mt-4">
          Aquaculture Intelligence
        </p>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;

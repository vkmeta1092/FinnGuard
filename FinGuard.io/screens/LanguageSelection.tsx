
import React from 'react';
import { Globe, Languages, ChevronRight } from 'lucide-react';
import { Language } from '../types';

interface LanguageSelectionProps {
  onSelect: (lang: Language) => void;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onSelect }) => {
  const mainOptions = [
    { id: Language.ENGLISH, label: 'English', sub: 'Standard business English', icon: <Globe className="text-blue-500" /> },
    { id: Language.HINDI, label: 'Hindi (हिन्दी)', sub: 'National language', icon: <Languages className="text-orange-500" /> }
  ];

  const localLanguages = [
    { id: Language.BENGALI, label: 'Bengali (বাংলা)', sub: 'West Bengal / East Midnapore' },
    { id: Language.MARATHI, label: 'Marathi (मराठी)', sub: 'Maharashtra' },
    { id: Language.TELUGU, label: 'Telugu (తెలుగు)', sub: 'Andhra Pradesh / Telangana' },
    { id: Language.TAMIL, label: 'Tamil (தமிழ்)', sub: 'Tamil Nadu' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-8 justify-center items-center">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-200 mb-6">
            <Languages size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Select Language</h1>
          <p className="text-slate-400 font-medium">Choose your preferred language for farming</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Main Languages</p>
            {mainOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                className="w-full p-5 rounded-[2rem] bg-white border-2 border-slate-100 hover:border-blue-500 transition-all flex items-center space-x-4 shadow-sm group active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  {/* Fixed: Cast to React.ReactElement<any> to avoid prop typing error with 'size' */}
                  {React.cloneElement(opt.icon as React.ReactElement<any>, { size: 24 })}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-black text-slate-800 text-base leading-tight">{opt.label}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{opt.sub}</p>
                </div>
                <ChevronRight className="text-slate-300" size={18} />
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Local Languages</p>
            <div className="grid grid-cols-1 gap-2">
              {localLanguages.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSelect(opt.id)}
                  className="w-full p-5 rounded-[2rem] bg-white border border-slate-100 hover:border-emerald-500 transition-all flex items-center justify-between group active:scale-[0.98] shadow-sm"
                >
                  <div className="text-left">
                    <h3 className="font-black text-slate-700 text-sm leading-tight">{opt.label}</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{opt.sub}</p>
                  </div>
                  <ChevronRight className="text-slate-300" size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;

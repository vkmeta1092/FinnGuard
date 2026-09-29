
import React, { useState } from 'react';
import { User, Shield, Check, ChevronRight, LogOut, Settings, HelpCircle, Globe, Bell, X, Moon, Sun, Waves, Fish, MapPin, Layout } from 'lucide-react';
import { useLanguage, useTheme, useUser } from '../App';
import { Language } from '../types';

const Profile: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const getLangName = (code: Language) => {
    switch (code) {
      case Language.ENGLISH: return 'English';
      case Language.HINDI: return 'Hindi (हिन्दी)';
      case Language.BENGALI: return 'Bengali (বাংলা)';
      case Language.MARATHI: return 'Marathi (मరాఠీ)';
      case Language.TELUGU: return 'Telugu (తెలుగు)';
      case Language.TAMIL: return 'Tamil (தமிழ்)';
      default: return 'English';
    }
  };

  const allLanguages = [
    { id: Language.ENGLISH, label: 'English', desc: 'Global Business' },
    { id: Language.HINDI, label: 'Hindi (हिन्दी)', desc: 'National Language' },
    { id: Language.BENGALI, label: 'Bengali (বাংলা)', desc: 'West Bengal' },
    { id: Language.MARATHI, label: 'Marathi (मराठी)', desc: 'Maharashtra' },
    { id: Language.TELUGU, label: 'Telugu (తెలుగు)', desc: 'AP / Telangana' },
    { id: Language.TAMIL, label: 'Tamil (தமிழ்)', desc: 'Tamil Nadu' }
  ];

  return (
    <div className={`pb-32 min-h-screen ${theme === 'dark' ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
      {/* Header with Dynamic User Info */}
      <div className={`p-8 pt-16 flex flex-col items-center space-y-4 border-b ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="relative">
          <div className="w-24 h-24 bg-[#0066CC] rounded-[2.5rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-200 dark:shadow-none">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'F'}
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full flex items-center justify-center">
            <Shield size={14} className="text-white" />
          </div>
        </div>
        <div className="text-center">
          <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{user?.name || 'FinnGuard Farmer'}</h2>
          <p className="text-sm text-slate-400 font-medium">{user?.location || 'India'}</p>
        </div>

        {/* Dynamic Farm Summary Chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-full border border-blue-100 dark:border-blue-500/20">
            <Layout size={12} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">{user?.pondSize || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100 dark:border-emerald-500/20">
            <Fish size={12} className="text-emerald-600" />
            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">{user?.primarySpecies || 'Fish'}</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20">
            <Waves size={12} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">{user?.cultureType || 'Grow-out'}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Settings List */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">{t('settings')}</h3>
          
          <div className={`rounded-[2rem] border overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
            
            {/* Theme Toggle Row */}
            <div className={`w-full p-6 flex items-center justify-between border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-50'}`}>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-slate-50 border-slate-100/50 text-slate-400'}`}>
                  {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
                </div>
                <div className="text-left">
                  <span className={`text-base font-bold block ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Dark Mode</span>
                  <span className={`text-xs font-medium ${theme === 'dark' ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {theme === 'dark' ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Language Selection Row */}
            <button 
              onClick={() => setShowLanguagePicker(true)}
              className={`w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800 transition-colors border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-50'}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-blue-400' : 'bg-slate-50 border-slate-100/50 text-slate-400'}`}>
                  <Globe size={22} strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <span className={`text-base font-bold block ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{t('language')}</span>
                  <span className="text-xs font-medium text-blue-500">{getLangName(lang)}</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
            </button>

            {[
              { icon: <Bell size={20} />, label: 'Notification Preferences', color: 'text-orange-500', bg: theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50' },
              { icon: <Settings size={20} />, label: 'Hardware Configuration', color: theme === 'dark' ? 'text-slate-400' : 'text-slate-500', bg: theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50' },
              { icon: <HelpCircle size={20} />, label: 'Support & Help Center', color: 'text-emerald-500', bg: theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50' },
            ].map((item, i) => (
              <button key={i} className={`w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800 transition-colors border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-50'} last:border-0`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <span className={`text-base font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => { if(window.confirm("Sign out from farm?")) window.location.reload(); }}
          className={`w-full p-6 flex items-center justify-center space-x-2 font-bold text-sm rounded-[2rem] active:scale-95 transition-all border ${theme === 'dark' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-500 border-red-100/50'}`}
        >
          <LogOut size={18} />
          <span>{t('sign_out')}</span>
        </button>
      </div>

      {/* Language Picker Bottom Sheet */}
      {showLanguagePicker && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowLanguagePicker(false)}></div>
          <div className={`w-full max-w-sm rounded-[3rem] p-8 shadow-2xl relative animate-in slide-in-from-bottom-20 duration-500 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t('language')}</h3>
              <button onClick={() => setShowLanguagePicker(false)} className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
              {allLanguages.map((l) => (
                <button 
                  key={l.id}
                  onClick={() => { setLang(l.id); setShowLanguagePicker(false); }}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                    lang === l.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' 
                      : (theme === 'dark' ? 'border-slate-800 bg-slate-800/50' : 'border-slate-50 bg-slate-50/50')
                  }`}
                >
                  <div className="text-left">
                    <p className={`font-black text-sm ${lang === l.id ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-900') : (theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}`}>{l.label}</p>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{l.desc}</p>
                  </div>
                  {lang === l.id && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;


import React from 'react';
import { Screen } from '../types';
import { NAV_ITEMS } from '../constants';
import { useLanguage } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onScreenChange }) => {
  const { t } = useLanguage();

  const getLocalizedLabel = (id: Screen) => {
    switch (id) {
      case Screen.DASHBOARD: return t('home');
      case Screen.MARKETPLACE: return t('market');
      case Screen.DISEASE: return t('detect');
      case Screen.COLD_STORAGE: return t('storage');
      case Screen.SCHEMES: return t('schemes');
      case Screen.PROFILE: return t('profile');
      default: return "";
    }
  };

  return (
    <div className="fixed bottom-6 left-5 right-5 z-[60]">
      <nav className="bg-slate-900/95 backdrop-blur-lg border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2rem] px-4 py-2">
        <div className="flex justify-around items-center h-16">
          {NAV_ITEMS.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-1 w-8 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_#3B82F6]"></div>
                )}
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-1' : ''}`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { 
                    size: 22, 
                    strokeWidth: isActive ? 2.5 : 2 
                  })}
                </div>
                <span className={`text-[9px] mt-1.5 font-black uppercase tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                  {getLocalizedLabel(item.id)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;


import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Snowflake, ShieldCheck, Phone, Star, Zap, Clock, Box, Loader2 } from 'lucide-react';
import { MOCK_COLD_STORAGE } from '../constants';
import { useTheme } from '../App';
import { getHighAccuracyLocation } from '../services/locationService';
import { fetchWeatherByCoords } from '../services/weatherService';

const ColdStorageScreen: React.FC = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('ALL');
  const [currentHubName, setCurrentHubName] = useState('Detecting Location...');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    const detectHub = async () => {
      try {
        const coords = await getHighAccuracyLocation();
        const weather = await fetchWeatherByCoords(coords.lat, coords.lng);
        if (weather.locationName) {
          setCurrentHubName(weather.locationName);
        }
      } catch (err) {
        setCurrentHubName('Canning Town, West Bengal');
      } finally {
        setIsLoadingLocation(false);
      }
    };
    detectHub();
  }, []);

  return (
    <div className={`pb-32 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
      {/* Map Header */}
      <div className="h-80 w-full relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" 
          alt="Map" 
          className="w-full h-full object-cover grayscale opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Animated Map Markers */}
        <div className="absolute top-[40%] left-[30%] group">
          <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping"></div>
          <div className="relative bg-blue-600 p-2.5 rounded-full border-2 border-white shadow-2xl">
            <Snowflake size={18} className="text-white" />
          </div>
        </div>
        <div className="absolute top-[25%] right-[25%]">
          <div className="bg-indigo-600 p-2 rounded-full border-2 border-white shadow-2xl">
            <Snowflake size={14} className="text-white" />
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="absolute top-8 left-6 right-6 z-10">
          <div className={`rounded-[2rem] p-4 shadow-2xl flex items-center space-x-4 border backdrop-blur-xl ${
            theme === 'dark' ? 'bg-slate-900/80 border-white/10' : 'bg-white/90 border-slate-100'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLoadingLocation ? 'bg-blue-500/10 text-blue-500 animate-pulse' : 'bg-red-500/10 text-red-500'}`}>
              {isLoadingLocation ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={20} />}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Active Harvest Hub</p>
              <p className={`text-sm font-black tracking-tight truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {currentHubName}
              </p>
            </div>
            <button className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-500/30">
              <Navigation size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8 -mt-12 relative z-10">
        {/* Quick Filters */}
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
          {['ALL', 'NEAREST', 'CHEAPEST', 'TOP RATED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                filter === f 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20' 
                  : (theme === 'dark' ? 'bg-slate-900 border-white/5 text-slate-400' : 'bg-white border-slate-200 text-slate-500')
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Facilities List */}
        <div className="space-y-6">
          {MOCK_COLD_STORAGE.map((facility) => (
            <div 
              key={facility.id} 
              className={`rounded-[3rem] overflow-hidden border transition-all duration-500 group ${
                theme === 'dark' ? 'bg-slate-900 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'
              }`}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={facility.image} 
                  alt={facility.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute top-6 left-6 flex space-x-2">
                  <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-lg">
                    <Navigation size={12} className="text-blue-600" />
                    <span className="text-[11px] font-black text-slate-800 tracking-tight">{facility.distance}</span>
                  </div>
                  <div className="bg-emerald-500 text-white px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-lg">
                    <ShieldCheck size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                  </div>
                </div>
                <div className="absolute bottom-6 right-6 bg-slate-900/90 text-white px-5 py-3 rounded-3xl flex items-center space-x-2 backdrop-blur border border-white/10 shadow-2xl">
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Starting At</p>
                    <p className="text-xl font-black text-white leading-none">₹{facility.pricePerDay}<span className="text-xs opacity-40 font-bold">/MT</span></p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{facility.name}</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1.5">
                        <Star size={14} fill="#EAB308" className="text-amber-500" />
                        <span className="text-xs font-black text-slate-400">{facility.rating} Rating</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Box size={14} className="text-blue-500" />
                        <span className="text-xs font-black text-slate-400">{facility.capacity} Total</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <Zap size={14} />, label: '24/7 Power' },
                    { icon: <Clock size={14} />, label: 'Fast Load' },
                    { icon: <ShieldCheck size={14} />, label: 'GPS Track' },
                  ].map((amenity, i) => (
                    <div key={i} className={`p-3 rounded-2xl flex flex-col items-center space-y-1.5 border ${
                      theme === 'dark' ? 'bg-slate-800/50 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'
                    }`}>
                      {amenity.icon}
                      <span className="text-[9px] font-black uppercase tracking-widest">{amenity.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3 pt-2">
                  <button className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all active:scale-95 ${
                    theme === 'dark' ? 'bg-slate-800 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <Phone size={20} />
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-4 rounded-3xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all">
                    Book Space Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColdStorageScreen;

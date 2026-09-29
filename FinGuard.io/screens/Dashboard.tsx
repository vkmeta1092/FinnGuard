
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, Thermometer, Wind, AlertTriangle, ShieldCheck, 
  X, Activity, Send, Smartphone, Loader2, MapPin, Sparkles, Flame, Droplet, Landmark, ArrowRight, Warehouse, BarChart3, Plus, Droplets, Zap
} from 'lucide-react';
import { useLanguage, useTheme, usePond, useUser, useNavigation } from '../App';
import { Screen } from '../types';
import { notificationService } from '../services/notificationService';
import { getHighAccuracyLocation } from '../services/locationService';
import { fetchWeatherByCoords, WeatherData } from '../services/weatherService';
import { draftPondReportSMS } from '../services/smsService';
import CircularGauge from '../components/CircularGauge';
import { COLORS } from '../constants';
import { predictHealth } from "../services/predictService";
const THRESHOLDS = {
  temp: { min: 18, max: 32 },
  oxygen: { min: 4.0, max: 12 },
  ph: { min: 6.5, max: 8.8 },
  ammonia: { min: 0, max: 0.08 }
};

interface AlertLog {
  timestamp: string;
  parameter: string;
  value: number;
  type: 'CRITICAL' | 'WARNING';
}

const Dashboard: React.FC = () => {
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const { pond, setPond } = usePond();
  const { user } = useUser();
  const { navigate } = useNavigation();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [smsDraft, setSmsDraft] = useState('');
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [lastNotifiedTime, setLastNotifiedTime] = useState(0);

  const [alertHistory, setAlertHistory] = useState<AlertLog[]>([]);
  const [isAlertsHistoryOpen, setIsAlertsHistoryOpen] = useState(false);
  const [isFeedingActive, setIsFeedingActive] = useState(false);
  const [showFeedSuccess, setShowFeedSuccess] = useState(false);

  const breaches = useMemo(() => ({
    temp: pond.metrics.temp < THRESHOLDS.temp.min || pond.metrics.temp > THRESHOLDS.temp.max,
    oxygen: pond.metrics.oxygen < THRESHOLDS.oxygen.min,
    ph: pond.metrics.ph < THRESHOLDS.ph.min || pond.metrics.ph > THRESHOLDS.ph.max,
    ammonia: pond.metrics.ammonia > THRESHOLDS.ammonia.max
  }), [pond.metrics]);

  const hasAnyBreach = Object.values(breaches).some(b => b);

  useEffect(() => { handleSync(); }, []);

  useEffect(() => {
    if (hasAnyBreach) {
      Object.entries(breaches).forEach(([key, breached]) => {
        if (breached) {
          const paramName = key.charAt(0).toUpperCase() + key.slice(1);
          const val = (pond.metrics as any)[key];
          setAlertHistory(prev => {
            const lastAlert = prev[0];
            if (lastAlert && lastAlert.parameter === paramName && Math.abs(lastAlert.value - val) < 0.1) return prev;
            const newEntry: AlertLog = {
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              parameter: paramName, value: val, type: 'CRITICAL'
            };
            return [newEntry, ...prev].slice(0, 10);
          });
        }
      });

      if (!isAlarmActive) {
        setIsAlarmActive(true);
        const now = Date.now();
        if (now - lastNotifiedTime > 180000) { 
          handleEmergencyProtocol();
          setLastNotifiedTime(now);
        }
      }
    } else {
      setIsAlarmActive(false);
    }
  }, [hasAnyBreach, pond.metrics]);

  const handleEmergencyProtocol = async () => {
    const title = "CRITICAL POND BREACH";
    const body = `Alert: ${pond.name} parameters unsafe. Oxygen: ${pond.metrics.oxygen}mg/L. Check FinGuard App.`;
    
    await notificationService.notifyCrisis(title, body, {
      phone: user?.phone,
      email: user?.email || `${user?.name?.toLowerCase()?.replace(/\s+/g, '.')}@farm.ai`
    });
  };

  const handleSync = async () => {
    //onsole.log("BUTTON CLICKED");
      setIsSyncing(true);


  try {
    //nst loc = await getHighAccuracyLocation();
   //onst weatherData = await fetchWeatherByCoords(loc.lat, loc.lng);
   //etWeather(weatherData);

    // Backend prediction
    const result = await predictHealth({
      temperature: pond.metrics.temp,
      dissolved_oxygen: pond.metrics.oxygen,
      ph: pond.metrics.ph,
      turbidity: 5, // Temporary fixed value
    });

    setPond(prev => ({
  ...prev,
  healthScore: result.health_index,
  confidence: result.confidence,
}));

   //onsole.log("Prediction:", result);

  } catch (err) {
    console.error("Sync failed:", err);
  } finally {
    setIsSyncing(false);
  }
};

  const handleQuickFeed = () => {
    setIsFeedingActive(true);
    setTimeout(() => {
      setIsFeedingActive(false);
      setShowFeedSuccess(true);
      setPond(prev => ({ ...prev, healthScore: Math.min(100, prev.healthScore + 2) }));
      setTimeout(() => setShowFeedSuccess(false), 3000);
    }, 2000);
  };

  const handleOpenSmsModal = async () => {
    setIsSmsModalOpen(true);
    setIsDrafting(true);
    try {
      const draft = await draftPondReportSMS(pond.name, {
        temp: pond.metrics.temp.toString(),
        ph: pond.metrics.ph.toString(),
        oxygen: pond.metrics.oxygen.toString(),
        ammonia: pond.metrics.ammonia.toString()
      }, pond.healthScore, lang);
      setSmsDraft(draft);
    } catch { setSmsDraft("FinGuard: Pond health status updated."); }
    finally { setIsDrafting(false); }
  };

  const health = useMemo(() => {
    const score = pond.healthScore;
    if (hasAnyBreach) return { 
      label: 'BREACH DETECTED', icon: <Flame className="animate-pulse" size={24} />,
      gradient: 'from-rose-950 via-rose-600 to-rose-950',
      color: '#E11D48'
    };
    if (score < 40) return {
    label: "DANGER ZONE",
    icon: <AlertTriangle className="animate-bounce" size={24} />,
    gradient: "from-red-900 via-red-600 to-red-900",
    color: "#DC2626"
};

if (score < 80) return {
    label: "MODERATE",
    icon: <AlertTriangle size={24} />,
    gradient: "from-yellow-500 via-orange-400 to-yellow-500",
    color: "#F59E0B"
};

return {
    label: "EXCELLENT CONDITION",
    icon: <ShieldCheck size={24} />,
    gradient: "from-emerald-600 via-teal-500 to-emerald-600",
    color: "#10B981"
};
  }, [pond.healthScore, hasAnyBreach, t]);

  return (
    <div className={`pb-48 relative min-h-screen transition-all duration-700 ${theme === 'dark' ? 'bg-[#020617]' : 'bg-[#f0f4f8]'}`}>
      <div className={`fixed top-0 left-0 right-0 h-96 opacity-20 blur-[120px] pointer-events-none transition-all duration-1000 bg-gradient-to-b ${health.gradient}`}></div>

      {isAlarmActive && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-rose-600 text-white px-6 py-4 flex items-center justify-between shadow-2xl animate-in slide-in-from-top duration-500">
           <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl animate-pulse"><AlertTriangle size={20} /></div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-rose-200">Critical Failure</span>
                 <span className="text-sm font-black tracking-tight">System Alarm Active</span>
              </div>
           </div>
           <button onClick={() => setIsAlarmActive(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
             <X size={20} />
           </button>
        </div>
      )}

      <div className={`safe-area-top sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b transition-transform ${isAlarmActive ? 'translate-y-16' : ''}`}>
        <div className="flex justify-between items-center px-6 h-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Activity size={20} />
            </div>
            <div className="flex flex-col">
              <h1 className={`text-lg font-black tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>FinGuard</h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Smart Farming App</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleSync}
              className={`p-2.5 rounded-xl border transition-all ${theme === 'dark' ? 'bg-slate-800 border-white/5 text-slate-300' : 'bg-white border-slate-100 text-slate-600'}`}
            >
              {isSyncing ? <Loader2 size={18} className="animate-spin text-blue-500" /> : <MapPin size={18} />}
            </button>
            <button className={`p-2.5 rounded-xl border relative transition-all ${theme === 'dark' ? 'bg-slate-800 border-white/5 text-slate-300' : 'bg-white border-slate-100 text-slate-600'}`}>
              <Bell size={18} />
              {hasAnyBreach && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800"></span>}
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Weather & Location Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-slate-800 text-amber-400' : 'bg-white text-amber-500 shadow-sm'}`}>
              {weather?.condition?.toLowerCase()?.includes('cloud') ? <Droplets size={24} /> : <Sparkles size={24} />}
            </div>
            <div>
              <p className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {weather?.temp || 0}°C <span className="text-slate-400 font-medium ml-1">{weather?.condition || 'Syncing...'}</span>
              </p>
              <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                <MapPin size={10} className="mr-1" />
                <span>{weather?.location || 'Bengal, India'}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pond ID</p>
            <p className={`text-xs font-black ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{pond.id}</p>
          </div>
        </div>

        {/* Health Gauge Section */}
        <div className="flex flex-col items-center justify-center space-y-6 pt-4">
          <div className="relative group cursor-pointer" onClick={() => navigate(Screen.ANALYTICS)}>
             <CircularGauge 
              value={pond.healthScore} 
              size={240} 
              strokeWidth={18} 
              color={health.color}
              backgroundColor={theme === 'dark' ? '#1E293B' : '#E2E8F0'}
              label="Health Index"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-white/5 to-transparent blur-2xl"></div>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-2">
            <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-full border ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'}`}>
              <div className={`p-1.5 rounded-full ${hasAnyBreach ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                {health.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                {health.label}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">
  AI Confidence: {pond.confidence?.toFixed(1)}%
</p>
            </div>
            <p className="text-xs text-slate-400 font-medium max-w-[220px] leading-5">
    {pond.healthScore >= 80
  ? "AI Analysis: Temperature, oxygen and pH are within healthy limits."
  : pond.healthScore >= 40
  ? "AI Analysis: Pond is stable but requires monitoring."
  : "AI Analysis: Water quality is unsafe. Immediate action recommended."}
</p>
          </div>
        </div>

       <div className="mx-5 mt-2 rounded-2xl bg-slate-900 p-3 shadow-md">
  <h3 className="text-xs font-semibold mb-2">
    🤖 AI Recommendations
  </h3>

  {pond.healthScore >= 80 ? (
    <ul className="text-[10px] space-y-1 text-green-600">
      <li>✅ Continue current aeration.</li>
      <li>✅ Feeding can be increased by 5%.</li>
      <li>✅ Water quality is healthy.</li>
    </ul>
  ) : pond.healthScore >= 40 ? (
    <ul className="text-[10px] space-y-1 text-yellow-600">
      <li>⚠️ Monitor pH every 6 hours.</li>
      <li>⚠️ Increase aeration tonight.</li>
      <li>⚠️ Reduce feeding by 10%.</li>
    </ul>
  ) : (
    <ul className="text-[10px] space-y-1 text-red-600">
      <li>🚨 Emergency aeration required.</li>
      <li>🚨 Stop feeding immediately.</li>
      <li>🚨 Replace 30% pond water.</li>
    </ul>
  )}
</div>
        {/* Dynamic Parameter Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-5 rounded-[2.5rem] border transition-all ${theme === 'dark' ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-100 shadow-sm'} ${breaches.temp ? 'border-rose-500 shadow-lg shadow-rose-500/10' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-2xl ${breaches.temp ? 'bg-rose-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                <Thermometer size={18} />
              </div>
              {breaches.temp && <Flame size={14} className="text-rose-500 animate-pulse" />}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('temp')}</p>
            <h4 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{pond.metrics.temp}°C</h4>
          </div>

          <div className={`p-5 rounded-[2.5rem] border transition-all ${theme === 'dark' ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-100 shadow-sm'} ${breaches.ph ? 'border-rose-500 shadow-lg shadow-rose-500/10' : ''}`}>
             <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-2xl ${breaches.ph ? 'bg-rose-500 text-white' : 'bg-purple-100 text-purple-600'}`}>
                <Droplet size={18} />
              </div>
              {breaches.ph && <AlertTriangle size={14} className="text-rose-500 animate-pulse" />}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('ph')}</p>
            <h4 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{pond.metrics.ph}</h4>
          </div>

          <div className={`p-5 rounded-[2.5rem] border transition-all ${theme === 'dark' ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-100 shadow-sm'} ${breaches.oxygen ? 'border-rose-500 shadow-lg shadow-rose-500/10' : ''}`}>
             <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-2xl ${breaches.oxygen ? 'bg-rose-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                <Wind size={18} />
              </div>
              {breaches.oxygen && <Zap size={14} className="text-rose-500 animate-pulse" />}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('oxygen')}</p>
            <h4 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{pond.metrics.oxygen} <span className="text-[10px] font-bold text-slate-400">mg/L</span></h4>
          </div>

          <div className={`p-5 rounded-[2.5rem] border transition-all ${theme === 'dark' ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-100 shadow-sm'} ${breaches.ammonia ? 'border-rose-500 shadow-lg shadow-rose-500/10' : ''}`}>
             <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-2xl ${breaches.ammonia ? 'bg-rose-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                <Activity size={18} />
              </div>
              {breaches.ammonia && <Flame size={14} className="text-rose-500 animate-pulse" />}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('ammonia')}</p>
            <h4 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{pond.metrics.ammonia} <span className="text-[10px] font-bold text-slate-400">ppm</span></h4>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className={`text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-slate-500' : ''}`}>
            {t('quick_actions')}
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: t('add_feeding'), icon: <Plus size={20} />, action: handleQuickFeed },
              { label: t('water_test'), icon: <Droplets size={20} />, action: () => {} },
              { label: t('harvesting'), icon: <Plus size={20} />, action: () => {} },
              { label: t('analytics'), icon: <BarChart3 size={20} />, action: () => navigate(Screen.ANALYTICS) },
            ].map((btn, i) => (
              <button 
                key={i} 
                onClick={btn.action}
                className="flex flex-col items-center space-y-2 group active:scale-95 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white' : 'bg-white text-slate-600 shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white'}`}>
                  {btn.icon}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-tight text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {btn.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Emergency SMS Trigger Tooltip */}
        <div 
          onClick={handleOpenSmsModal}
          className="bg-indigo-600 rounded-[2.5rem] p-6 text-white flex items-center justify-between cursor-pointer group shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Smartphone size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest">Emergency Broadcast</h4>
              <p className="text-[10px] text-white/70 font-medium">Draft instant update for your retailers</p>
            </div>
          </div>
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* SMS Draft Modal */}
      {isSmsModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsSmsModalOpen(false)} />
          <div className={`w-full max-w-sm rounded-[3rem] p-8 space-y-6 relative border animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}>
             <div className="flex justify-between items-center">
                <h3 className={`text-lg font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>SMS Update</h3>
                <button onClick={() => setIsSmsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"><X size={20} /></button>
             </div>
             
             {isDrafting ? (
               <div className="flex flex-col items-center py-12 space-y-4">
                  <Loader2 className="animate-spin text-blue-500" size={32} />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Drafting Broadcast...</p>
               </div>
             ) : (
               <div className="space-y-6">
                 <div className={`p-5 rounded-3xl border text-sm font-medium leading-relaxed italic ${theme === 'dark' ? 'bg-slate-800 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                   "{smsDraft}"
                 </div>
                 <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                    <Send size={16} />
                    <span>Send to Retailers</span>
                 </button>
               </div>
             )}
          </div>
        </div>
      )}

      {/* Feed Success Toast */}
      {showFeedSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 duration-300 shadow-2xl">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl flex items-center space-x-3">
             <CheckCircle2 size={18} />
             <span className="text-[10px] font-black uppercase tracking-widest">Feeding Logged Successfully</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal components
const CheckCircle2 = ({ size, className }: { size?: number, className?: string }) => <ShieldCheck size={size} className={className} />;

export default Dashboard;

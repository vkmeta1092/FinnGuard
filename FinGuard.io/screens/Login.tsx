
import React, { useState } from 'react';
import { 
  CheckCircle2, Loader2, 
  MapPin, Phone, AlertCircle, 
  User, ArrowRight, ArrowLeft, Fish, Mail, Smartphone, Crosshair, Zap
} from 'lucide-react';
import { useUser } from '../App';
import { UserData } from '../types';
import { getHighAccuracyLocation } from '../services/locationService';
import { fetchWeatherByCoords } from '../services/weatherService';

interface LoginProps {
  onLogin: () => void;
}

type OnboardingStep = 'auth' | 'identity' | 'pond';
type AuthMethod = 'phone' | 'email';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { setUser } = useUser();
  
  const [step, setStep] = useState<OnboardingStep>('auth');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [pondSize, setPondSize] = useState('');
  const [primarySpecies, setPrimarySpecies] = useState('Carp');
  const [cultureType, setCultureType] = useState('Grow-out');

  const handleSendCode = () => {
    if (authMethod === 'phone' && phoneNumber.length < 10) return alert("Enter valid mobile number");
    if (authMethod === 'email' && !email.includes('@')) return alert("Enter valid email address");
    
    setIsLoading(true);
    // Simulate sending OTP or Email Verification Link
    setTimeout(() => {
      setIsLoading(false);
      setCodeSent(true);
      setError(null);
    }, 800);
  };

  const handleVerifyCode = () => {
    // In demo, any 6 digits work
    if (otp.length === 6) {
      setStep('identity');
    } else {
      setError("Please enter the 6-digit verification code.");
    }
  };

  const handleAutoDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const coords = await getHighAccuracyLocation();
      const weatherData = await fetchWeatherByCoords(coords.lat, coords.lng);
      if (weatherData.locationName) {
        setLocation(weatherData.locationName);
      }
    } catch (err) {
      alert("Please enable GPS permissions to auto-detect your farm location.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const finalizeOnboarding = () => {
    setIsLoading(true);
    const userData: UserData = {
      name,
      phone: phoneNumber ? `+91 ${phoneNumber}` : undefined,
      email: email || undefined,
      location,
      pondSize,
      primarySpecies,
      cultureType,
      type: 'standard'
    };
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setUser(userData);
        onLogin();
      }, 800);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

      <div className="w-full max-w-sm z-10 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">Smart <span className="text-[#0066CC]">Onboarding</span></h1>
          <p className="text-slate-400 text-sm font-medium">Step {step === 'auth' ? '1' : step === 'identity' ? '2' : '3'} of 3</p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-50 flex">
            <div className={`h-full bg-blue-600 transition-all duration-700 ${step === 'auth' ? 'w-1/3' : step === 'identity' ? 'w-2/3' : 'w-full'}`}></div>
          </div>

          {!isSuccess ? (
            <div className="animate-in fade-in duration-500 mt-2">
              
              {step === 'auth' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        {authMethod === 'phone' ? <Smartphone size={20} /> : <Mail size={20} />}
                      </div>
                      <h2 className="text-lg font-black text-slate-800 tracking-tight">Identity</h2>
                    </div>
                  </div>

                  {/* Auth Method Switcher */}
                  <div className="flex p-1 bg-slate-100 rounded-2xl">
                    <button 
                      onClick={() => { setAuthMethod('phone'); setCodeSent(false); setOtp(''); }}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMethod === 'phone' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      <Phone size={12} />
                      <span>Phone</span>
                    </button>
                    <button 
                      onClick={() => { setAuthMethod('email'); setCodeSent(false); setOtp(''); }}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMethod === 'email' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      <Mail size={12} />
                      <span>Email</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                        {authMethod === 'phone' ? 'Mobile Number' : 'Email Address'}
                      </label>
                      <div className="relative">
                        {authMethod === 'phone' ? (
                          <>
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+91</span>
                            <input 
                              type="tel" 
                              required 
                              value={phoneNumber} 
                              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                              placeholder="9876543210" 
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold" 
                            />
                          </>
                        ) : (
                          <input 
                            type="email" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="farmer@finguard.ai" 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold" 
                          />
                        )}
                      </div>
                    </div>
                    
                    {codeSent && (
                      <div className="space-y-1 animate-in slide-in-from-top-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Verification Code</label>
                        <input 
                          type="text" 
                          maxLength={6}
                          value={otp} 
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                          placeholder="••••••" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-xl tracking-[1em] font-black outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-center" 
                        />
                      </div>
                    )}

                    {error && (
                      <div className="p-3 bg-red-50 rounded-xl flex items-start space-x-2 border border-red-100">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={14} />
                        <p className="text-[10px] font-bold text-red-700 leading-tight">{error}</p>
                      </div>
                    )}

                    <button
                      onClick={codeSent ? handleVerifyCode : handleSendCode}
                      disabled={isLoading}
                      className="w-full bg-[#0066CC] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>
                          <span>{codeSent ? "Verify Identity" : "Continue"}</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    {!codeSent && (
                      <button
                        onClick={() => {
                          setName('Demo Farmer');
                          setLocation('West Bengal, India');
                          setPondSize('2.5 Acres');
                          finalizeOnboarding();
                        }}
                        className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center space-x-2 hover:bg-slate-200 transition-all"
                      >
                        <Zap size={14} className="text-amber-500 fill-amber-500" />
                        <span>Quick Demo Login</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {step === 'identity' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <User size={20} />
                    </div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Personal Details</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Farmer Name" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm outline-none font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Region / Village</label>
                        <button 
                          onClick={handleAutoDetectLocation}
                          disabled={isDetectingLocation}
                          className="flex items-center space-x-1 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                        >
                          {isDetectingLocation ? <Loader2 size={10} className="animate-spin" /> : <Crosshair size={10} />}
                          <span>{isDetectingLocation ? 'Locating...' : 'Use GPS'}</span>
                        </button>
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Detecting location..." 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm outline-none font-bold pr-12"
                        />
                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button onClick={() => setStep('auth')} className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center active:scale-95 transition-all">
                        <ArrowLeft size={20} />
                      </button>
                      <button 
                        onClick={() => name && location ? setStep('pond') : alert("Please fill your details")}
                        className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                      >
                        <span>Next Step</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 'pond' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                      <Fish size={20} />
                    </div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Farm Profile</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Pond Area</label>
                        <input 
                          type="text" 
                          value={pondSize}
                          onChange={(e) => setPondSize(e.target.value)}
                          placeholder="e.g. 2 Acres" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-[11px] outline-none font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Culture Type</label>
                        <select 
                          value={cultureType}
                          onChange={(e) => setCultureType(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-3 text-[11px] outline-none font-bold text-slate-700"
                        >
                          <option>Nursery</option>
                          <option>Grow-out</option>
                          <option>Hatchery</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Primary Fish Species</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Carp', 'Tilapia', 'Catfish', 'Shrimp'].map(fish => (
                          <button
                            key={fish}
                            onClick={() => setPrimarySpecies(fish)}
                            className={`py-3 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${
                              primarySpecies === fish 
                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                : 'border-slate-50 bg-slate-50 text-slate-400'
                            }`}
                          >
                            {fish}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button onClick={() => setStep('identity')} className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center active:scale-95 transition-all">
                        <ArrowLeft size={20} />
                      </button>
                      <button 
                        onClick={finalizeOnboarding}
                        className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                      >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                          <>
                            <span>Start Farming</span>
                            <CheckCircle2 size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner relative">
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping"></div>
                <CheckCircle2 size={48} className="animate-bounce relative z-10" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Profile Ready</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Syncing with FinGuard AI...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

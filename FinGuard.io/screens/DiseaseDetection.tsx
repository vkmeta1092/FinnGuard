
import React, { useState, useRef } from 'react';
import { Camera, Activity, Loader2, X, Sparkles, Upload, CheckCircle2, AlertCircle, ShieldPlus, ExternalLink, ShoppingBag, Heart } from 'lucide-react';
import { detectFishDisease, getTreatmentMedicines, SearchProductResult } from '../services/geminiService';
import { DiseaseAnalysis } from '../types';
import { useTheme } from '../App';

const DiseaseDetection: React.FC = () => {
  const { theme } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysis | null>(null);
  const [medicines, setMedicines] = useState<SearchProductResult[]>([]);
  const [isGettingMed, setIsGettingMed] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setResult(null);
        setMedicines([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const base64Data = image.split(',')[1];
      const analysis = await detectFishDisease(base64Data);
      setResult(analysis);
      
      if (
  analysis.diseaseId &&
  !analysis.diseaseId.toLowerCase().includes("healthy") &&
  analysis.confidence > 0.3
) {
  console.log("Medicine search skipped for testing");

      }
    } catch (err) {
    console.error("Disease Detection Error:", err);

    } finally {
      setLoading(false);
      setIsGettingMed(false);
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf > 0.8) return 'text-emerald-500 bg-emerald-500/10';
    if (conf > 0.5) return 'text-amber-500 bg-amber-500/10';
    return 'text-red-500 bg-red-500/10';
  };

  const isHealthy = result?.diseaseId?.toLowerCase()?.includes('healthy');

  return (
    <div className={`pb-32 min-h-screen flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
      <div className="p-6 pt-12 text-center space-y-2">
        <h2 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Fish AI Diagnostic
        </h2>
        <p className="text-slate-400 text-sm font-medium">Capture symptoms for instant pathology results</p>
      </div>

      <div className="flex-1 px-6 space-y-8 flex flex-col items-center">
        {/* Main Image Container */}
        <div className={`w-full max-w-sm aspect-square rounded-[3rem] shadow-2xl transition-all duration-500 relative overflow-hidden flex items-center justify-center border-2 border-dashed ${
          image 
            ? 'border-transparent' 
            : (theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200')
        }`}>
          {image ? (
            <div className="relative w-full h-full p-2">
              <img src={image} alt="Fish" className="w-full h-full object-cover rounded-[2.5rem]" />
              <button 
                onClick={() => { setImage(null); setResult(null); setMedicines([]); }}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur shadow-lg text-slate-800 p-2 rounded-full hover:bg-white active:scale-90 transition-all z-10"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-500 dark:text-blue-400">
                <Camera size={38} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Identify symptoms</h3>
                <p className="text-xs text-slate-400 font-medium px-4">Focus on scales, gills, or visible spots for best results</p>
              </div>
              
              <div className="flex flex-col w-full space-y-3">
                <button 
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Camera size={18} />
                  <span>Launch Camera</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${
                    theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Upload size={18} />
                  <span>Select from Gallery</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Hidden Inputs */}
          <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleImageUpload} />
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        </div>

        {image && !result && (
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={runAnalysis}
              disabled={loading}
              className={`w-full py-5 rounded-[2rem] font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center space-x-3 shadow-xl transition-all active:scale-95 ${
                loading ? 'bg-blue-400/70 text-white' : 'bg-blue-600 text-white hover:brightness-105 shadow-blue-500/20'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>AI Pathologist Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Run AI Diagnosis</span>
                </>
              )}
            </button>
            <p className="text-[9px] text-center text-slate-400 font-black uppercase tracking-[0.2em] animate-pulse">
              Powered by FinGuard AI Vision
            </p>
          </div>
        )}

        {/* Diagnostic Results */}
        {result && (
          <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className={`rounded-[3rem] p-8 shadow-2xl border-t-4 transition-colors duration-500 ${
              theme === 'dark' 
                ? 'bg-slate-900 border-white/5 ' + (isHealthy ? 'border-t-emerald-500' : 'border-t-rose-500')
                : 'bg-white border-slate-100 ' + (isHealthy ? 'border-t-emerald-500' : 'border-t-rose-500')
            }`}>
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostic Verdict</p>
                  <h3 className={`text-2xl font-black leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    {result.diseaseId}
                  </h3>
                </div>
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 ${getConfidenceColor(result.confidence)}`}>
                  {isHealthy ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  <span>{(result.confidence * 100).toFixed(0)}% Match</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className={`flex items-center space-x-2 ${isHealthy ? 'text-emerald-500' : 'text-blue-500'}`}>
                    {isHealthy ? <Heart size={18} fill="currentColor" /> : <Activity size={18} />}
                    <h4 className="text-[10px] font-black uppercase tracking-widest">
                      {isHealthy ? 'Health Summary' : 'Treatment Protocol'}
                    </h4>
                  </div>
                  <div className={`p-6 rounded-[2rem] border text-xs leading-relaxed transition-colors font-medium ${
                    theme === 'dark' 
                      ? (isHealthy ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-300') 
                      : (isHealthy ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-blue-50/30 border-blue-100/50 text-slate-600')
                  }`}>
                    {result.treatmentPlan}
                  </div>
                </div>

                {!isHealthy && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-2 text-indigo-500">
                          <ShoppingBag size={18} />
                          <h4 className="text-[10px] font-black uppercase tracking-widest">Available Medicines</h4>
                       </div>
                       {isGettingMed && <Loader2 size={12} className="animate-spin text-slate-400" />}
                    </div>
                    <div className="space-y-2">
                      {medicines.length > 0 ? medicines.map((med, i) => (
                        <a 
                          key={i} 
                          href={med.sourceUrl} 
                          target="_blank"
                          className={`p-4 rounded-2xl flex items-center justify-between border transition-all hover:scale-[1.02] ${
                            theme === 'dark' ? 'bg-slate-800/50 border-white/5' : 'bg-white border-slate-100 shadow-sm'
                          }`}
                        >
                           <div className="flex flex-col">
                              <span className={`text-[11px] font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{med.title}</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase truncate max-w-[180px]">{med.sourceTitle}</span>
                           </div>
                           <ExternalLink size={14} className="text-blue-500" />
                        </a>
                      )) : !isGettingMed && (
                        <p className="text-[10px] text-slate-400 italic px-2">Searching for treatment options in your area...</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`p-6 rounded-[2rem] flex items-center space-x-4 border ${
              theme === 'dark' ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-100 shadow-sm shadow-amber-500/5'
            }`}>
              <AlertCircle className="text-amber-500 shrink-0" size={24} />
              <p className="text-[10px] font-bold text-amber-900/70 leading-relaxed">
                <span className="font-black uppercase block mb-1">Medical Advisory:</span>
                AI diagnosis is for preliminary screening. For large outbreaks, contact your local fisheries department immediately.
              </p>
            </div>

            <button 
              onClick={() => { setImage(null); setResult(null); setMedicines([]); }}
              className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${
                theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
              }`}
            >
              Analyze New Specimen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetection;

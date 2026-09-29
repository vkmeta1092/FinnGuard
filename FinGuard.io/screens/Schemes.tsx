
import React, { useState } from 'react';
import { Landmark, HandCoins, GraduationCap, Building2, Search, ExternalLink, Sparkles, ChevronRight, CheckCircle2, Info, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTheme, useLanguage } from '../App';

const GOV_SCHEMES = [
  {
    id: 'pmmsy',
    title: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY)',
    category: 'SUBSIDY',
    icon: <Landmark />,
    benefit: '40% - 60% Financial Subsidy',
    eligibility: 'Small-scale Fishers, Fish Farmers, Self Help Groups',
    description: 'A flagship scheme to bring about Blue Revolution through sustainable and responsible development of fisheries sector.',
    link: 'https://pmmsy.dof.gov.in/'
  },
  {
    id: 'kcc',
    title: 'Kisan Credit Card (KCC) for Fisheries',
    category: 'LOAN',
    icon: <HandCoins />,
    benefit: 'Working Capital up to ₹2 Lakhs',
    eligibility: 'Fishers, Fish Farmers (Individual/Partners/Groups)',
    description: 'Provides adequate and timely credit support under a single window to the fish farmers for their working capital requirements.',
    link: 'https://dahd.nic.in/kisan-credit-card-kcc'
  },
  {
    id: 'fidf',
    title: 'Fisheries Infrastructure Development Fund (FIDF)',
    category: 'INFRASTRUCTURE',
    icon: <Building2 />,
    benefit: 'Concessional Finance / Interest Subvention',
    eligibility: 'State Governments, Cooperatives, Entrepreneurs',
    description: 'Focuses on creating high-quality infrastructure for fisheries like fishing harbours, fish landing centres, and cold chains.',
    link: 'https://nfdb.gov.in/fidf.html'
  },
  {
    id: 'blue-rev',
    title: 'Blue Revolution Scheme',
    category: 'SUBSIDY',
    icon: <Sparkles />,
    benefit: 'Integrated Development & Management',
    eligibility: 'Traditional Fishers, Fish Farmers',
    description: 'Promotes intensive aquaculture in ponds and tanks, and productivity enhancement through high yielding varieties.',
    link: 'https://dof.gov.in/blue-revolution'
  },
  {
    id: 'training',
    title: 'Fisheries Extension & Training',
    category: 'TRAINING',
    icon: <GraduationCap />,
    benefit: 'Skill Development & Technology Transfer',
    eligibility: 'Interested Farmers, Youth, Women in Aquaculture',
    description: 'Providing technical know-how on modern fish farming techniques like Biofloc, RAS, and Cage Culture.',
    link: 'https://nfdb.gov.in/training.html'
  }
];

const Schemes: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'SUBSIDY', 'LOAN', 'TRAINING', 'INFRASTRUCTURE'];

  const filteredSchemes = GOV_SCHEMES.filter(s => {
    const matchesTab = activeTab === 'ALL' || s.category === activeTab;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'SUBSIDY': return 'text-emerald-500 bg-emerald-500/10';
      case 'LOAN': return 'text-blue-500 bg-blue-500/10';
      case 'TRAINING': return 'text-purple-500 bg-purple-500/10';
      case 'INFRASTRUCTURE': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  return (
    <div className={`pb-32 transition-colors duration-500 min-h-screen ${theme === 'dark' ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
      <div className={`p-8 pt-16 space-y-6 ${theme === 'dark' ? 'bg-slate-900 border-b border-white/5' : 'bg-white border-b border-slate-100'}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Government Hub
            </h2>
            <p className="text-slate-400 text-sm font-medium">Unlock subsidies, loans & training</p>
          </div>
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
            <ShieldCheck size={32} />
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search schemes, e.g. 'subsidy'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-4 pl-12 pr-6 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
              theme === 'dark' ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'
            }`}
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === cat 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                  : (theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => (
            <div 
              key={scheme.id}
              className={`rounded-[2.5rem] border overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                theme === 'dark' ? 'bg-slate-900 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-2xl ${getCategoryColor(scheme.category)}`}>
                    {React.cloneElement(scheme.icon as React.ReactElement<any>, { size: 24 })}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getCategoryColor(scheme.category)}`}>
                    {scheme.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className={`text-lg font-black leading-tight tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    {scheme.title}
                  </h3>
                  <p className={`text-[11px] leading-relaxed line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {scheme.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800/50 border-white/5' : 'bg-emerald-50/30 border-emerald-100/50'}`}>
                    <p className="text-[8px] font-black uppercase text-emerald-600 mb-1">Key Benefit</p>
                    <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{scheme.benefit}</p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800/50 border-white/5' : 'bg-blue-50/30 border-blue-100/50'}`}>
                    <p className="text-[8px] font-black uppercase text-blue-600 mb-1">Eligibility</p>
                    <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{scheme.eligibility}</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <a 
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink size={14} />
                  </a>
                  <button 
                    onClick={() => alert("Assistant: I can explain " + scheme.id + " in detail if you ask me in chat!")}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all active:scale-95 ${
                      theme === 'dark' ? 'bg-slate-800 border-white/10 text-emerald-400' : 'bg-white border-slate-100 text-emerald-600 shadow-sm'
                    }`}
                  >
                    <Sparkles size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
              <Search size={32} />
            </div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No schemes found matching your search</p>
          </div>
        )}

        {/* Informational Banner */}
        <div className={`p-8 rounded-[3rem] relative overflow-hidden text-white shadow-2xl ${
          theme === 'dark' ? 'bg-gradient-to-br from-indigo-900 to-slate-900' : 'bg-gradient-to-br from-emerald-600 to-teal-700'
        }`}>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-2 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
              <CheckCircle2 size={12} className="text-white" />
              <span className="text-[9px] font-black uppercase tracking-widest">Pro Tip</span>
            </div>
            <h3 className="text-xl font-black leading-tight">Need help with documentation?</h3>
            <p className="text-xs text-white/70 font-medium">Our AI can draft your application letter or guide you through the required identity documents.</p>
            <button className="bg-white text-emerald-700 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center space-x-2">
              <span>Ask AI Expert</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <Info className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32 rotate-12" />
        </div>
      </div>
    </div>
  );
};

export default Schemes;

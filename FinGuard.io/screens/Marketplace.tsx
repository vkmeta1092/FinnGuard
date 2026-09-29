
import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Star, Sparkles, ExternalLink, Loader2, Globe, TrendingUp, X, Clock, Box } from 'lucide-react';
import { MOCK_MARKETPLACE } from '../constants';
import { useTheme } from '../App';
import { searchAquacultureProducts, getSearchSuggestions, SearchProductResult } from '../services/geminiService';

const HighlightedText: React.FC<{ text: string; highlight: string; className?: string }> = ({ text, highlight, className }) => {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span className={className}>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-blue-500/30 text-blue-100 rounded-sm px-0.5">{part}</mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

const Marketplace: React.FC = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastExecutedQuery, setLastExecutedQuery] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiResults, setAiResults] = useState<SearchProductResult[]>([]);
  const [groundingSources, setGroundingSources] = useState<any[]>([]);
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

  const categories = ['ALL', 'FEED', 'MEDICINE', 'EQUIPMENT', 'SEEDS'];
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced auto-suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2 && searchQuery !== lastExecutedQuery) {
        setIsFetchingSuggestions(true);
        try {
          const res = await getSearchSuggestions(searchQuery);
          setSuggestions(res);
          setShowSuggestions(true);
        } catch (err) {
          console.error(err);
        } finally {
          setIsFetchingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, lastExecutedQuery]);

  const filteredItems = filter === 'ALL' 
    ? MOCK_MARKETPLACE 
    : MOCK_MARKETPLACE.filter(item => item.category === filter);

  const handleAISearch = async (queryOverride?: string) => {
    const targetQuery = queryOverride || searchQuery;
    if (!targetQuery.trim()) return;
    
    setSearchQuery(targetQuery);
    setLastExecutedQuery(targetQuery);
    setShowSuggestions(false);
    setIsSearchingAI(true);
    
    try {
      const { products, sources } = await searchAquacultureProducts(targetQuery);
      setAiResults(products);
      setGroundingSources(sources);
    } catch (err) {
      console.error("AI Search Error:", err);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&q=80&w=400'; // Generic aquaculture fallback
  };

  return (
    <div className={`pb-32 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
      {/* Search Header */}
      <div className={`p-6 space-y-4 sticky top-0 z-[60] backdrop-blur-md border-b ${theme === 'dark' ? 'bg-slate-900/80 border-white/5' : 'bg-white/80 border-slate-100'}`}>
        <div className="flex items-center space-x-3 relative">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
              placeholder="Search fish feed, tools..." 
              className={`w-full rounded-2xl py-3.5 pl-12 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                theme === 'dark' ? 'bg-slate-800 text-white border-white/5' : 'bg-slate-100 text-slate-800 border-transparent'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1 hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && (suggestions.length > 0 || isFetchingSuggestions) && (
              <div 
                ref={suggestionRef}
                className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[70] ${
                  theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'
                }`}
              >
                {isFetchingSuggestions && (
                  <div className="p-4 flex items-center justify-center space-x-2">
                    <Loader2 size={14} className="animate-spin text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Suggesting...</span>
                  </div>
                )}
                <div className="divide-y divide-white/5">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleAISearch(s)}
                      className={`w-full text-left p-4 text-xs font-bold transition-colors flex items-center space-x-3 ${
                        theme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Clock size={12} className="text-slate-500" />
                      <HighlightedText text={s} highlight={searchQuery} className="flex-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => handleAISearch()}
            disabled={isSearchingAI}
            className="bg-blue-600 text-white p-3.5 rounded-2xl active:scale-95 transition-all shadow-lg shadow-blue-500/20"
          >
            {isSearchingAI ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
          </button>
        </div>

        {/* Categories Scroller */}
        <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                filter === cat 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : (theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* AI Top Suggestions Section */}
        {aiResults.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                  <TrendingUp size={16} />
                </div>
                <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  Google Top Suggestions
                </h3>
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Web Recommendations</span>
            </div>

            <div className="space-y-3">
              {aiResults.map((product, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-3xl border transition-all ${
                    theme === 'dark' ? 'bg-slate-800/40 border-white/5' : 'bg-white border-slate-100 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                      <HighlightedText text={product.title} highlight={lastExecutedQuery} />
                    </h4>
                    <a 
                      href={product.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 p-1.5 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <p className={`text-[11px] leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    <HighlightedText text={product.description} highlight={lastExecutedQuery} />
                  </p>
                  <div className="flex items-center space-x-2">
                    <Globe size={10} className="text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[150px]">
                      Source: {product.sourceTitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Local Verified Inventory */}
        <div className="space-y-4">
          <div className="flex items-center justify-between ml-1">
            <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Verified Inventory
            </h3>
            <span className="text-[10px] font-bold text-blue-500">Fast Delivery</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={`rounded-[2rem] overflow-hidden border transition-all active:scale-[0.98] group flex flex-col ${
                  theme === 'dark' ? 'bg-slate-900 border-white/5 shadow-xl' : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                    <Star size={10} fill="#EAB308" className="text-amber-500" />
                    <span className="text-[10px] font-black text-slate-800">{item.rating}</span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1.5">
                    {item.category}
                  </span>
                  <h3 className={`text-xs font-black line-clamp-1 leading-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <HighlightedText text={item.name} highlight={lastExecutedQuery} />
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{item.price}</span>
                    <button className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-90 transition-all">
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Group Buy Banner */}
        <div className="bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-2 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
              <TrendingUp size={12} className="text-emerald-300" />
              <span className="text-[9px] font-black uppercase tracking-widest">Active Deal</span>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight leading-tight">Farmer Group Buy</h2>
              <p className="text-xs text-white/70 font-medium mt-2 max-w-[220px]">
                Collaborate with 12 nearby farmers to save 18% on high-grade fish feed.
              </p>
            </div>
            <button className="bg-white text-blue-700 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
              Join Group Now
            </button>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full -ml-16 -mb-16 blur-xl"></div>
          <Sparkles className="absolute top-8 right-8 text-white/20 animate-pulse" size={40} />
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

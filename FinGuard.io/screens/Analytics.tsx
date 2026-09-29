
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { COLORS } from '../constants';

const Analytics: React.FC = () => {
  const growthData = [
    { month: 'Jan', weight: 1.2, target: 1.0 },
    { month: 'Feb', weight: 1.8, target: 1.5 },
    { month: 'Mar', weight: 2.4, target: 2.2 },
    { month: 'Apr', weight: 3.1, target: 3.0 },
    { month: 'May', weight: 4.2, target: 3.8 },
    { month: 'Jun', weight: 5.5, target: 5.0 },
  ];

  const pondStats = [
    { name: 'pH', value: 92, fill: COLORS.growthGreen },
    { name: 'DO', value: 85, fill: COLORS.oceanBlue },
    { name: 'Temp', value: 98, fill: '#FFB800' },
    { name: 'Amm', value: 75, fill: COLORS.coralAlert },
  ];

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-gray-800">Analytics</h1>
        <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-100 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-[10px] font-bold text-gray-500">Live Sync</span>
        </div>
      </div>

      {/* Yield Forecast Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs opacity-70 font-bold uppercase tracking-wider">Estimated Harvest Value</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <h2 className="text-4xl font-black">₹4.25L</h2>
            <div className="flex items-center text-green-300 text-xs font-bold">
              <ArrowUpRight size={14} />
              <span>+12.4% vs last cycle</span>
            </div>
          </div>
          <p className="text-[10px] opacity-60 mt-4 max-w-[200px]">
            Based on current growth rate and market pricing trends in West Bengal.
          </p>
        </div>
        <TrendingUp className="absolute bottom-0 right-0 text-white/10 w-32 h-32 -mb-6 -mr-6" />
      </div>

      {/* Growth Trend Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800">Weight Growth (kg)</h3>
          <span className="text-[10px] font-bold text-gray-400">Last 6 Months</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.oceanBlue} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={COLORS.oceanBlue} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke={COLORS.oceanBlue} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorWeight)" 
              />
              <Area 
                type="monotone" 
                dataKey="target" 
                stroke="#d1d5db" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Parameter Stability */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-6">Parameter Stability Index</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pondStats} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#374151'}} width={40} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                {pondStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

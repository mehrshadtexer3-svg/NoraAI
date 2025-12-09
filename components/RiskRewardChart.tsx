import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  YAxis,
  XAxis,
  ReferenceLine,
  Tooltip,
  Bar,
  Cell
} from 'recharts';
import { TradeSignal, SignalType } from '../types';

interface Props {
  data: TradeSignal;
}

const RiskRewardChart: React.FC<Props> = ({ data }) => {
  if (data.signal === SignalType.NEUTRAL) return null;

  // Safety check for required numeric values
  if (
    data.entryPriceNumeric === undefined || 
    data.stopLoss === undefined || 
    !data.takeProfit || 
    data.takeProfit.length === 0
  ) {
    return (
      <div className="h-64 w-full bg-slate-900/50 rounded-lg p-4 border border-slate-800 flex items-center justify-center">
        <span className="text-slate-500 text-xs font-mono">Insufficient data for chart</span>
      </div>
    );
  }

  const entry = data.entryPriceNumeric;
  const sl = data.stopLoss;
  const tp = data.takeProfit[0]; // visualize first TP

  // Determine min/max for domain
  const allPrices = [entry, sl, ...data.takeProfit];
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const padding = (maxPrice - minPrice) * 0.1;

  // Chart data: We want to show a bar representing the potential PnL range
  const chartData = [
    { name: 'Trade', price: entry, min: sl, max: tp }
  ];

  return (
    <div className="h-64 w-full bg-slate-900/50 rounded-lg p-4 border border-slate-800">
      <h3 className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">Trade Setup Visualizer</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          layout="vertical"
        >
          <XAxis 
            type="number" 
            domain={[minPrice - padding, maxPrice + padding]} 
            stroke="#94a3b8" 
            tickFormatter={(val) => typeof val === 'number' ? val.toFixed(2) : val}
            fontSize={12}
          />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
          />

          {/* Entry Line */}
          <ReferenceLine x={entry} stroke="#fbbf24" strokeDasharray="3 3" label={{ position: 'top', value: 'ENTRY', fill: '#fbbf24', fontSize: 10 }} />
          
          {/* Stop Loss Line */}
          <ReferenceLine x={sl} stroke="#f43f5e" label={{ position: 'bottom', value: 'SL', fill: '#f43f5e', fontSize: 10 }} />
          
          {/* Take Profit Lines */}
          {data.takeProfit.map((tpPrice, idx) => (
             <ReferenceLine key={idx} x={tpPrice} stroke="#10b981" label={{ position: 'top', value: `TP${idx+1}`, fill: '#10b981', fontSize: 10 }} />
          ))}

          {/* Visualizing the range */}
          <Bar dataKey="price" barSize={20} fill="transparent" /> 

        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="flex justify-between items-center text-xs px-2 mt-[-10px]">
        <span className="text-rose-400">Risk: {entry !== 0 ? Math.abs(((entry - sl)/entry)*100).toFixed(2) : '0.00'}%</span>
        <span className="text-emerald-400">Reward: {entry !== 0 ? Math.abs(((tp - entry)/entry)*100).toFixed(2) : '0.00'}%</span>
      </div>
    </div>
  );
};

export default RiskRewardChart;
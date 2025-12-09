import React from 'react';
import { TradeSignal, SignalType } from '../types';
import { 
  TrendingUp, TrendingDown, MinusCircle, 
  Target, ShieldAlert, Activity, Copy, 
  Layers, BarChart2, AlertTriangle, Crosshair
} from 'lucide-react';
import RiskRewardChart from './RiskRewardChart';

interface Props {
  data: TradeSignal;
}

const SignalCard: React.FC<Props> = ({ data }) => {
  const isLong = data.signal === SignalType.LONG;
  const isShort = data.signal === SignalType.SHORT;
  const isNeutral = data.signal === SignalType.NEUTRAL;

  const colorTheme = isLong ? 'emerald' : isShort ? 'rose' : 'slate';
  const textColor = isLong ? 'text-emerald-400' : isShort ? 'text-rose-400' : 'text-slate-400';
  const bgColor = isLong ? 'bg-emerald-500' : isShort ? 'bg-rose-500' : 'bg-slate-500';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`SIGNAL: ${data.signal} | ${data.symbol} | Entry: ${data.entryPrice} | SL: ${data.stopLoss}`);
  };

  return (
    <div className={`w-full max-w-5xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8`}>
      
      {/* Top Banner: Signal & Confidence */}
      <div className={`relative p-6 border-b border-slate-800 bg-slate-900/50`}>
        <div className={`absolute top-0 left-0 w-1 h-full ${bgColor}`}></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg ${textColor}`}>
              {isLong ? <TrendingUp size={32} /> : isShort ? <TrendingDown size={32} /> : <MinusCircle size={32} />}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className={`text-3xl font-black tracking-tighter ${textColor}`}>{data.signal}</h2>
                <span className="text-xl font-bold text-slate-200">{data.symbol}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-400 font-mono">{data.timeframe}</span>
              </div>
              <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Autonomous Professional Analyst</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-slate-900 p-3 rounded-lg border border-slate-800">
            <div className="text-center px-2">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Confidence</div>
                <div className={`text-2xl font-bold ${textColor}`}>{data.confidenceScore}%</div>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="text-center px-2">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">R:R Ratio</div>
                <div className="text-2xl font-bold text-blue-400">{data.expectedRR}</div>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
             <div className="text-center px-2">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Sentiment</div>
                <div className="text-xs font-bold text-purple-400">{data.marketSentiment}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        
        {/* Left Col: Execution & Chart */}
        <div className="lg:col-span-2 p-6 space-y-6 border-r border-slate-800">
            
            {/* Entry/Exit Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                        <Crosshair size={14} /> <span className="text-xs font-bold uppercase">Entry Zone</span>
                    </div>
                    <div className="text-2xl font-mono text-white">{data.entryPrice}</div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-rose-500/50"></div>
                     <div className="flex items-center gap-2 mb-2 text-rose-400">
                        <ShieldAlert size={14} /> <span className="text-xs font-bold uppercase">Stop Loss</span>
                    </div>
                    <div className="text-2xl font-mono text-white">{data.stopLoss}</div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50"></div>
                     <div className="flex items-center gap-2 mb-2 text-emerald-400">
                        <Target size={14} /> <span className="text-xs font-bold uppercase">Target 1</span>
                    </div>
                    <div className="text-2xl font-mono text-white">{data.takeProfit[0]}</div>
                </div>
            </div>

            {/* Visualizer */}
            <RiskRewardChart data={data} />

            {/* Trend Dashboard */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                    <Activity size={14} /> Multi-Timeframe Trend Alignment
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {data.trendAlignment.map((t, i) => (
                        <div key={i} className="bg-slate-950 p-3 rounded border border-slate-800 text-center">
                            <div className="text-[10px] text-slate-500 mb-1">{t.timeframe}</div>
                            <div className={`text-sm font-bold ${t.trend === 'BULLISH' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {t.trend}
                            </div>
                            <div className="text-[10px] text-slate-600 mt-1 font-mono">EMA: {t.ema200.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Col: Analysis & Data */}
        <div className="p-6 space-y-6 bg-slate-900/20">
            
            {/* Key Indicators */}
            <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                    <BarChart2 size={14} /> Technical Indicators
                </h3>
                <div className="space-y-2">
                    {data.keyIndicators.map((ind, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-slate-900 border border-slate-800 rounded">
                            <span className="text-xs text-slate-300">{ind.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-400">{ind.value}</span>
                                <span className={`w-2 h-2 rounded-full ${ind.signal === 'BULLISH' ? 'bg-emerald-500' : ind.signal === 'BEARISH' ? 'bg-rose-500' : 'bg-yellow-500'}`}></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Liquidity Zones */}
            <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                    <Layers size={14} /> Institutional Levels
                </h3>
                <div className="space-y-1">
                    {data.liquidityZones.slice(0, 5).map((zone, i) => (
                        <div key={i} className="flex justify-between text-xs font-mono p-1 border-b border-slate-800/50 last:border-0">
                            <span className={zone.type === 'PIVOT' ? 'text-yellow-500' : zone.type === 'RESISTANCE' ? 'text-rose-400' : 'text-emerald-400'}>
                                {zone.name}
                            </span>
                            <span className="text-slate-400">{zone.price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rationale */}
            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Analyst Rationale</h3>
                <ul className="space-y-2">
                    {data.rationale.map((r, i) => (
                        <li key={i} className="text-xs text-slate-300 flex gap-2 leading-relaxed">
                            <span className="text-blue-500">•</span> {r}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Risks */}
             <div className="bg-rose-900/10 p-4 rounded-xl border border-rose-900/20">
                <h3 className="text-xs font-bold text-rose-500/70 uppercase mb-2 flex items-center gap-1">
                    <AlertTriangle size={12} /> Risks
                </h3>
                <ul className="space-y-2">
                    {data.contrarianRisks.map((r, i) => (
                        <li key={i} className="text-xs text-rose-300/80 flex gap-2 leading-relaxed">
                            <span>•</span> {r}
                        </li>
                    ))}
                </ul>
            </div>

            <button onClick={copyToClipboard} className="w-full py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2">
                <Copy size={14} /> Copy Signal JSON
            </button>
        </div>
      </div>
      
      {/* Footer Summary */}
      <div className="bg-slate-950 p-4 border-t border-slate-800 text-center">
         <p className="text-slate-400 text-sm italic font-serif">"{data.humanSummary}"</p>
      </div>
    </div>
  );
};

export default SignalCard;
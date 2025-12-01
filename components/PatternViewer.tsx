import React, { useState, useEffect } from 'react';
import { Loader2, ArrowRight, Target, AlertTriangle, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import { getPatternDetails } from '../services/geminiService';
import { PatternData } from '../types';

const COMMON_PATTERNS = [
  "Head and Shoulders",
  "Double Top",
  "Bull Flag"
];

// --- ADVANCED CHART RENDERER ---
// Simulates a professional TradingView chart with Entry/TP/SL zones
const PatternChart: React.FC<{ pattern: string }> = ({ pattern }) => {
  
  // --- HELPER COMPONENTS ---
  const GreenCandle = ({ x, y, bodyH, wickH, w = 14 }: any) => {
    const wickTop = y - (wickH - bodyH)/2;
    return (
      <g className="hover:opacity-80 transition-opacity">
        <line x1={x + w/2} y1={wickTop} x2={x + w/2} y2={wickTop + wickH} stroke="#10B981" strokeWidth="1.5" />
        <rect x={x} y={y} width={w} height={bodyH} fill="#10B981" rx="1" stroke="#059669" strokeWidth="1" />
      </g>
    );
  };
  
  const RedCandle = ({ x, y, bodyH, wickH, w = 14 }: any) => {
    const wickTop = y - (wickH - bodyH)/2;
    return (
      <g className="hover:opacity-80 transition-opacity">
        <line x1={x + w/2} y1={wickTop} x2={x + w/2} y2={wickTop + wickH} stroke="#EF4444" strokeWidth="1.5" />
        <rect x={x} y={y} width={w} height={bodyH} fill="#EF4444" rx="1" stroke="#B91C1C" strokeWidth="1" />
      </g>
    );
  };

  const MarkerLine = ({ y, color, label, type }: any) => (
    <g>
      <line x1="0" y1={y} x2="600" y2={y} stroke={color} strokeWidth="2" strokeDasharray={type === 'solid' ? '0' : '6,4'} opacity="0.8" />
      <rect x="520" y={y - 12} width="80" height="24" rx="4" fill={color} />
      <text x="560" y={y + 5} fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">{label}</text>
    </g>
  );

  const Arrow = ({ x1, y1, x2, y2, text }: any) => (
    <g>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
      <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="#94A3B8" fontSize="10" textAnchor="middle">{text}</text>
    </g>
  );

  // --- RENDER LOGIC ---
  const renderChart = () => {
    switch (pattern) {
      case "Head and Shoulders":
        return (
          <>
            {/* Left Shoulder */}
            <GreenCandle x={40} y={160} bodyH={40} wickH={60} />
            <GreenCandle x={60} y={140} bodyH={50} wickH={70} />
            <RedCandle x={80} y={145} bodyH={45} wickH={55} />
            <RedCandle x={100} y={170} bodyH={30} wickH={40} />
            
            {/* Head */}
            <GreenCandle x={140} y={120} bodyH={60} wickH={80} />
            <GreenCandle x={160} y={80} bodyH={70} wickH={90} /> {/* Peak */}
            <RedCandle x={180} y={90} bodyH={50} wickH={80} />
            <RedCandle x={200} y={130} bodyH={60} wickH={70} />
            
            {/* Right Shoulder */}
            <GreenCandle x={240} y={160} bodyH={30} wickH={40} />
            <GreenCandle x={260} y={145} bodyH={35} wickH={45} />
            <RedCandle x={280} y={150} bodyH={40} wickH={50} />
            
            {/* Breakdown */}
            <RedCandle x={320} y={190} bodyH={60} wickH={70} /> {/* Signal Candle */}
            <RedCandle x={340} y={230} bodyH={50} wickH={60} />

            {/* Levels */}
            <line x1={30} y1={200} x2={400} y2={200} stroke="#F59E0B" strokeWidth="2" /> {/* Neckline */}
            
            {/* Markers */}
            <MarkerLine y={70} color="#EF4444" label="SL" /> {/* Stop Loss */}
            <MarkerLine y={210} color="#3B82F6" label="ENTRY" /> {/* Entry */}
            <MarkerLine y={290} color="#10B981" label="TP" /> {/* TP */}

            {/* Text Annotations */}
            <text x={70} y={130} fill="white" fontSize="12" textAnchor="middle">L.S.</text>
            <text x={170} y={60} fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">HEAD</text>
            <text x={270} y={135} fill="white" fontSize="12" textAnchor="middle">R.S.</text>
            <text x={380} y={190} fill="#F59E0B" fontSize="12" fontWeight="bold">NECKLINE</text>
          </>
        );

      case "Double Top":
        return (
          <>
            {/* First Peak */}
            <GreenCandle x={50} y={150} bodyH={50} wickH={70} />
            <GreenCandle x={70} y={100} bodyH={60} wickH={80} />
            <RedCandle x={90} y={110} bodyH={40} wickH={60} />
            <RedCandle x={110} y={160} bodyH={50} wickH={70} />

            {/* Valley */}
            <GreenCandle x={140} y={180} bodyH={20} wickH={30} />
            <GreenCandle x={160} y={140} bodyH={40} wickH={60} />

            {/* Second Peak */}
            <GreenCandle x={190} y={105} bodyH={50} wickH={70} />
            <RedCandle x={210} y={100} bodyH={60} wickH={80} />
            <RedCandle x={230} y={150} bodyH={50} wickH={60} />
            
            {/* Breakdown */}
            <RedCandle x={270} y={210} bodyH={60} wickH={70} /> {/* Breakout */}
            <RedCandle x={290} y={250} bodyH={40} wickH={50} />

            {/* Resistance Zone */}
            <rect x={40} y={90} width={220} height={20} fill="#EF4444" opacity="0.2" />
            
            {/* Markers */}
            <MarkerLine y={80} color="#EF4444" label="SL" />
            <MarkerLine y={205} color="#3B82F6" label="ENTRY" />
            <MarkerLine y={280} color="#10B981" label="TP" />

            <text x={75} y={85} fill="white" fontSize="12">Peak 1</text>
            <text x={215} y={85} fill="white" fontSize="12">Peak 2</text>
          </>
        );

      case "Bull Flag":
        return (
          <>
            {/* Pole */}
            <GreenCandle x={50} y={250} bodyH={40} wickH={50} />
            <GreenCandle x={70} y={200} bodyH={60} wickH={70} />
            <GreenCandle x={90} y={150} bodyH={60} wickH={70} />
            <GreenCandle x={110} y={100} bodyH={60} wickH={70} />
            <GreenCandle x={130} y={50} bodyH={60} wickH={80} />

            {/* Flag Consolidation */}
            <RedCandle x={160} y={60} bodyH={30} wickH={40} />
            <RedCandle x={180} y={70} bodyH={30} wickH={40} />
            <GreenCandle x={200} y={75} bodyH={20} wickH={30} />
            <RedCandle x={220} y={85} bodyH={30} wickH={40} />

            {/* Breakout */}
            <GreenCandle x={260} y={70} bodyH={60} wickH={80} /> {/* BOOM */}
            <GreenCandle x={280} y={30} bodyH={60} wickH={70} />

            {/* Trendlines */}
            <line x1={150} y1={50} x2={240} y2={90} stroke="white" strokeWidth="1" strokeDasharray="4,2" />
            <line x1={150} y1={100} x2={240} y2={140} stroke="white" strokeWidth="1" strokeDasharray="4,2" />

            <MarkerLine y={140} color="#EF4444" label="SL" />
            <MarkerLine y={50} color="#3B82F6" label="ENTRY" />
            <MarkerLine y={10} color="#10B981" label="TP" />

            <text x={90} y={200} fill="#10B981" fontSize="14" fontWeight="bold" transform="rotate(-90 90,200)">IMPULSE (POLE)</text>
            <text x={190} y={120} fill="white" fontSize="12">Correction</text>
          </>
        );

      default:
        // Generic Chart Template
        return (
          <>
             <text x="300" y="150" fill="gray" textAnchor="middle">Detailed chart simulation loading...</text>
          </>
        );
    }
  };

  return (
    <div className="w-full h-full bg-[#0F172A] relative overflow-hidden rounded-lg border border-slate-700 shadow-inner">
      {/* Grid */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      
      <svg viewBox="0 0 600 320" className="w-full h-full relative z-10">
        {renderChart()}
      </svg>

      {/* Watermark */}
      <div className="absolute bottom-4 left-4 opacity-20">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <TrendingUp /> EAGLENOVA
        </div>
      </div>
    </div>
  );
};

const PatternViewer: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<string>(COMMON_PATTERNS[0]);
  const [data, setData] = useState<PatternData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPatternDetails(selectedPattern).then(d => {
      setData(d);
      setLoading(false);
    });
  }, [selectedPattern]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-trade-surface rounded-xl border border-gray-700 flex flex-col shadow-xl">
        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
          <h3 className="font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-trade-primary" /> Pattern List
          </h3>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {COMMON_PATTERNS.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPattern(p)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                selectedPattern === p 
                ? 'bg-trade-primary text-white shadow-lg shadow-amber-500/20' 
                : 'text-slate-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
        {loading || !data ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-trade-primary" />
          </div>
        ) : (
          <>
            {/* Chart Container */}
            <div className="bg-trade-surface p-1 rounded-xl border border-gray-700 shadow-2xl">
              <div className="h-[300px] md:h-[450px] w-full">
                <PatternChart pattern={selectedPattern} />
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
              <div className="bg-trade-surface p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">{data.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    data.significance === 'Bullish' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}>
                    {data.significance.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {data.description}
                </p>
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex gap-3">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <p className="text-xs text-slate-400">
                    <strong className="text-blue-400">Pro Context:</strong> Look for this pattern on H4 or Daily timeframes for highest reliability. M1/M5 patterns often fail due to noise.
                  </p>
                </div>
              </div>

              <div className="bg-trade-surface p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-trade-primary" /> Execution Plan
                </h3>
                <div className="space-y-3">
                  {data.strategyTips.map((tip, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-trade-primary border border-gray-700 flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-slate-300">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PatternViewer;

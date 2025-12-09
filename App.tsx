import React, { useState } from 'react';
import AnalystForm from './components/AnalystForm';
import SignalCard from './components/SignalCard';
import { AnalysisRequest, TradeSignal } from './types';
import { analyzeMarket } from './services/geminiService';
import { LineChart, Activity, Cpu, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [signalData, setSignalData] = useState<TradeSignal | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (request: AnalysisRequest) => {
    setLoading(true);
    setError(null);
    setSignalData(null);
    
    try {
      const result = await analyzeMarket(request);
      setSignalData(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while analyzing the market.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-600/20">
                <Cpu className="text-white" size={20} />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">
                  EAGLENOVA <span className="text-indigo-500">PRO</span>
                </span>
                <span className="text-[10px] text-slate-500 block -mt-1 tracking-widest font-mono">NORA ENGINE</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Live Connections Active</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Intro Section */}
        {!signalData && !loading && (
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center p-4 bg-slate-900 rounded-full mb-8 border border-slate-800 shadow-2xl relative group">
               <Activity className="text-indigo-500 group-hover:scale-110 transition-transform duration-300" size={48} />
               <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-slate-700/20"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Institutional Grade <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Technical Analysis</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Autonomous engine analyzing market structure, momentum, and volatility across <span className="text-white font-bold">multiple timeframes</span> to generate high-confluence trading signals.
            </p>
            
            <div className="flex justify-center gap-4 mt-8 text-xs font-mono text-slate-500">
                <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800">MACD</span>
                <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800">Bollinger Bands</span>
                <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800">Pivot Points</span>
                <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800">RSI Divergence</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-12">
          {/* Input Form */}
          <section className={`transition-all duration-700 ${signalData ? 'opacity-40 scale-95 hover:opacity-100 hover:scale-100' : ''}`}>
             <AnalystForm onSubmit={handleAnalysis} isLoading={loading} />
          </section>

          {/* Error Display */}
          {error && (
            <div className="max-w-lg mx-auto bg-rose-950/30 border border-rose-500/30 p-4 rounded-lg text-rose-300 text-center text-sm font-mono backdrop-blur-sm">
              <span className="block font-bold mb-1 flex items-center justify-center gap-2"><AlertTriangle size={14}/> ANALYSIS ERROR</span>
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && !signalData && (
             <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-b-cyan-500/20 rounded-full animate-spin direction-reverse" style={{ animationDuration: '3s' }}></div>
                </div>
                <div className="text-center space-y-1">
                    <p className="text-slate-200 font-bold text-lg animate-pulse">Aggregating Market Data...</p>
                    <p className="text-slate-500 text-xs font-mono">Fetching Daily, 4H, & 1H Candles</p>
                    <p className="text-slate-600 text-[10px] font-mono">Calculating Pivots & Volatility Models</p>
                </div>
             </div>
          )}

          {/* Result Card */}
          {signalData && (
            <section className="animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500">
               <SignalCard data={signalData} />
               <div className="text-center mt-12">
                  <button 
                    onClick={() => setSignalData(null)}
                    className="px-6 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-sm transition-all border border-slate-800 hover:border-slate-700"
                  >
                    Run New Analysis
                  </button>
               </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

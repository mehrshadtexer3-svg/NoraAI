import React, { useState } from 'react';
import { Target, Clock, Zap, BookOpen, Layers, Lock, ChevronRight } from 'lucide-react';
import { getStrategyContent } from '../services/geminiService';

const Strategies = [
  { id: 'scalping', name: 'Scalping', desc: '1-Minute Timeframe • High Speed', icon: Clock },
  { id: 'day', name: 'Day Trading', desc: 'Session Based • No Overnight Risk', icon: Zap },
  { id: 'swing', name: 'Swing Trading', desc: 'H4/Daily Charts • Catch Trends', icon: Target },
  { id: 'price_action', name: 'Price Action', desc: 'Pure Market Structure', icon: Layers },
  { id: 'institutional', name: 'Institutional', desc: 'Smart Money & Liquidity', icon: BookOpen },
];

const StrategyBuilder: React.FC = () => {
  const [activeStrategy, setActiveStrategy] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleStrategyClick = async (strategyName: string) => {
    if (activeStrategy === strategyName) return;
    setActiveStrategy(strategyName);
    setLoading(true);
    setContent("");
    
    try {
      const text = await getStrategyContent(strategyName);
      setContent(text);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-2">
        <div>
           <h2 className="text-3xl md:text-4xl font-extrabold text-white">Strategy <span className="text-trade-primary">Vault</span></h2>
           <p className="text-slate-400 text-sm mt-1">Professional playbooks used by institutional traders.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 grid grid-cols-2 lg:grid-cols-1 gap-2 overflow-y-auto max-h-48 lg:max-h-full">
          {Strategies.map((s) => (
            <button
              key={s.id}
              onClick={() => handleStrategyClick(s.name)}
              className={`p-4 rounded-xl border text-left transition-all duration-300 group relative overflow-hidden ${
                activeStrategy === s.name
                  ? 'bg-gradient-to-r from-trade-primary to-orange-600 border-transparent text-white shadow-xl'
                  : 'bg-trade-surface border-gray-700 text-slate-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 relative z-10">
                <div className={`p-2 rounded-lg ${activeStrategy === s.name ? 'bg-white/20' : 'bg-gray-900'}`}>
                  <s.icon className={`w-5 h-5 ${activeStrategy === s.name ? 'text-white' : 'text-trade-primary'}`} />
                </div>
                <div>
                  <div className="font-bold text-sm">{s.name}</div>
                  <div className={`text-[10px] ${activeStrategy === s.name ? 'text-blue-50' : 'text-slate-600'}`}>{s.desc}</div>
                </div>
              </div>
              {/* Background Decoration */}
              {activeStrategy === s.name && <s.icon className="absolute -bottom-2 -right-2 w-16 h-16 text-white opacity-10 rotate-12" />}
            </button>
          ))}
        </div>

        {/* Content Viewer */}
        <div className="flex-1 bg-trade-surface rounded-2xl border border-gray-700 shadow-2xl overflow-hidden relative">
          {!activeStrategy ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 to-trade-surface">
              <Lock className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Select a module to decrypt contents</p>
            </div>
          ) : loading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-trade-surface z-10">
                <div className="w-12 h-12 border-4 border-gray-700 border-t-trade-primary rounded-full animate-spin"></div>
                <p className="text-trade-primary font-mono text-xs animate-pulse tracking-widest">LOADING INTEL...</p>
             </div>
          ) : (
            <div className="p-8 md:p-12 overflow-y-auto h-full custom-scrollbar">
              <div className="prose prose-invert prose-lg max-w-none">
                {content.split('\n').map((line, i) => {
                  const trimmed = line.trim();
                  
                  // Section Headers
                  if (trimmed.startsWith('###')) {
                    return (
                      <div key={i} className="mt-10 mb-6 pb-2 border-b border-gray-700">
                        <h3 className="text-2xl font-bold text-white m-0 flex items-center gap-3">
                          <span className="text-trade-primary text-3xl">#</span>
                          {trimmed.replace(/###/g, '')}
                        </h3>
                      </div>
                    );
                  }

                  // Pro Tip Box
                  if (trimmed.startsWith('>')) {
                    return (
                      <div key={i} className="my-8 p-6 bg-gradient-to-r from-blue-900/30 to-transparent border-l-4 border-blue-500 rounded-r-xl">
                        <h4 className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                           <Zap className="w-4 h-4" /> Pro Insight
                        </h4>
                        <p className="text-blue-100 italic m-0 font-medium text-lg">
                          "{trimmed.replace(/>/g, '').trim()}"
                        </p>
                      </div>
                    );
                  }

                  // Bullet Points
                  if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
                    return (
                      <div key={i} className="flex gap-3 ml-2 mb-3 text-slate-300 group hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5 text-trade-primary flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span dangerouslySetInnerHTML={{ 
                          __html: trimmed.replace(/^[\*-]\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>') 
                        }} />
                      </div>
                    );
                  }

                  // Ordered Lists
                  if (trimmed.match(/^\d\./)) {
                      return (
                          <div key={i} className="flex gap-4 mb-4 bg-gray-900/40 p-4 rounded-xl border border-gray-800 hover:border-trade-primary/30 transition-colors">
                              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-trade-primary/10 text-trade-primary flex items-center justify-center font-bold text-sm border border-trade-primary/20">
                                  {trimmed.split('.')[0]}
                              </span>
                               <span className="text-slate-300 flex-1" dangerouslySetInnerHTML={{ 
                                  __html: trimmed.replace(/^\d\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>') 
                                }} />
                          </div>
                      )
                  }
                  
                  if (trimmed === '') return <div key={i} className="h-4"></div>;
                  
                  return (
                    <p key={i} className="text-slate-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ 
                      __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>') 
                    }} />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrategyBuilder;
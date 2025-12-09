import React, { useState } from 'react';
import { AnalysisRequest } from '../types';
import { Search, Loader2, Zap } from 'lucide-react';

interface Props {
  onSubmit: (data: AnalysisRequest) => void;
  isLoading: boolean;
}

const AnalystForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<AnalysisRequest>({
    symbol: '',
    timeframe: '4h',
    balance: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Zap className="text-blue-500" size={100} />
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Target Asset
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Symbol</label>
            <input
                name="symbol"
                required
                placeholder="BTC/USDT"
                className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded focus:ring-1 focus:ring-blue-500 outline-none uppercase font-mono placeholder:normal-case text-lg"
                value={formData.symbol}
                onChange={handleChange}
            />
            </div>
            <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Timeframe</label>
            <select
                name="timeframe"
                className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded focus:ring-1 focus:ring-blue-500 outline-none font-mono h-[54px]"
                value={formData.timeframe}
                onChange={handleChange}
            >
                <option value="15m">15 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="4h">4 Hours</option>
                <option value="1d">1 Day</option>
                <option value="1w">1 Week</option>
            </select>
            </div>
        </div>
      </div>

      <div className="mb-6">
         <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Risk Parameters
         </h3>
         <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Account Balance (Optional)</label>
            <input
                name="balance"
                placeholder="$10,000"
                className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                value={formData.balance}
                onChange={handleChange}
            />
            <p className="text-[10px] text-slate-500 mt-1">Used to calculate specific position sizing suggestions.</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <Search size={18} />}
        {isLoading ? 'SEARCHING MARKET DATA...' : 'AUTO-ANALYZE MARKET'}
      </button>
      
      <div className="mt-4 text-center">
        <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
            <Zap size={10} className="text-amber-400" />
            AI autonomously retrieves real-time prices & indicators
        </p>
      </div>
    </form>
  );
};

export default AnalystForm;
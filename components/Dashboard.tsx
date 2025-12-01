import React from 'react';
import { BookOpen, TrendingUp, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { AppMode } from '../types';

interface DashboardProps {
  onNavigate: (mode: AppMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-gray-800">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">EagleNova</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            The professional offline trading suite. Master the markets with precision strategies, visualized patterns, and AI-simulated training.
          </p>
        </div>
        <div className="hidden md:block">
          <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20">
            SYSTEM ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => onNavigate(AppMode.PATTERNS)}
          className="group relative overflow-hidden bg-trade-surface p-8 rounded-2xl border border-gray-700 hover:border-amber-500/50 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-32 h-32" />
          </div>
          <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Pattern Recognition</h3>
          <p className="text-slate-400 mb-6">High-fidelity simulations of Bullish, Bearish, and Reversal structures with precise entry/exit points.</p>
          <span className="text-blue-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
            View Patterns <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        <div 
          onClick={() => onNavigate(AppMode.STRATEGIES)}
          className="group relative overflow-hidden bg-trade-surface p-8 rounded-2xl border border-gray-700 hover:border-emerald-500/50 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="w-32 h-32" />
          </div>
          <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Strategy Vault</h3>
          <p className="text-slate-400 mb-6">Comprehensive guides on Scalping, Swing Trading, and Position Trading including risk protocols.</p>
          <span className="text-emerald-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
            Open Vault <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        <div 
          onClick={() => onNavigate(AppMode.QUIZ)}
          className="group relative overflow-hidden bg-trade-surface p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-32 h-32" />
          </div>
          <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Training Arena</h3>
          <p className="text-slate-400 mb-6">Test your skills with randomized quizzes. Track your score and identify knowledge gaps.</p>
          <span className="text-purple-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
            Start Training <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        <div 
          onClick={() => onNavigate(AppMode.TUTOR)}
          className="group relative overflow-hidden bg-trade-surface p-8 rounded-2xl border border-gray-700 hover:border-amber-500/50 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookOpen className="w-32 h-32" />
          </div>
          <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">EagleNova Mentor</h3>
          <p className="text-slate-400 mb-6">Simulated AI guidance for quick answers on common trading questions and psychology.</p>
          <span className="text-amber-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
            Chat Now <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

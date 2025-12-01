import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BookOpen, 
  GraduationCap, 
  MessageSquare, 
  Menu,
  X,
  CandlestickChart
} from 'lucide-react';
import { AppMode } from '../types';

interface LayoutProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentMode, onModeChange, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { mode: AppMode.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { mode: AppMode.PATTERNS, label: 'Eagle Patterns', icon: TrendingUp },
    { mode: AppMode.STRATEGIES, label: 'Pro Strategies', icon: CandlestickChart },
    { mode: AppMode.QUIZ, label: 'Training Arena', icon: GraduationCap },
    { mode: AppMode.TUTOR, label: 'Nova Mentor', icon: MessageSquare },
  ];

  const handleNavClick = (mode: AppMode) => {
    onModeChange(mode);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-trade-dark flex text-trade-text font-sans selection:bg-trade-primary selection:text-white">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-trade-surface border-b border-gray-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-trade-primary">
          <TrendingUp className="w-6 h-6" />
          EagleNova
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300 hover:text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-trade-surface border-r border-gray-800 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center px-6 border-b border-gray-800">
            <div className="flex items-center gap-2 font-bold text-xl text-white">
              <TrendingUp className="w-8 h-8 text-trade-primary" />
              <span>Eagle<span className="text-trade-primary">Nova</span></span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-2 px-3">
              {navItems.map((item) => (
                <li key={item.mode}>
                  <button
                    onClick={() => handleNavClick(item.mode)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentMode === item.mode 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${currentMode === item.mode ? 'text-white' : 'text-slate-500'}`} />
                    <span className="font-medium tracking-wide">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="bg-gray-900/50 rounded-lg p-4 text-xs text-slate-400 border border-gray-700">
              <p className="font-bold text-trade-primary mb-1 flex items-center gap-1">
                <CandlestickChart className="w-3 h-3" /> 
                Market Tip
              </p>
              "Plan the trade, trade the plan."
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-16 lg:pt-0 min-h-screen overflow-y-auto bg-gradient-to-br from-trade-dark to-gray-900">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
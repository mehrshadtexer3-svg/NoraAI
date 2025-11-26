import React from 'react';
import { AgentConfig, ModelId } from '../types';
import { Settings, Cpu, Globe, MessageSquare, Radio } from 'lucide-react';

interface SettingsPanelProps {
  config: AgentConfig;
  setConfig: React.Dispatch<React.SetStateAction<AgentConfig>>;
  activeMode: 'chat' | 'live';
  onModeChange: (mode: 'chat' | 'live') => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, setConfig, activeMode, onModeChange }) => {
  return (
    <div className="w-full h-full bg-slate-900 border-r border-slate-700 p-4 flex flex-col gap-6 overflow-y-auto text-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          OmniAgent
        </h1>
      </div>

      {/* Mode Selector */}
      <div className="bg-slate-800 rounded-lg p-1 flex">
        <button
          onClick={() => onModeChange('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
            activeMode === 'chat' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare size={16} /> Chat
        </button>
        <button
          onClick={() => onModeChange('live')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
            activeMode === 'live' ? 'bg-red-900/40 text-red-200 shadow-sm border border-red-900/50' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio size={16} /> Live
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-400 uppercase text-xs font-semibold tracking-wider">
          <Settings size={14} /> Configuration
        </div>

        {/* Model Select */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Model</label>
          <select
            value={config.model}
            onChange={(e) => setConfig({ ...config, model: e.target.value as ModelId })}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={activeMode === 'live'} // Live mode is fixed to specific model
          >
            <option value={ModelId.GEMINI_2_5_FLASH}>Gemini 2.5 Flash</option>
            <option value={ModelId.GEMINI_3_PRO}>Gemini 3.0 Pro</option>
          </select>
          {activeMode === 'live' && (
            <p className="text-xs text-slate-500">Live mode uses Gemini 2.5 Flash Native Audio.</p>
          )}
        </div>

        {/* System Instruction */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">System Instruction</label>
          <textarea
            value={config.systemInstruction}
            onChange={(e) => setConfig({ ...config, systemInstruction: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="How should the agent behave?"
          />
        </div>

        {activeMode === 'chat' && (
          <>
            {/* Grounding Toggle */}
            <div className="flex items-center justify-between bg-slate-800 p-3 rounded-md border border-slate-700">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-blue-400" />
                <span className="text-sm font-medium">Google Search</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.useGrounding}
                  onChange={(e) => setConfig({ ...config, useGrounding: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

             {/* Thinking Budget (Only for Pro) */}
             {config.model === ModelId.GEMINI_3_PRO && (
               <div className="space-y-2 pt-2 border-t border-slate-700">
                 <div className="flex justify-between">
                    <label className="text-sm font-medium text-slate-300">Thinking Budget</label>
                    <span className="text-xs text-slate-400">{config.thinkingBudget} tokens</span>
                 </div>
                 <input 
                    type="range" 
                    min="0" 
                    max="16000" 
                    step="1024"
                    value={config.thinkingBudget}
                    onChange={(e) => setConfig({...config, thinkingBudget: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
                 <p className="text-xs text-slate-500">Enable deep reasoning (Gemini 3.0 Pro only).</p>
               </div>
             )}
          </>
        )}
      </div>

      <div className="mt-auto text-xs text-slate-600 text-center">
        Powered by Gemini API
      </div>
    </div>
  );
};

export default SettingsPanel;

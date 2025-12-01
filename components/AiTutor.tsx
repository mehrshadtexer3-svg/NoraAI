import React, { useState, useRef, useEffect } from 'react';
import { chatWithTutor } from '../services/geminiService';
import { Message } from '../types';
import { Send, User, Bot, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const AiTutor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "**EagleNova System Online.**\n\nI am your dedicated Trading Mentor. I do not rely on external servers. My knowledge base includes:\n\n*   Institutional Price Action\n*   Advanced Risk Management\n*   Chart Pattern Recognition\n\nAsk me a specific question like *'What is a Bear Flag?'* or *'How do I calculate position size?'*",
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const responseText = await chatWithTutor(history, userMsg.content);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (text: string) => {
    // Simple markdown parser for bolding and lists
    return text.split('\n').map((line, i) => {
      if (line.trim().startsWith('*   ')) {
        return (
          <li key={i} className="ml-4 list-disc pl-2 mb-1" dangerouslySetInnerHTML={{
             __html: line.replace('*   ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }} />
        );
      }
      if (line.trim().match(/^\d\./)) {
         return (
          <div key={i} className="mb-2 ml-2" dangerouslySetInnerHTML={{
             __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }} />
        );
      }
      if (line === '') return <div key={i} className="h-2" />;
      return (
        <p key={i} className="mb-1" dangerouslySetInnerHTML={{
          __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>').replace(/`(.*?)`/g, '<code class="bg-black/30 px-1 rounded font-mono text-amber-400">$1</code>')
        }} />
      );
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-trade-surface rounded-2xl border border-gray-700 overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="bg-gray-900/90 p-4 border-b border-gray-800 flex items-center justify-between backdrop-blur-sm absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Nova Mentor</h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">System Online</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg border border-gray-700 text-xs text-slate-400">
          <AlertCircle className="w-3 h-3" />
          <span>Offline Knowledge Engine</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 pt-24 space-y-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-trade-surface to-trade-dark">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg ring-2 ring-offset-2 ring-offset-trade-surface ${
              msg.role === 'user' ? 'bg-indigo-600 ring-indigo-600' : 'bg-trade-primary ring-trade-primary'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            
            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 shadow-xl ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-gray-800 text-slate-200 border border-gray-700 rounded-tl-sm'
            }`}>
              <div className="text-sm md:text-base leading-relaxed">
                {renderMessageContent(msg.content)}
              </div>
              <span className={`text-[10px] mt-2 block font-mono text-right opacity-50`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-trade-primary flex items-center justify-center flex-shrink-0">
               <Loader2 className="w-4 h-4 animate-spin text-white" />
            </div>
            <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-700 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-trade-primary focus:border-transparent transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-trade-primary hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 font-bold transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center transform active:scale-95 w-14 md:w-auto"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiTutor;

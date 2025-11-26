import React, { useState, useRef, useEffect } from 'react';
import { AgentConfig, ModelId, ChatMessage, Role } from './types';
import { DEFAULT_CONFIG, SAMPLE_PROMPTS } from './constants';
import SettingsPanel from './components/SettingsPanel';
import ChatMessageItem from './components/ChatMessageItem';
import AudioVisualizer from './components/AudioVisualizer';
import { createChatSession, sendMessageStream, extractGrounding } from './services/geminiService';
import { useLiveSession } from './hooks/useLiveSession';
import { Send, Image as ImageIcon, X, Mic, MicOff, PhoneOff, AlertTriangle, Loader2 } from 'lucide-react';
import { Chat } from '@google/genai';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'chat' | 'live'>('chat');
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_CONFIG);
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImages, setAttachedImages] = useState<string[]>([]); // Base64
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live State
  const liveSession = useLiveSession(config.systemInstruction);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle standard chat submission
  const handleSendMessage = async () => {
    if ((!input.trim() && attachedImages.length === 0) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: Role.USER,
      text: input,
      images: attachedImages
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedImages([]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession(config);
      }

      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: Role.MODEL,
        text: '',
        isThinking: true
      }]);

      const stream = await sendMessageStream(
        chatSessionRef.current, 
        userMsg.text, 
        userMsg.images
      );

      let fullText = '';
      let groundingData = undefined;

      for await (const chunk of stream) {
        // Check for grounding in any chunk
        const grounding = extractGrounding(chunk);
        if (grounding) groundingData = grounding;

        // Check for text
        if (chunk.text) {
           fullText += chunk.text;
           setMessages(prev => prev.map(m => 
             m.id === modelMsgId 
               ? { ...m, text: fullText, isThinking: false, groundingMetadata: groundingData } 
               : m
           ));
        }
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: Role.SYSTEM,
        text: `Error: ${error.message || 'Failed to generate response'}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setAttachedImages([evt.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearChat = () => {
      setMessages([]);
      chatSessionRef.current = null;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 hidden md:block">
        <SettingsPanel 
           config={config} 
           setConfig={setConfig} 
           activeMode={activeMode} 
           onModeChange={(mode) => {
             setActiveMode(mode);
             // Reset session logic if needed when switching
           }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
            <span className="font-bold text-white">OmniAgent</span>
            <div className="flex gap-2">
                 <button onClick={() => setActiveMode('chat')} className={`p-2 rounded ${activeMode === 'chat' ? 'bg-blue-600' : 'bg-slate-700'}`}>Chat</button>
                 <button onClick={() => setActiveMode('live')} className={`p-2 rounded ${activeMode === 'live' ? 'bg-red-600' : 'bg-slate-700'}`}>Live</button>
            </div>
        </div>

        {activeMode === 'chat' ? (
          // CHAT MODE
          <>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2">
               {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-6">
                      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-slate-700">
                          <span className="text-4xl">✨</span>
                      </div>
                      <h2 className="text-2xl font-semibold text-slate-300">How can I help you today?</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                         {SAMPLE_PROMPTS.map((prompt, i) => (
                           <button 
                             key={i}
                             onClick={() => setInput(prompt)}
                             className="p-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded-xl text-left transition-all text-sm text-slate-400 hover:text-slate-200"
                           >
                             {prompt}
                           </button>
                         ))}
                      </div>
                  </div>
               ) : (
                 <div className="max-w-4xl mx-auto space-y-6">
                   {messages.map(m => <ChatMessageItem key={m.id} message={m} />)}
                   <div ref={messagesEndRef} />
                 </div>
               )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-950 border-t border-slate-800">
              <div className="max-w-4xl mx-auto relative">
                {attachedImages.length > 0 && (
                   <div className="absolute bottom-full left-0 mb-2 flex gap-2">
                      {attachedImages.map((img, i) => (
                        <div key={i} className="relative group">
                          <img src={img} className="h-16 w-16 rounded-md object-cover border border-slate-700" alt="upload" />
                          <button 
                            onClick={() => setAttachedImages([])}
                            className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                   </div>
                )}
                
                <div className="flex items-end gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                     title="Attach Image"
                   >
                     <ImageIcon size={20} />
                   </button>
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     className="hidden" 
                     accept="image/*" 
                     onChange={handleFileSelect}
                   />
                   
                   <textarea
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyDown={(e) => {
                       if(e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         handleSendMessage();
                       }
                     }}
                     placeholder="Type a message..."
                     className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 resize-none max-h-32 py-2"
                     rows={1}
                   />
                   
                   <button
                     onClick={handleSendMessage}
                     disabled={isLoading || (!input.trim() && attachedImages.length === 0)}
                     className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   >
                     {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20} />}
                   </button>
                </div>
                <div className="text-center mt-2">
                   <button onClick={clearChat} className="text-xs text-slate-600 hover:text-slate-400">Clear Context</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          // LIVE MODE
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
             {/* Background Ambience */}
             <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
             </div>

             <div className="z-10 flex flex-col items-center gap-8 max-w-md w-full">
                <div className="text-center space-y-2">
                   <h2 className="text-3xl font-bold text-slate-100">Gemini Live</h2>
                   <p className="text-slate-400">Real-time voice interaction</p>
                </div>

                <div className="relative w-full aspect-square max-w-[300px] flex items-center justify-center">
                   {liveSession.status === 'connected' ? (
                      <AudioVisualizer volume={liveSession.volume} isActive={true} />
                   ) : (
                      <div className="w-40 h-40 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center shadow-2xl">
                          <MicOff size={48} className="text-slate-500" />
                      </div>
                   )}
                </div>

                <div className="flex flex-col items-center gap-4 w-full">
                    {liveSession.status === 'error' && (
                       <div className="flex items-center gap-2 text-red-400 bg-red-900/20 px-4 py-2 rounded-lg border border-red-900/50">
                          <AlertTriangle size={18} />
                          <span>Connection Error. Check console/permissions.</span>
                       </div>
                    )}
                    
                    {liveSession.status === 'connected' ? (
                       <button
                         onClick={liveSession.disconnect}
                         className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-lg shadow-red-900/50 transition-all hover:scale-105"
                       >
                         <PhoneOff size={24} /> End Session
                       </button>
                    ) : (
                       <button
                         onClick={liveSession.connect}
                         disabled={liveSession.status === 'connecting'}
                         className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-900/50 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
                       >
                         {liveSession.status === 'connecting' ? (
                            <Loader2 size={24} className="animate-spin" />
                         ) : (
                            <Mic size={24} />
                         )}
                         {liveSession.status === 'connecting' ? 'Connecting...' : 'Start Conversation'}
                       </button>
                    )}
                </div>
                
                {/* Debug Logs for Live Mode */}
                <div className="w-full h-32 bg-slate-900/50 rounded-lg p-2 overflow-hidden text-xs font-mono text-slate-500 border border-slate-800/50">
                   {liveSession.logs.map((log, i) => (
                      <div key={i}>{'>'} {log}</div>
                   ))}
                   {liveSession.logs.length === 0 && <div className="italic opacity-50">System logs...</div>}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
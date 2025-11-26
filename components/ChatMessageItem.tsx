import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, Role } from '../types';
import { User, Bot, Globe, Loader2 } from 'lucide-react';

interface Props {
  message: ChatMessage;
}

const ChatMessageItem: React.FC<Props> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full gap-4 p-4 ${isUser ? 'bg-slate-800/50' : 'bg-transparent'}`}>
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <User size={16} className="text-slate-300" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-slate-200">
            {isUser ? 'You' : 'OmniAgent'}
          </span>
          {message.isThinking && (
             <span className="text-xs text-blue-400 flex items-center gap-1 animate-pulse">
                <Loader2 size={10} className="animate-spin"/> Thinking...
             </span>
          )}
        </div>

        {/* Images */}
        {message.images && message.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {message.images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt="Attachment" 
                className="max-h-48 rounded-md border border-slate-700 object-contain" 
              />
            ))}
          </div>
        )}

        {/* Text Content */}
        <div className="prose prose-invert prose-sm max-w-none text-slate-300">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>

        {/* Grounding Sources */}
        {message.groundingMetadata?.webSources && (
          <div className="mt-4 flex flex-col gap-2 p-3 bg-slate-800/80 rounded-md border border-slate-700/50">
             <div className="flex items-center gap-2 text-xs text-blue-400 uppercase font-bold tracking-wider">
                <Globe size={12} /> Sources
             </div>
             <div className="grid gap-2">
                {message.groundingMetadata.webSources.map((source, i) => (
                   <a 
                     key={i} 
                     href={source.uri} 
                     target="_blank" 
                     rel="noreferrer"
                     className="text-xs text-slate-400 hover:text-blue-300 truncate transition-colors flex items-center gap-2"
                   >
                     <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
                     {source.title}
                   </a>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;

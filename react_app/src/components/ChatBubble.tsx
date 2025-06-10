/* components/ChatBubble.tsx */
//import { Send, User, Bot, Sparkles } from 'lucide-react';
import { User, Bot } from 'lucide-react';

type ChatBubbleProps = { role: string; content: string };

const ChatBubble = ({ role, content }: ChatBubbleProps) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg' 
          : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg'
      }`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      
      {/* Message bubble */}
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`relative px-5 py-3 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white ml-4' 
            : 'bg-white text-gray-800 border border-gray-100 mr-4'
        }`}>
          {/* Message content */}
          <p className="text-sm leading-relaxed">{content}</p>
          
          {/* Tail for speech bubble effect */}
          <div className={`absolute top-4 w-3 h-3 transform rotate-45 ${
            isUser 
              ? '-left-1.5 bg-gradient-to-br from-blue-500 to-indigo-600' 
              : '-right-1.5 bg-white border-r border-b border-gray-100'
          }`} />
        </div>
        
        {/* Timestamp */}
        <span className={`text-xs text-gray-400 mt-1 px-2 ${
          isUser ? 'text-right' : 'text-left'
        }`}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;

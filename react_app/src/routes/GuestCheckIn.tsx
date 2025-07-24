import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import itemLogo from '../assets/item.svg';  // adjust path relative to GuestCheckIn.tsx


// Define types for better TypeScript support
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

interface APIResponse {
  role: 'assistant';
  content: string;
  has_error?: boolean;
  error_message?: string;
  checkin_complete?: boolean;
  data?: any;
}

interface ErrorModal {
  visible: boolean;
  message: string;
}

// ChatBubble Component with Item.com design
const ChatBubble = ({ role, content }: ChatBubbleProps) => {
  const isUser = role === 'user';
 
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-8`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center ${
        isUser
          ? 'bg-gradient-to-br from-purple-600 to-violet-700 text-white shadow-lg border border-purple-200'
          : 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg border border-indigo-200'
      }`}>
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
     
      {/* Message bubble */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`relative px-6 py-4 rounded-3xl shadow-sm border transition-all duration-200 ${
          isUser
            ? 'bg-gradient-to-br from-purple-600 to-violet-700 text-white border-purple-200 ml-4'
            : 'bg-white text-gray-900 border-gray-100 mr-4 hover:shadow-md'
        }`}>
          {/* Message content */}
          <p className="text-sm leading-relaxed font-medium">{content}</p>
        </div>
       
        {/* Timestamp */}
        <span className={`text-xs text-gray-400 mt-2 px-3 font-medium ${
          isUser ? 'text-right' : 'text-left'
        }`}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

const GuestCheckIn = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome! I'm here to help you check in. What is your name?" }
  ]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [errorModal, setErrorModal] = useState<ErrorModal>({ visible: false, message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMsgs = [...messages, userMessage];
    setMessages(newMsgs);
    setInput('');
    setIsTyping(true);

    try {
      // Simulated API call - replace with your actual endpoint
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs }),
      });


      const data: APIResponse = await res.json();

      setMessages([...newMsgs, { role: data.role, content: data.content }]);
      setIsTyping(false);

      if (data.has_error) {
        setMessages([
          ...newMsgs,
          {
            role: 'assistant',
            content: `⚠️ There was a problem: ${data.error_message}`,
          },
        ]);

        setErrorModal({
          visible: true,
          message: data.error_message || 'An unknown error occurred.',
        });

        setIsTyping(false);
        return;
      }

      if (data.checkin_complete && data.data) {
        setTimeout(() => {
          navigate('/camera', { state: {
            visitor_name: data.data.visitor_name,
            visitor_phone: data.data.visitor_phone,
            host_employee: data.data.host_employee,
            employee_name: data.data.employee_name,
            employee_email: data.data.employee_email,
            location_id: data.data.location_id,
      }});
          console.log('Navigation would occur here with:', data.data);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: '❌ Network error. Please try again shortly.',
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 flex flex-col h-[88vh] overflow-hidden">
        {/* Header */}
        <header className="relative px-8 py-8 text-white" style={{ backgroundColor: '#000000' }}>
          <div className="flex items-center justify-center space-x-4">
            <div className="p-3">
              <img src={itemLogo} alt="Item Logo" width={58} height={58} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">Guest Check-In</h1>
              <p className="text-indigo-100 text-sm font-medium mt-1">Powered by AI Assistant</p>
            </div>
          </div>
          
          {/* Geometric decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/8 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute top-4 right-8 w-6 h-6 bg-orchid-400/60 rounded-lg rotate-12" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/8 rounded-full translate-y-16 -translate-x-16" />
          <div className="absolute bottom-4 left-8 w-4 h-4 bg-iris-400/60 rounded-full" />
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-8 py-8 bg-gradient-to-b from-gray-50/30 to-white/60">
          <div className="space-y-2">
            {messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} content={msg.content} />
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-4 mb-8">
                <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg border border-indigo-200 flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div className="bg-white text-gray-900 border border-gray-100 rounded-3xl px-6 py-4 shadow-sm mr-4">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <footer className="px-8 py-6 bg-white/95 backdrop-blur-sm border-t border-gray-100">
          <div className="flex items-end gap-4">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
                rows={1}
                className="w-full resize-none rounded-2xl border-2 border-gray-200 px-5 py-4 pr-14 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm transition-all duration-200 bg-white/90 backdrop-blur-sm hover:border-gray-300"
                style={{ 
                  minHeight: '56px',
                  maxHeight: '120px'
                }}
              />
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 disabled:from-gray-300 disabled:to-gray-400 disabled:border-gray-200 text-white rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 border-2 border-purple-500/20"
            >
              <Send size={20} />
            </button>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center space-x-3 text-sm text-gray-600 font-medium">
              <div className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-pulse" />
              <span>AI Assistant is online</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Error Modal */}
      {errorModal.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-md p-8 rounded-3xl shadow-2xl text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.304 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Check-In Failed</h2>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{errorModal.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-700 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-violet-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestCheckIn;
import { useState, useRef, useEffect } from 'react';
//import { Send, User, Bot, Sparkles } from 'lucide-react';
import { Send, Bot, Sparkles } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import { useNavigate } from 'react-router-dom';


const GuestCheckIn = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Welcome! I'm here to help you check in. What is your name?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  //const chatEndRef = useRef(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [errorModal, setErrorModal] = useState({ visible: false, message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { role: 'user', content: input };
  const newMsgs = [...messages, userMessage];
  setMessages(newMsgs);
  setInput('');
  setIsTyping(true);

  try {
    const res = await fetch('http://192.168.162.183:8080/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMsgs }),
    });

    const data = await res.json();

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
        navigate('/camera', {
          state: {
            name: data.data.visitor_name,
            phone: data.data.visitor_phone,
            email: data.data.visitor_email,
            host_employee: data.data.host_employee,
            estimate_time: data.data.estimate_time,
            location_id: data.data.location_id,
          },
        });
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


  const handleKeyPress = (e : any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 flex flex-col h-[85vh] overflow-hidden">
        {/* Header */}
        <header className="relative px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">Guest Check-In</h1>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-b from-gray-50/50 to-white/50">
          <div className="space-y-1">
            {messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} content={msg.content} />
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-3 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div className="bg-white text-gray-800 border border-gray-100 rounded-2xl px-5 py-3 shadow-sm mr-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <footer className="px-6 py-4 bg-white/90 backdrop-blur-sm border-t border-gray-100">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
                rows={1}
                className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 bg-white/80 backdrop-blur-sm"
                style={{ 
                  minHeight: '48px',
                  maxHeight: '120px'
                }}
              />
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center justify-center mt-3">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>AI Assistant is online</span>
            </div>
          </div>
        </footer>
      </div>

            {errorModal.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-sm p-6 rounded-xl shadow-2xl text-center">
            <h2 className="text-lg font-bold text-red-600 mb-2">Check-In Failed</h2>
            <p className="text-sm text-gray-700 mb-4">{errorModal.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default GuestCheckIn;
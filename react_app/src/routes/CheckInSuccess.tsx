import { useEffect, useState } from 'react';
import { CheckCircle, Mail, User, Calendar, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import itemLogo from '../assets/item.svg';  // adjust path relative to GuestCheckIn.tsx

const CheckInSuccess = () => {
  const [showNotification, setShowNotification] = useState(false);
  const location = useLocation();
  const name = location.state?.name || 'Guest User';

  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });


  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-20 w-24 h-24 bg-purple-100 rounded-full opacity-40"
          style={{
            animation: 'float 4s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute top-1/4 right-16 w-20 h-20 bg-orange-100 rounded-full opacity-40"
          style={{
            animation: 'float 4s ease-in-out infinite',
            animationDelay: '-1s'
          }}
        />
        <div 
          className="absolute bottom-32 left-1/3 w-32 h-32 bg-purple-50 rounded-full opacity-30"
          style={{
            animation: 'float 4s ease-in-out infinite',
            animationDelay: '-2s'
          }}
        />
      </div>

      <div className="w-full max-w-3xl mx-auto relative z-10">
        
        {/* Notification */}
        {showNotification && (
          <div 
            className="mb-6"
            style={{
              animation: 'slideDown 0.6s ease-out'
            }}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mx-auto w-full max-w-md">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black">Notification Sent!</h3>
                  <p className="text-gray-600 mt-1">
                    We have emailed the employee that you have arrived.
                  </p>
                </div>
                <div 
                  style={{
                    animation: 'pulse 2s infinite'
                  }}
                >
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <header className="relative px-6 sm:px-8 py-8 bg-white border-b border-gray-100">
            <div className="text-center">
              <div className="inline-flex items-center justify-center">
                <img src={itemLogo} alt="Item Logo" width={58} height={58} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-black mb-2">Welcome to Our Office</h1>
              <p className="text-gray-600">Your check-in has been completed successfully</p>
            </div>
          </header>

          {/* Body */}
          <div className="px-6 sm:px-8 py-10 sm:py-12">

            {/* Success Icon + Title */}
            <div className="text-center mb-10">
              <div 
                className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-purple-600 rounded-full mb-6 shadow-lg"
                style={{
                  animation: 'bounceGentle 2s infinite'
                }}
              >
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">Check-in Successful!</h2>
              <p className="text-lg sm:text-xl text-gray-600">Welcome! You're all set and ready to go.</p>
            </div>

            {/* Visitor Info */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100 mb-8">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-white" />
                </div>
                Visitor Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Visitor Name</p>
                    <p className="font-semibold text-black">{name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-semibold text-black">{currentTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-purple-50 rounded-xl p-4 sm:p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
                <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                What's Next?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Please wait outside until your host comes to greet you.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Your host has been notified and will be with you shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-center mt-10">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
              >
                Check in Another Guest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceGentle {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckInSuccess;

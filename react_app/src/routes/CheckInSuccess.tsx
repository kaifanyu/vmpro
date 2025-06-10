import { useEffect, useState } from 'react';
import { CheckCircle, Mail, User, Calendar, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Notification */}
        {showNotification && (
          <div className="mb-6 animate-slide-down">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 mx-auto w-full max-w-md">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Notification Sent!</h3>
                  <p className="text-gray-600 mt-1">
                    We have emailed the employee that you have arrived.
                  </p>
                </div>
                <div className="animate-pulse">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          
          {/* Header */}
          <header className="relative px-6 sm:px-8 py-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16" />
            <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-white/10 rounded-full translate-y-10 sm:translate-y-12 -translate-x-10 sm:-translate-x-12" />
          </header>

          {/* Body */}
          <div className="px-6 sm:px-8 py-10 sm:py-12">

            {/* Success Icon + Title */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-6 shadow-xl animate-bounce-gentle">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Check-in Successful!</h1>
              <p className="text-lg sm:text-xl text-gray-600">Welcome! You're all set and ready to go.</p>
            </div>

            {/* Visitor Info */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 sm:p-6 shadow-inner border border-gray-100 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-emerald-600" />
                Visitor Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Visitor Name</p>
                    <p className="font-semibold text-gray-900">{name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-semibold text-gray-900">{currentTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                What's Next?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Please wait outside until your host comes to greet you.
                  </p>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-center mt-10">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Check in Another Guest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-gentle {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        .animate-bounce-gentle { animation: bounce-gentle 2s infinite; }
      `}</style>
    </div>
  );
};

export default CheckInSuccess;

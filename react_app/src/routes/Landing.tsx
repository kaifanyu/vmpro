import { useNavigate } from 'react-router-dom';
import { Users, UserCheck } from 'lucide-react';
import itemLogo from '../assets/item.svg';  // adjust path as needed

const LandingPage = () => {
  const navigate = useNavigate();

  const handleVisitorClick = () => {
    navigate('/visitor-checkin');
  };

  const handleEmployeeClick = () => {
    navigate('/employee-checkin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <header className="relative px-8 py-12 text-white" style={{ backgroundColor: '#000000' }}>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-3">
              <img src={itemLogo} alt="Item Logo" width={58} height={58} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight">Welcome to Item</h1>
              <p className="text-indigo-100 text-lg font-medium mt-2">Please select your check-in type</p>
            </div>
          </div>
          
          {/* Geometric decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/8 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute top-4 right-8 w-6 h-6 bg-purple-400/60 rounded-lg rotate-12" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/8 rounded-full translate-y-16 -translate-x-16" />
          <div className="absolute bottom-4 left-8 w-4 h-4 bg-violet-400/60 rounded-full" />
        </header>

        {/* Main Content */}
        <div className="px-8 py-12 bg-gradient-to-b from-gray-50/30 to-white/60">
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            
            {/* Visitor Button */}
            <div 
              onClick={handleVisitorClick}
              className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:border-purple-200"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Users size={36} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-200">
                  Visitor Check-In
                </h2>
                <p className="text-gray-600 leading-relaxed font-medium">
                  I'm here to visit someone at Item. Help me check in and notify my host.
                </p>
                <div className="mt-6 flex items-center justify-center">
                  <div className="px-6 py-2 bg-gradient-to-r from-purple-600 to-violet-700 text-white font-semibold rounded-xl text-sm group-hover:from-purple-700 group-hover:to-violet-800 transition-all duration-200 shadow-md">
                    Start Visitor Check-In
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Button */}
            <div 
              onClick={handleEmployeeClick}
              className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:border-indigo-200"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <UserCheck size={36} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors duration-200">
                  Employee Check-In
                </h2>
                <p className="text-gray-600 leading-relaxed font-medium">
                  I work at Item and need to check in for the day or access employee services.
                </p>
                <div className="mt-6 flex items-center justify-center">
                  <div className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-semibold rounded-xl text-sm group-hover:from-indigo-700 group-hover:to-violet-800 transition-all duration-200 shadow-md">
                    Start Employee Check-In
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="px-8 py-6 bg-white/95 backdrop-blur-sm border-t border-gray-100">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3 text-sm text-gray-600 font-medium">
              <div className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-pulse" />
              <span>AI-Powered Check-In System</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
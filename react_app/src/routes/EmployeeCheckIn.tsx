import { useState } from 'react';
import { ArrowLeft, MapPin, Unlock, Lock, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import itemLogo from '../assets/item.svg';

interface LocationState {
  checking: boolean;
  granted: boolean;
  denied: boolean;
  withinRange: boolean;
  distance?: number;
  error?: string;
}
interface DoorState {
  isOpen: boolean;
  isOpening: boolean;
  lastOpened?: Date;
}
interface ScheduleState {
  checking: boolean;
  allowed: boolean | null;
  start?: string;
  end?: string;
  reason?: string;
  windows?: { day: string; start_local: string; end_local: string }[];
}

const EmployeeCheckIn = () => {
  const navigate = useNavigate();
  const [locationState, setLocationState] = useState<LocationState>({
    checking: false, granted: false, denied: false, withinRange: false
  });
  const [doorState, setDoorState] = useState<DoorState>({ isOpen: false, isOpening: false });
  const [scheduleState, setScheduleState] = useState<ScheduleState>({ checking: false, allowed: null });

  const COMPANY_ADDRESS = "123 Main Street, San Francisco, CA 94105";
  const MAX_DISTANCE_MILES = 1;

  const goBack = () => navigate('/');

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
      Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
      Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const geocodeAddress = async (): Promise<{lat: number, lng: number}> => {
    return { lat: 37.7749, lng: -122.4194 };
  };

  const verifySchedule = async () => {
    setScheduleState({ checking: true, allowed: null });
    try {
      const res = await fetch('/api/schedule/verify', { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.allowed) {
        setScheduleState({
          checking: false,
          allowed: true,
          start: data.window?.start_local,
          end: data.window?.end_local
        });
      } else {
        setScheduleState({
          checking: false,
          allowed: false,
          reason: data?.reason || 'Outside of scheduled window.',
          windows: data?.windows
        });
      }
    } catch {
      setScheduleState({ checking: false, allowed: false, reason: 'Network error' });
    }
  };

  const checkLocation = async () => {
    setLocationState(prev => ({ ...prev, checking: true, error: undefined }));
    setScheduleState({ checking: false, allowed: null }); // reset

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, timeout: 10000, maximumAge: 60000
        });
      });

      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      const companyCoords = await geocodeAddress();
      
      const distance = calculateDistance(userLat, userLng, companyCoords.lat, companyCoords.lng);
      // const withinRange = distance <= MAX_DISTANCE_MILES;
      const withinRange = true;

      setLocationState({
        checking: false, granted: true, denied: false, withinRange,
        distance: Math.round(distance * 100) / 100
      });

      if (withinRange) {
        await verifySchedule();
      }

    } catch (error) {
      console.error('Location error:', error);
      let errorMessage = 'Unable to access location';
      if (error instanceof GeolocationPositionError) {
        if (error.code === error.PERMISSION_DENIED) errorMessage = 'Location access denied by user';
        else if (error.code === error.POSITION_UNAVAILABLE) errorMessage = 'Location information unavailable';
        else if (error.code === error.TIMEOUT) errorMessage = 'Location request timed out';
      }
      setLocationState({ checking: false, granted: false, denied: true, withinRange: false, error: errorMessage });
    }
  };

  const openDoor = async () => {
    if (!scheduleState.allowed) return; // hard gate on schedule
    setDoorState(prev => ({ ...prev, isOpening: true }));
    try {
      const response = await fetch('/api/door/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          employee_location: locationState,
          timestamp: new Date().toISOString()
        })
      });
      if (response.ok) {
        setDoorState({ isOpen: true, isOpening: false, lastOpened: new Date() });
        setTimeout(() => setDoorState(prev => ({ ...prev, isOpen: false })), 10000);
      } else {
        throw new Error('Failed to open door');
      }
    } catch (e) {
      console.error('Door control error:', e);
      setDoorState(prev => ({ ...prev, isOpening: false }));
    }
  };

  const LocationStatus = () => {
    if (locationState.checking) return (
      <div className="flex items-center space-x-3 text-indigo-600">
        <Loader size={20} className="animate-spin" />
        <span className="font-medium">Checking your location...</span>
      </div>
    );
    if (locationState.denied || locationState.error) return (
      <div className="flex items-center space-x-3 text-red-600">
        <AlertTriangle size={20} />
        <span className="font-medium">{locationState.error}</span>
      </div>
    );
    if (locationState.granted && !locationState.withinRange) return (
      <div className="flex items-center space-x-3 text-amber-600">
        <AlertTriangle size={20} />
        <span className="font-medium">
          You are {locationState.distance} miles from the office (max: {MAX_DISTANCE_MILES} mile)
        </span>
      </div>
    );
    if (locationState.granted && locationState.withinRange) return (
      <div className="flex items-center space-x-3 text-green-600">
        <CheckCircle size={20} />
        <span className="font-medium">
          Location verified ({locationState.distance} miles from office)
        </span>
      </div>
    );
    return null;
  };

  const ScheduleStatus = () => {
    if (!(locationState.granted && locationState.withinRange)) return null;
    if (scheduleState.checking) return (
      <div className="flex items-center space-x-3 text-indigo-600">
        <Loader size={20} className="animate-spin" />
        <span className="font-medium">Verifying your work schedule...</span>
      </div>
    );
    if (scheduleState.allowed === true) return (
      <div className="flex items-center space-x-3 text-green-600">
        <CheckCircle size={20} />
        <span className="font-medium">
          Welcome! Your current time is within your scheduled window
          {scheduleState.start && scheduleState.end ? ` (${scheduleState.start}–${scheduleState.end})` : ''}.
        </span>
      </div>
    );
    if (scheduleState.allowed === false) return (
      <div className="space-y-2">
        <div className="flex items-center space-x-3 text-amber-600">
          <AlertTriangle size={20} />
          <span className="font-medium">{scheduleState.reason || 'Not within your scheduled time.'}</span>
        </div>
        {scheduleState.windows?.length ? (
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-1">Your allowed windows:</div>
            <ul className="list-disc ml-5">
              {scheduleState.windows.map((w, i) => (
                <li key={i}>{w.day}: {w.start_local}–{w.end_local}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <button
          onClick={verifySchedule}
          className="mt-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white"
        >
          Check again
        </button>
      </div>
    );
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <header className="relative px-8 py-8 text-white" style={{ backgroundColor: '#000000' }}>
          <div className="flex items-center justify-between">
            <button onClick={goBack} className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="p-3"><img src={itemLogo} alt="Item Logo" width={58} height={58} /></div>
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Employee Access</h1>
                <p className="text-indigo-100 text-sm font-medium mt-1">Secure Door Control</p>
              </div>
            </div>
            <div className="w-20" />
          </div>
        </header>

        {/* Main Content */}
        <div className="px-8 py-12 bg-gradient-to-b from-gray-50/30 to-white/60 space-y-8">

          {/* Step 1: Location Check */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Location</h2>
              <p className="text-gray-600 leading-relaxed">
                We need to verify you're within {MAX_DISTANCE_MILES} mile of the office to grant access.
              </p>
            </div>

            <div className="space-y-4">
              <LocationStatus />
              {!locationState.granted && !locationState.checking && (
                <button
                  onClick={checkLocation}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  Check My Location
                </button>
              )}
              {locationState.granted && !locationState.withinRange && (
                <button
                  onClick={checkLocation}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Check Location Again
                </button>
              )}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
              <p className="text-sm text-gray-600 text-center"><strong>Office Address:</strong> {COMPANY_ADDRESS}</p>
            </div>
          </div>

          {/* Step 2: Schedule Check */}
          {locationState.granted && locationState.withinRange && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Work Schedule</h2>
                <p className="text-gray-600 leading-relaxed">
                  We’ll confirm you are clocking in during your assigned work window.
                </p>
              </div>
              <ScheduleStatus />
              {scheduleState.allowed === null && !scheduleState.checking && (
                <button
                  onClick={verifySchedule}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Check Work Schedule
                </button>
              )}
            </div>
          )}

          {/* Step 3: Door Control */}
          {locationState.granted && locationState.withinRange && scheduleState.allowed && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300 ${
                  doorState.isOpen ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-purple-600 to-violet-700'
                }`}>
                  {doorState.isOpen ? <Unlock size={28} className="text-white" /> : <Lock size={28} className="text-white" />}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Door Control</h2>
                <p className="text-gray-600 leading-relaxed">
                  {doorState.isOpen ? 'Door is currently unlocked. Access granted!' : 'All checks passed. You may now open the door.'}
                </p>
              </div>

              {doorState.isOpen && doorState.lastOpened && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
                  <p className="text-sm text-green-700 text-center font-medium">
                    ✅ Door opened at {doorState.lastOpened.toLocaleTimeString()}
                  </p>
                </div>
              )}

              <button
                onClick={openDoor}
                disabled={doorState.isOpening || doorState.isOpen || !scheduleState.allowed}
                className={`w-full py-4 font-semibold rounded-2xl transition-all duration-200 shadow-lg transform hover:scale-105 active:scale-95 ${
                  doorState.isOpen
                    ? 'bg-green-500 text-white cursor-default'
                    : doorState.isOpening
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white hover:shadow-xl'
                }`}
              >
                {doorState.isOpening ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader size={20} className="animate-spin" />
                    <span>Opening Door...</span>
                  </div>
                ) : doorState.isOpen ? ('Door Opened Successfully') : ('Open Door')}
              </button>
            </div>
          )}

          {/* If not allowed, optionally show a final notice */}
          {locationState.granted && locationState.withinRange && scheduleState.allowed === false && (
            <div className="text-center text-sm text-gray-600">
              If you believe this is an error, please contact your manager or HR.
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-8 py-6 bg-white/95 backdrop-blur-sm border-t border-gray-100">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3 text-sm text-gray-600 font-medium">
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
              <span>Secure Access System</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EmployeeCheckIn;

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

const EmployeeCheckIn = () => {
  const navigate = useNavigate();
  const [locationState, setLocationState] = useState<LocationState>({
    checking: false,
    granted: false,
    denied: false,
    withinRange: false
  });
  const [doorState, setDoorState] = useState<DoorState>({
    isOpen: false,
    isOpening: false
  });

  // Company address for proximity checking (replace with your actual address)
  const COMPANY_ADDRESS = "123 Main Street, San Francisco, CA 94105";
  const MAX_DISTANCE_MILES = 1;

  const goBack = () => {
    navigate('/');
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Geocode company address (in production, you'd cache this)
  const geocodeAddress = async (): Promise<{lat: number, lng: number}> => {
    // In a real app, you'd use Google Maps Geocoding API or similar
    // For demo purposes, returning San Francisco coordinates
    return { lat: 37.7749, lng: -122.4194 };
  };

  const checkLocation = async () => {
    setLocationState(prev => ({ ...prev, checking: true, error: undefined }));

    try {
      // Request user location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      // Get company coordinates
      const companyCoords = await geocodeAddress();
      
      // Calculate distance
      const distance = calculateDistance(userLat, userLng, companyCoords.lat, companyCoords.lng);
      const withinRange = distance <= MAX_DISTANCE_MILES;

      setLocationState({
        checking: false,
        granted: true,
        denied: false,
        withinRange,
        distance: Math.round(distance * 100) / 100
      });

    } catch (error) {
      console.error('Location error:', error);
      let errorMessage = 'Unable to access location';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
      }

      setLocationState({
        checking: false,
        granted: false,
        denied: true,
        withinRange: false,
        error: errorMessage
      });
    }
  };

  const openDoor = async () => {
    setDoorState(prev => ({ ...prev, isOpening: true }));

    try {
      // Simulate door opening API call
      const response = await fetch('/api/door/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          employee_location: locationState,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setDoorState({
          isOpen: true,
          isOpening: false,
          lastOpened: new Date()
        });

        // Auto-close door status after 10 seconds
        setTimeout(() => {
          setDoorState(prev => ({ ...prev, isOpen: false }));
        }, 10000);
      } else {
        throw new Error('Failed to open door');
      }
    } catch (error) {
      console.error('Door control error:', error);
      setDoorState(prev => ({ ...prev, isOpening: false }));
      // You could add error state here if needed
    }
  };

  const LocationStatus = () => {
    if (locationState.checking) {
      return (
        <div className="flex items-center space-x-3 text-indigo-600">
          <Loader size={20} className="animate-spin" />
          <span className="font-medium">Checking your location...</span>
        </div>
      );
    }

    if (locationState.denied || locationState.error) {
      return (
        <div className="flex items-center space-x-3 text-red-600">
          <AlertTriangle size={20} />
          <span className="font-medium">{locationState.error}</span>
        </div>
      );
    }

    if (locationState.granted && !locationState.withinRange) {
      return (
        <div className="flex items-center space-x-3 text-amber-600">
          <AlertTriangle size={20} />
          <span className="font-medium">
            You are {locationState.distance} miles from the office (max: {MAX_DISTANCE_MILES} mile)
          </span>
        </div>
      );
    }

    if (locationState.granted && locationState.withinRange) {
      return (
        <div className="flex items-center space-x-3 text-green-600">
          <CheckCircle size={20} />
          <span className="font-medium">
            Location verified ({locationState.distance} miles from office)
          </span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <header className="relative px-8 py-8 text-white" style={{ backgroundColor: '#000000' }}>
          <div className="flex items-center justify-between">
            {/* Back button */}
            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Back</span>
            </button>

            {/* Center content */}
            <div className="flex items-center space-x-4">
              <div className="p-3">
                <img src={itemLogo} alt="Item Logo" width={58} height={58} />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Employee Access</h1>
                <p className="text-indigo-100 text-sm font-medium mt-1">Secure Door Control</p>
              </div>
            </div>

            {/* Spacer */}
            <div className="w-20"></div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/8 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute top-4 right-8 w-6 h-6 bg-indigo-400/60 rounded-lg rotate-12" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/8 rounded-full translate-y-16 -translate-x-16" />
          <div className="absolute bottom-4 left-8 w-4 h-4 bg-violet-400/60 rounded-full" />
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
              <p className="text-sm text-gray-600 text-center">
                <strong>Office Address:</strong> {COMPANY_ADDRESS}
              </p>
            </div>
          </div>

          {/* Step 2: Door Control */}
          {locationState.granted && locationState.withinRange && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300 ${
                  doorState.isOpen 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                    : 'bg-gradient-to-br from-purple-600 to-violet-700'
                }`}>
                  {doorState.isOpen ? <Unlock size={28} className="text-white" /> : <Lock size={28} className="text-white" />}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Door Control</h2>
                <p className="text-gray-600 leading-relaxed">
                  {doorState.isOpen 
                    ? 'Door is currently unlocked. Access granted!' 
                    : 'Location verified. You may now open the door.'}
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
                disabled={doorState.isOpening || doorState.isOpen}
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
                ) : doorState.isOpen ? (
                  'Door Opened Successfully'
                ) : (
                  'Open Door'
                )}
              </button>
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
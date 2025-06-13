import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RotateCcw, Check, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const CameraPage = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'camera' | 'upload'>('upload');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // fetch data sent from /checkIn
  const visitorInfo = {
    name: location.state?.visitor_name ?? '',
    phone: location.state?.visitor_phone ?? '',
    email: location.state?.email ?? '',
    host_employee: location.state?.host_employee ?? '', 
    employee_name: location.state?.employee_name ?? '', 
    employee_email: location.state?.employee_email?? '', 
    location_id: location.state?.location_id ?? '3',  // default = 3, but should't happen
    estimate_time: location.state?.estimate_time ?? '02:00:00', //always 2 hr cuz we don't know
  };
// 1) Create a Date object (this represents “now” in your local environment):
  const now = new Date();

  // 2) Use toLocaleString with a “sortable” format (we’ll use the “sv” locale trick)
  //    and explicitly tell it to output in America/Los_Angeles time:
  const pacificSortable = now.toLocaleString('sv', {
    timeZone: 'America/Los_Angeles',
    hour12: false,            // 24-hour clock
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  // pacificSortable will look like: "2025-06-05 16:15:21"

  // 3) Swap the space for “T” (to make it an ISO-like string):
  const pstString = pacificSortable.replace(' ', 'T');
  // pstString === "2025-06-05T16:15:21"

  useEffect(() => {
    if (uploadMethod === 'camera') {
      startCamera();
    }
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [stream, uploadMethod]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.log("err: ", err)
      setCameraError('Unable to access camera. Please check permissions or try uploading instead.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => setCapturedImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    if (uploadMethod === 'camera') startCamera();
  };

  const uploadPhoto = async () => {
    if (!capturedImage) return;
    setIsUploading(true);
    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      // create a formdata to send to /visitor/create
      const formData = new FormData();
      formData.append('photo', blob, 'visitor-photo.jpg');
      formData.append('name', visitorInfo.name);
      formData.append('phone', visitorInfo.phone);
      formData.append('email', visitorInfo.email);
      formData.append('host_employee', visitorInfo.host_employee.toString());
      formData.append('visit_date', pstString);
      formData.append('estimate_time', visitorInfo.estimate_time);
      formData.append('location_id', visitorInfo.location_id);
      formData.append('status', 'check-in');

        
      // Log everything
      console.log('--- FormData Contents ---');
      for (const [key, value] of formData.entries()) {
        if (value instanceof Blob) {
          console.log(`${key}: [Blob] filename=${(value as File).name}, type=${value.type}, size=${value.size} bytes`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      console.log('-------------------------');
      // sends api call to create visitor
      const createRes = await fetch('http://192.168.162.183:8080/api/visitor/create', {
        method: 'POST',
        body: formData,
      });

      if (!createRes.ok) throw new Error('Visitor creation failed');
      const { token: qrToken } = await createRes.json();  //receive qrToken
        

      // with qrToken we can now process via visitor/checkin
      const checkinForm = new FormData();
      checkinForm.append('name', visitorInfo.name);
      checkinForm.append('phone', visitorInfo.phone);
      checkinForm.append('email', visitorInfo.email);
      checkinForm.append('visit_date', pstString);
      checkinForm.append('estimate_time', visitorInfo.estimate_time);
      checkinForm.append('host_employee', visitorInfo.host_employee.toString());
      checkinForm.append('location_id', visitorInfo.location_id);
      checkinForm.append('qr_token', qrToken);

      const checkinRes = await fetch('http://192.168.162.183:8080/api/visitor/checkin', {
        method: 'POST',
        body: checkinForm,
      });

      if (!checkinRes.ok) throw new Error('Check-in failed');

      // pass into sucess name only
      navigate('/success', { state: { name: visitorInfo.name } });
    } catch (err) {
      alert(`Check-in failed: ${err}`);
    } finally {
      setIsUploading(false);
    }
  };


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

      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative z-10">

        {/* Header */}
        <header className="relative px-6 py-8 bg-white border-b border-gray-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center">
              <img src="src/assets/item.svg" alt="Item Logo" width={58} height={58} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">Visitor Photo</h1>
            <p className="text-gray-600 mb-4">Take or upload a photo to complete your check-in</p>
          </div>
        </header>

        {/* Upload Method Buttons */}
        <div className="px-6 py-6 bg-gray-50 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <button
              onClick={() => setUploadMethod('camera')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                uploadMethod === 'camera' 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Camera size={16} className="mr-2" />
              Take Photo
            </button>
            <button
              onClick={() => setUploadMethod('upload')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                uploadMethod === 'upload' 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Upload size={16} className="mr-2" />
              Upload File
            </button>
          </div>
        </div>

        {/* Image Area */}
        <div className="p-6">
          {!capturedImage ? (
            uploadMethod === 'camera' ? (
              <div className="relative bg-black rounded-xl overflow-hidden">
                {cameraError ? (
                  <div className="aspect-video flex items-center justify-center text-white bg-gray-800 text-center p-6">
                    <div>
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X size={24} className="text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Camera Access Error</h3>
                      <p className="text-sm text-gray-300 mb-4">{cameraError}</p>
                      <button
                        onClick={() => setUploadMethod('upload')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                      >
                        Switch to Upload
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video object-cover" />
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 w-full flex justify-center">
                      <button
                        onClick={capturePhoto}
                        disabled={!stream}
                        className="w-16 h-16 bg-white rounded-full shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center transition-transform duration-200 disabled:opacity-50"
                      >
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                          <Camera size={20} className="text-white" />
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={24} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">Upload a Photo</h3>
                <p className="text-gray-600 mb-6">Choose a photo from your device</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Choose File
                </button>
              </div>
            )
          ) : (
            <div className="text-center">
              <div className="relative inline-block">
                <img src={capturedImage} alt="Captured" className="w-full max-w-md aspect-video object-cover rounded-xl shadow-lg border border-gray-200" />
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
                <button
                  onClick={retakePhoto}
                  className="flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <RotateCcw size={18} className="mr-2" />
                  Retake
                </button>
                <button
                  onClick={uploadPhoto}
                  disabled={isUploading}
                  className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check size={18} className="mr-2" />
                      Complete Check-in
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
};


export default CameraPage;

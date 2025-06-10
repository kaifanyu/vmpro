import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RotateCcw, Check, X, Sparkles } from 'lucide-react';
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

  const visitorInfo = {
    name: location.state?.name ?? '',
    phone: location.state?.phone ?? '',
    email: location.state?.email ?? '',
    host_employee: location.state?.host_employee ?? '',
    location_id: location.state?.location_id ?? '3',
    estimate_time: location.state?.estimate_time ?? '02:00:00',
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
  }, [uploadMethod]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
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

      const createRes = await fetch('http://192.168.162.183:8080/api/visitor/create', {
        method: 'POST',
        body: formData,
      });

      if (!createRes.ok) throw new Error('Visitor creation failed');
      const { token: qrToken } = await createRes.json();

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

      navigate('/success', { state: { name: visitorInfo.name } });
    } catch (err: any) {
      alert(`Check-in failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">

        {/* Header */}
        <header className="relative px-6 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-y-2 text-center sm:text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Visitor Photo</h1>
                <p className="text-blue-100 text-sm">Take or upload a photo to check in</p>
              </div>
            </div>
            <p className="text-blue-100 text-sm">
              Welcome, <span className="font-semibold text-white">{visitorInfo.name}</span>
            </p>
          </div>
        </header>

        {/* Upload Method Buttons */}
        <div className="px-6 py-4 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setUploadMethod('camera')}
              className={`w-full sm:w-auto py-2 px-4 rounded-xl text-sm font-medium ${
                uploadMethod === 'camera' ? 'bg-blue-500 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Camera size={16} className="inline mr-2" />
              Take Photo
            </button>
            <button
              onClick={() => setUploadMethod('upload')}
              className={`w-full sm:w-auto py-2 px-4 rounded-xl text-sm font-medium ${
                uploadMethod === 'upload' ? 'bg-blue-500 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Upload size={16} className="inline mr-2" />
              Upload File
            </button>
          </div>
        </div>

        {/* Image Area */}
        <div className="p-6">
          {!capturedImage ? (
            uploadMethod === 'camera' ? (
              <div className="relative bg-black rounded-2xl overflow-hidden">
                {cameraError ? (
                  <div className="aspect-video flex items-center justify-center text-white bg-gray-800 text-center p-6">
                    <div>
                      <X size={48} className="text-red-400 mx-auto mb-4" />
                      <p className="text-sm">{cameraError}</p>
                      <button
                        onClick={() => setUploadMethod('upload')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
                      >
                        Switch to Upload
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video object-cover" />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 w-full flex justify-center">
                      <button
                        onClick={capturePhoto}
                        disabled={!stream}
                        className="w-16 h-16 bg-white rounded-full shadow hover:scale-105 active:scale-95 flex items-center justify-center"
                      >
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <Camera size={20} className="text-white" />
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50/50">
                <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Click to select a photo</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                >
                  Choose File
                </button>
              </div>
            )
          ) : (
            <div className="text-center">
              <img src={capturedImage} alt="Captured" className="w-full aspect-video object-cover rounded-2xl shadow" />
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
                <button
                  onClick={retakePhoto}
                  className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
                >
                  <RotateCcw size={18} className="mr-2" />
                  Retake
                </button>
                <button
                  onClick={uploadPhoto}
                  disabled={isUploading}
                  className="flex items-center px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50"
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
    </div>
  );
};

export default CameraPage;

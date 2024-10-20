'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCcw, CheckCircle2, FlipHorizontal } from 'lucide-react';

const ProductCamera = ({ onImageCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  
  const initializeCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      
      if (videoDevices.length > 0) {
        // Find back camera
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        
        // Use back camera if found, otherwise use first camera
        const defaultDevice = backCamera || videoDevices[0];
        setSelectedDevice(defaultDevice.deviceId);
        setCurrentCameraIndex(videoDevices.indexOf(defaultDevice));
        startCamera(defaultDevice.deviceId);
      } else {
        setError('No cameras found');
      }
    } catch (err) {
      setError('Failed to access camera. Please ensure camera permissions are granted.');
    }
  };

  const handleFlipCamera = () => {
    if (devices.length <= 1) return;
    
    const nextIndex = (currentCameraIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];
    
    setCurrentCameraIndex(nextIndex);
    setSelectedDevice(nextDevice.deviceId);
    stopCamera();
    startCamera(nextDevice.deviceId);
  };

  useEffect(() => {
    initializeCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // const initializeCamera = async () => {
  //   try {
  //     const devices = await navigator.mediaDevices.enumerateDevices();
  //     const videoDevices = devices.filter(device => device.kind === 'videoinput');
  //     setDevices(videoDevices);

  //     if (videoDevices.length > 0) {
  //       setSelectedDevice(videoDevices[0].deviceId);
  //       startCamera(videoDevices[0].deviceId);
  //     } else {
  //       setError('No cameras found');
  //     }
  //   } catch (err) {
  //     setError('Failed to access camera. Please ensure camera permissions are granted.');
  //   }
  // };

  const startCamera = async (deviceId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId,
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      setError('Failed to start camera');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleDeviceChange = (e) => {
    const deviceId = e.target.value;
    setSelectedDevice(deviceId);
    if (isCameraActive) {
      stopCamera();
      startCamera(deviceId);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera(selectedDevice);
  };

  const confirmImage = () => {
    onImageCapture(capturedImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        {/* Camera Container */}
        <div className="relative">
          <div className="relative aspect-[4/3] bg-black rounded-t-lg overflow-hidden">
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={capturedImage}
                alt="Captured product"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Hidden Canvas */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 bg-white rounded-b-lg">
          {devices.length > 1 && (
            <button
              onClick={handleFlipCamera}
              className="absolute top-2 left-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
            >
              <FlipHorizontal className="w-6 h-6" />
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            {!capturedImage ? (
              <button
                onClick={captureImage}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                <Camera className="w-5 h-5" />
                Take Photo
              </button>
            ) : (
              <>
                <button
                  onClick={retakePhoto}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retake
                </button>
                <button
                  onClick={confirmImage}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Use Photo
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCamera;
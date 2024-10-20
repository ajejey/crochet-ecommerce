'use client';
import { useRef, useState, useEffect } from 'react';

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    // Fetch available video devices (cameras)
    const getCameras = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0) setSelectedDevice(videoDevices[0].deviceId); // Default to the first camera
    };
    getCameras();
  }, []);

  const startCamera = async () => {
    if (!selectedDevice) return;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: selectedDevice },
    });
    videoRef.current.srcObject = stream;
    setIsCameraActive(true);
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Adjust canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setImage(dataUrl);
  };

  const handleDeviceChange = (e) => {
    setSelectedDevice(e.target.value);
    if (isCameraActive) {
      stopCamera();
      startCamera();
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Camera App</h1>

      {/* Camera Selection */}
      <div className="flex items-center mb-4">
        <label className="mr-2 font-medium">Choose Camera:</label>
        <select
          value={selectedDevice}
          onChange={handleDeviceChange}
          className="p-2 border rounded"
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${devices.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* Video Stream */}
      <div className="relative mb-4">
        <video ref={videoRef} autoPlay playsInline className="w-full max-w-md border rounded" />
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 mb-4">
        {!isCameraActive ? (
          <button
            onClick={startCamera}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Stop Camera
          </button>
        )}
        <button
          onClick={captureImage}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          disabled={!isCameraActive}
        >
          Capture Image
        </button>
      </div>

      {/* Display Captured Image */}
      {image && (
        <div className="w-full max-w-md">
          <h2 className="text-xl font-medium mb-2">Captured Image:</h2>
          <img src={image} alt="Captured" className="border rounded w-full" />
        </div>
      )}
    </div>
  );
}

'use client';
import { useRef, useState } from 'react';

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setImage(dataUrl);
  };

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} autoPlay className="w-full max-w-sm border mb-4" />
      <canvas ref={canvasRef} className="hidden" width="640" height="480"></canvas>
      <div className="flex gap-2">
        <button onClick={startCamera} className="bg-blue-500 text-white py-2 px-4 rounded">
          Start Camera
        </button>
        <button onClick={captureImage} className="bg-green-500 text-white py-2 px-4 rounded">
          Capture Image
        </button>
      </div>
      {image && <img src={image} alt="Captured" className="mt-4 w-full max-w-sm border" />}
    </div>
  );
}

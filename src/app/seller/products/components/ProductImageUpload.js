'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, X, Loader2, RotateCw, RotateCcw, Crop, Maximize2, Check } from 'lucide-react';

const ProductImageUpload = ({ images, removeImage, handleImageChange, uploadingImages, MAX_IMAGES }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const [cropCoordinates, setCropCoordinates] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cropStartRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const openImageDialog = (image, index) => {
    setSelectedImage({ ...image, index });
    setRotation(0);
    setIsCropping(false);
  };

  const closeImageDialog = () => {
    setSelectedImage(null);
    setRotation(0);
    setIsCropping(false);
  };

  const rotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const toggleCropMode = () => {
    setIsCropping(!isCropping);
    if (!isCropping) {
      setCropCoordinates({ x: 0, y: 0, width: 0, height: 0 });
    }
  };

  const handleCropStart = (e) => {
    if (!isCropping) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cropStartRef.current = { x, y };
    setCropCoordinates({ x, y, width: 0, height: 0 });
  };

  const handleCropMove = (e) => {
    if (!isCropping || !cropStartRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropCoordinates({
      x: Math.min(cropStartRef.current.x, x),
      y: Math.min(cropStartRef.current.y, y),
      width: Math.abs(x - cropStartRef.current.x),
      height: Math.abs(y - cropStartRef.current.y)
    });
  };

  const handleCropEnd = () => {
    if (!isCropping) return;
    // In a real implementation, we would apply the crop here
    // For now, we'll just log the crop coordinates
    console.log('Crop coordinates:', cropCoordinates);
    
    // TODO: Implement actual image cropping functionality
    // This would involve creating a canvas, drawing the image with the crop,
    // and converting it back to a file
  };

  const applyEdits = () => {
    // TODO: Implement actual image editing functionality
    // This would involve creating a canvas, applying transformations,
    // and converting it back to a file
    
    closeImageDialog();
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative w-24 h-24">
            <Image
              src={image.url}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover rounded-lg cursor-pointer"
              onClick={() => openImageDialog(image, index)}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(index);
              }}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              multiple
            />
            {uploadingImages.size > 0 ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            ) : (
              <Plus className="w-6 h-6 text-gray-400" />
            )}
          </label>
        )}
      </div>

      {/* Image Preview Dialog */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Edit Image</h3>
              <button
                type="button"
                onClick={closeImageDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="relative flex-grow overflow-hidden p-4 flex items-center justify-center">
              <div 
                className="relative"
                onMouseDown={handleCropStart}
                onMouseMove={handleCropMove}
                onMouseUp={handleCropEnd}
                onMouseLeave={handleCropEnd}
              >
                <div 
                  ref={imageRef} 
                  className="relative"
                  style={{ 
                    transform: `rotate(${rotation}deg)`,
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <Image
                    src={selectedImage.url}
                    alt="Selected product image"
                    width={500}
                    height={500}
                    className="max-h-[60vh] w-auto object-contain"
                  />
                </div>
                
                {isCropping && cropCoordinates.width > 0 && (
                  <div 
                    className="absolute border-2 border-rose-500 bg-rose-500 bg-opacity-20 pointer-events-none"
                    style={{
                      left: `${cropCoordinates.x}px`,
                      top: `${cropCoordinates.y}px`,
                      width: `${cropCoordinates.width}px`,
                      height: `${cropCoordinates.height}px`
                    }}
                  />
                )}
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={rotateClockwise}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Rotate Clockwise"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={rotateCounterClockwise}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Rotate Counter-Clockwise"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={toggleCropMode}
                  className={`p-2 rounded-full ${isCropping ? 'bg-rose-100 text-rose-600' : 'hover:bg-gray-100'}`}
                  title="Crop Image"
                >
                  <Crop className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Reset to original image
                    setRotation(0);
                    setIsCropping(false);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Reset"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={closeImageDialog}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyEdits}
                  className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 flex items-center"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
'use client';
import React, { useState } from 'react';
import { Camera as CameraIcon, X, ChevronLeft, ChevronRight, Upload, Check } from 'lucide-react';
import Camera from '@/app/components/Camera';

const AddProduct = () => {
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  
  // Progress steps
  const steps = [
    { number: 1, name: 'Photos' },
    { number: 2, name: 'Basic Info' },
    { number: 3, name: 'Details' },
    { number: 4, name: 'Review' }
  ];

  const handlePhotoCapture = () => {
    // In real implementation, this would handle camera capture
    setIsUsingCamera(true);
    // Simulating photo capture
    setTimeout(() => {
      setPhotos([...photos, '/api/placeholder/400/400']);
      setIsUsingCamera(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : null}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>
        
        {/* Progress bar */}
        <div className="flex justify-between px-4 pb-4">
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg mb-1
                ${step >= s.number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > s.number ? <Check className="w-5 h-5" /> : s.number}
              </div>
              <div className={`text-sm ${step >= s.number ? 'text-blue-500' : 'text-gray-500'}`}>
                {s.name}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Main Content - starts below fixed header */}
      <main className="pt-32 pb-24 px-4">
        {/* Step 1: Photos */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Product Photos</h2>
              <p className="text-gray-600 text-lg">Take clear photos in good lighting</p>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <img 
                    src={photo} 
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button 
                    onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              ))}
              
              {photos.length < 4 && (
                // <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                //   <button 
                //     onClick={handlePhotoCapture}
                //     className="flex flex-col items-center text-gray-600 p-4"
                //   >
                //     <CameraIcon className="w-12 h-12 mb-2" />
                //     <span className="text-lg">Take Photo</span>
                //   </button>
                // </div>
                <Camera />
              )}
            </div>

            <p className="text-center text-gray-600">
              Add up to 4 photos • {photos.length}/4 added
            </p>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
              <p className="text-gray-600 text-lg">Tell us about your product</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xl text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g., Cozy Winter Scarf"
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xl text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  placeholder="29.99"
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xl text-gray-700 mb-2">Category</label>
                <select className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select a category</option>
                  <option value="scarves">Scarves</option>
                  <option value="blankets">Blankets</option>
                  <option value="hats">Hats</option>
                  <option value="baby">Baby Items</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Details</h2>
              <p className="text-gray-600 text-lg">Add more details to help customers</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xl text-gray-700 mb-2">Materials Used</label>
                <input
                  type="text"
                  placeholder="e.g., 100% Merino Wool"
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xl text-gray-700 mb-2">Size/Dimensions</label>
                <input
                  type="text"
                  placeholder="e.g., 60 inches x 6 inches"
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xl text-gray-700 mb-2">Description</label>
                <textarea
                  rows="4"
                  placeholder="Describe your product..."
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xl text-gray-700 mb-2">Care Instructions</label>
                <textarea
                  rows="3"
                  placeholder="e.g., Hand wash in cold water..."
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Product</h2>
              <p className="text-gray-600 text-lg">Check everything before publishing</p>
            </div>

            <div className="bg-white rounded-lg p-6 space-y-6">
              {/* Preview content would go here */}
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={photos[0]} 
                  alt="Product preview" 
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-bold">Cozy Winter Scarf</h3>
                  <p className="text-gray-600">$29.99</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-700">Category</h4>
                  <p>Scarves</p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-700">Materials</h4>
                  <p>100% Merino Wool</p>
                </div>
                {/* More review details would go here */}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={() => {
            if (step < 4) setStep(step + 1);
            else {
              // Handle product submission
              console.log('Product submitted');
            }
          }}
          className="w-full bg-blue-500 text-white text-xl py-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {step < 4 ? 'Continue' : 'Publish Product'}
        </button>
      </div>

      {/* Camera Interface Overlay */}
      {isUsingCamera && (
        <div className="fixed inset-0 bg-black z-50">
          <div className="h-full flex flex-col">
            <div className="flex-1 bg-gray-900 relative">
              {/* Camera preview would go here */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CameraIcon className="w-16 h-16 text-white opacity-50" />
              </div>
            </div>
            <div className="bg-black p-6">
              <button 
                onClick={() => setIsUsingCamera(false)}
                className="w-full bg-white text-black text-xl py-4 rounded-lg"
              >
                Take Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function ProductGallery({ images, name }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImage(index);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={images[currentImage].url}
          alt={`${name} - Image ${currentImage + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-transform duration-500 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={handleZoomToggle}
          priority
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white shadow-md"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Zoom Icon */}
        <button
          onClick={handleZoomToggle}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white shadow-md"
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
        >
          <Maximize2 className="h-5 w-5" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square rounded-md overflow-hidden ${
                currentImage === index
                  ? 'ring-2 ring-blue-500'
                  : 'hover:opacity-75'
              }`}
            >
              <Image
                src={image.url}
                alt={`${name} - Thumbnail ${index + 1}`}
                fill
                sizes="20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

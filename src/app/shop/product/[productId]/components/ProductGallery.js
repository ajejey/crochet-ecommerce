'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function ProductGallery({ images, name }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handlePrevious = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImage(index);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) {
      return;
    }

    if (distance > 0) {
      handleNext();
    } else {
      handlePrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  if (!images.length) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No image available</p>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Main Image */}
      <div 
        className="relative h-full bg-gray-50"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[currentImage].url}
          alt={`${name} - Image ${currentImage + 1}`}
          fill
          sizes="100vw"
          className={`object-cover transition-transform duration-500 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={handleZoomToggle}
          priority
        />
        
        {/* Image Counter for Mobile */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImage + 1} / {images.length}
        </div>

        {/* Navigation Arrows - Hidden on Mobile */}
        {images.length > 1 && (
          <div className="hidden md:block">
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Zoom Icon - Hidden on Mobile */}
        <button
          onClick={handleZoomToggle}
          className="hidden md:block absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg"
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
        >
          <Maximize2 className="h-5 w-5" />
        </button>
      </div>

      {/* Thumbnails - Horizontal Scroll on Mobile */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent">
          <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
                  currentImage === index
                    ? 'ring-2 ring-pink-500 ring-offset-2'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                <Image
                  src={image.url}
                  alt={`${name} - Thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 64px) 100vw, 64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

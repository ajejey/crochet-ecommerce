'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images }) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images.length) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No image available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full">
        <div className="absolute inset-0 flex items-center justify-between z-10 px-4">
          <button
            onClick={previousImage}
            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        <Image
          src={images[currentImage]}
          alt={`Product image ${currentImage + 1}`}
          fill
          className="object-cover rounded-lg"
          priority={currentImage === 0}
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setCurrentImage(index)}
            className={`relative aspect-square w-full rounded-lg overflow-hidden ${
              index === currentImage ? 'ring-2 ring-purple-600' : ''
            }`}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

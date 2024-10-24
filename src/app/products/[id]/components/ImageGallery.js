'use client';
import { useState } from 'react';
import Image from 'next/image';

function ImageGallery({ images, productName }) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="flex flex-col-reverse md:grid md:grid-cols-4 md:gap-4">
      {/* Thumbnails */}
      <div className="mt-4 md:mt-0 flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto">
        {images.map((image, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-lg border-2 
              ${activeImage === idx ? 'border-blue-600' : 'border-gray-200'}`}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${idx + 1}`}
              fill
              className="object-cover rounded-lg"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative aspect-square md:col-span-3 rounded-lg overflow-hidden">
        <Image
          src={images[activeImage]}
          alt={productName}
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}

export default ImageGallery;
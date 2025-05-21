'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

export default function ProductGallery({ images, name }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [displayImages, setDisplayImages] = useState(images);
  const [variantImage, setVariantImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Listen for variant image selection events
  useEffect(() => {
    const handleVariantImageSelected = (event) => {
      const { variantImage, variantId } = event.detail;
      setVariantImage(variantImage);
      
      if (variantImage && variantImage.url) {
        // If a variant image is selected, add it as the first image but keep original images
        const variantImageObj = { 
          url: variantImage.url, 
          id: `variant-${variantId || 'custom'}`,
          isVariantImage: true
        };
        
        // Create a new array with variant image first, followed by original images
        const newImages = [variantImageObj, ...images.filter(img => !img.isVariantImage)];
        setDisplayImages(newImages);
        setActiveIndex(0); // Reset to first slide (the variant image)
      } else {
        // Reset to original product images
        setDisplayImages(images.filter(img => !img.isVariantImage));
        setActiveIndex(0); // Reset to first slide
      }
    };
    
    // Custom event for when variant is selected
    window.addEventListener('variant-image-selected', handleVariantImageSelected);
    
    // Custom event for when returning to base product
    const handleBaseProductSelected = () => {
      setVariantImage(null);
      setDisplayImages(images.filter(img => !img.isVariantImage));
      setActiveIndex(0);
    };
    
    window.addEventListener('base-product-selected', handleBaseProductSelected);
    
    return () => {
      window.removeEventListener('variant-image-selected', handleVariantImageSelected);
      window.removeEventListener('base-product-selected', handleBaseProductSelected);
    };
  }, [images]);

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  if (!displayImages || !displayImages.length) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No image available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Main Gallery */}
      <div className="relative w-full bg-gray-50 rounded-lg overflow-hidden" style={{ height: 'calc(100% - 80px)' }}>
        <Swiper
          modules={[Navigation, Pagination, Thumbs, Zoom]}
          spaceBetween={0}
          navigation={{
            enabled: true,
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{
            type: 'fraction',
            el: '.swiper-pagination',
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          zoom={{
            maxRatio: 2,
            minRatio: 1,
          }}
          className="h-full w-full"
        >
          {displayImages.map((image, index) => (
            <SwiperSlide key={image.id || index} className="flex items-center justify-center">
              <div className="swiper-zoom-container">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={image.url}
                    alt={`${name} - Image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                    priority={index === 0}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Custom Navigation Buttons - Hidden on Mobile */}
          <div className="hidden md:block">
            <div className="swiper-button-prev !text-rose-600 !w-10 !h-10 !bg-white/90 hover:!bg-white !rounded-full !shadow-lg after:!text-xl"></div>
            <div className="swiper-button-next !text-rose-600 !w-10 !h-10 !bg-white/90 hover:!bg-white !rounded-full !shadow-lg after:!text-xl"></div>
          </div>
          
          {/* Custom Pagination */}
          <div className="swiper-pagination !bottom-4 !bg-black/50 !text-white !px-3 !py-1 !rounded-full !text-sm !w-auto !left-1/2 !transform !-translate-x-1/2"></div>
          
          {/* Zoom Button - Hidden on Mobile */}
          <button
            onClick={handleZoomToggle}
            className="hidden md:block absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg"
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </Swiper>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="mt-4 h-20">
          <Swiper
            modules={[Thumbs]}
            watchSlidesProgress
            onSwiper={setThumbsSwiper}
            slidesPerView="auto"
            spaceBetween={8}
            className="h-full"
          >
            {displayImages.map((image, index) => (
              <SwiperSlide 
                key={image.id || index} 
                className="!w-auto h-full aspect-square cursor-pointer"
              >
                <div className="relative h-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image.url}
                    alt={`${name} - Thumbnail ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}

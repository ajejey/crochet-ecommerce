'use client';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import useBreakpoint from '@/hooks/useBreakpoint';
import React, { Suspense } from 'react'
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReviews';
import DesktopLayout from './DesktopLayout';
import Link from 'next/link';

const MainLayout = ({ product, initialReviews, params }) => {
    const { isMobile } = useBreakpoint();

    console.log("isMobile", isMobile)

    const galleryComponent = (
        <Suspense fallback={<LoadingSpinner />}>
          <ProductGallery images={product.images} name={product.name} />
        </Suspense>
      );
    
      const productInfoComponent = (
        <Suspense fallback={<LoadingSpinner />}>
          <ProductInfo product={product} initialReviews={initialReviews} />
        </Suspense>
      );
    
      const reviewsComponent = (
        <Suspense fallback={<LoadingSpinner />}>
          <ProductReviews
            productId={params.productId}
            initialReviews={initialReviews}
          />
        </Suspense>
      );
    
      if (isMobile === false) {
        return (
          <DesktopLayout product={product} initialReviews={initialReviews}>
            {galleryComponent}
            {productInfoComponent}
            {reviewsComponent}
          </DesktopLayout>
        );
      }
      if (isMobile === true) {
      return (
        <div className="min-h-screen flex flex-col">
          {/* Sticky Header */}
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100">
            <nav className="flex items-center gap-2 p-4 text-sm">
              <Link href="/shop" className="text-rose-600 hover:text-rose-800">Shop</Link>
              <span className="text-gray-400">/</span>
              <Link href={`/shop/${product.category}`} className="text-rose-600 hover:text-rose-800">
                {product.category}
              </Link>
            </nav>
          </header>
    
          {/* Main Content */}
          <main className="flex-1">
            {/* Gallery - Adjusted to handle different aspect ratios */}
            <div className="px-2 pt-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                <div className="h-[60vh] md:h-[50vh]">
                  {galleryComponent}
                </div>
              </div>
            </div>
    
            {/* Product Info - Now positioned below gallery with proper spacing */}
            <div className="px-2 mt-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                {productInfoComponent}
              </div>
            </div>
    
            {/* Additional Info */}
            <div className="px-2 space-y-4 mt-4 mb-6">
              {/* Product Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-4">
                  <h2 className="font-medium mb-2">Product Details</h2>
                  <div dangerouslySetInnerHTML={{ __html: product.description?.full }} className="text-sm text-gray-600 space-y-2">
                  </div>
                </div>
              </div>
    
              {/* Care Instructions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-4">
                  <h2 className="font-medium mb-2">Care Instructions</h2>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-rose-400"></span>
                      Hand wash in cold water
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-rose-400"></span>
                      Lay flat to dry
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-rose-400"></span>
                      Do not bleach
                    </li>
                  </ul>
                </div>
              </div>
    
              {/* Reviews Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-4">
                  <h2 className="font-medium mb-4">Customer Reviews</h2>
                  {reviewsComponent}
                </div>
              </div>
            </div>
          </main>
        </div>
      );
    }
}

export default MainLayout
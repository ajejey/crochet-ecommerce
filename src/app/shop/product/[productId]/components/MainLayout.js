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
          <header className=" bg-white/95 backdrop-blur-md border-b border-gray-100">
            <nav className="flex items-center gap-2 p-4 text-sm">
              <Link href="/shop" className="text-pink-600 hover:text-pink-800">Shop</Link>
              <span className="text-gray-400">/</span>
              <Link href={`/shop/${product.category}`} className="text-pink-600 hover:text-pink-800">
                {product.category}
              </Link>
            </nav>
          </header>
    
          {/* Main Content */}
          <main className="flex-1">
            {/* Gallery */}
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-[16/9]">
              {galleryComponent}
            </div>
    
            {/* Product Info */}
            <div className="px-2 -mt-6 relative z-10">
              <div className="bg-white rounded-t-3xl shadow-lg">
                {productInfoComponent}
              </div>
            </div>
    
            {/* Additional Info */}
            <div className="px-2 space-y-4 mt-4">
              {/* Product Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-4">
                  <h2 className="font-medium mb-2">Product Details</h2>
                  <div className="text-sm text-gray-600 space-y-2">
                    {product.description?.full}
                  </div>
                </div>
              </div>
    
              {/* Care Instructions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-4">
                  <h2 className="font-medium mb-2">Care Instructions</h2>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-pink-400"></span>
                      Hand wash in cold water
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-pink-400"></span>
                      Lay flat to dry
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-pink-400"></span>
                      Do not bleach
                    </li>
                  </ul>
                </div>
              </div>
    
              {/* Reviews */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-4">
                  <h2 className="font-medium">Customer Reviews</h2>
                  {reviewsComponent}
                </div>
              </div>
            </div>
          </main>
    
          {/* Sticky Add to Cart */}
          <div className="sticky bottom-0 z-50 bg-white border-t border-gray-100 p-4">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-lg font-bold">₹{product.salePrice || product.price}</span>
                {product.salePrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">₹{product.price}</span>
                )}
              </div>
              <button className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-pink-700">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
        <div className="min-h-screen">
        <LoadingSpinner />
        </div>
    )
}

export default MainLayout
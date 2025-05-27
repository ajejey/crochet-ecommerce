'use client';

import { Suspense } from 'react';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function DesktopLayout({ 
  product, 
  initialReviews,
  children 
}) {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50/50">
        <div className="container mx-auto px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <a href="/shop" className="text-pink-600 hover:text-pink-800">Shop</a>
            <span className="text-gray-400">/</span>
            <a href={`/shop/${product.category}`} className="text-pink-600 hover:text-pink-800">
              {product.category}
            </a>
          </nav>
        </div>
      </div>

      {/* Main Product Section - Two Columns */}
      <div className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-2 gap-12">
          {/* Left Column - Gallery */}
          <div className="sticky top-8">
            <div className="aspect-square">
              {children[0]} {/* Gallery Component */}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm">
              <Suspense fallback={<LoadingSpinner />}>
                {children[1]} {/* ProductInfo Component */}
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Sections */}
      <div >
        <div className="container mx-auto">
          <div className="space-y-16">
            {/* Product Details Section */}
            <section>
              <h2 className="text-2xl font-medium mb-6">Product Details</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div dangerouslySetInnerHTML={{ __html: product.description?.full }} className="prose prose-gray max-w-none">
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section>
              <h2 className="text-2xl font-medium mb-6">Features & Care</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Key Features */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-lg font-medium mb-4">Key Features</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2"></span>
                      <span>Handcrafted with premium cotton blend yarn</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2"></span>
                      <span>Unique open-weave pattern for breathability</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2"></span>
                      <span>Adjustable side ties for custom fit</span>
                    </li>
                  </ul>
                </div>

                {/* Care Instructions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-lg font-medium mb-4">Care Instructions</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2"></span>
                      <span>Hand wash in cold water to maintain shape and texture</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2"></span>
                      <span>Lay flat to dry on a clean towel</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2"></span>
                      <span>Do not bleach or use harsh detergents</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Reviews Section */}
            <section>
              <h2 className="text-2xl font-medium mb-6">Customer Reviews</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
                <Suspense fallback={<LoadingSpinner />}>
                  {children[2]} {/* Reviews Component */}
                </Suspense>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart - Desktop */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg transform translate-y-full transition-transform duration-300 hover:translate-y-0">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-2xl font-bold">₹{product.salePrice || product.price}</span>
                {product.salePrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">₹{product.price}</span>
                )}
              </div>
            </div>
            <button className="bg-pink-600 text-white px-12 py-3 rounded-full text-lg font-medium hover:bg-pink-700 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

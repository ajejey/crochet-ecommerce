import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCart from './components/AddToCart';
import ImageGallery from './components/ImageGallery';
import ProductReviews from './components/ProductReviews';
// import RelatedProducts from './components/RelatedProducts';
import { Suspense } from 'react';
import { getProduct } from '../actions';
import { Hand, Lock, RotateCcw, Truck } from 'lucide-react';

// Metadata for SEO
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  if (!product) return {};

  return {
    title: `${product.name} - Handmade Crochet | Your Store Name`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0],
    },
    // Add structured data for rich results
    other: {
      'og:type': 'product',
      'og:availability': product.stockCount > 0 ? 'in stock' : 'out of stock',
      'og:price:amount': product.price,
      'og:price:currency': 'USD',
    }
  };
}

async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
  {/* Elegant container with subtle shadow */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    {/* Refined Breadcrumb */}
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
      <a href="/" className="hover:text-gray-900 transition-colors">Home</a>
      <span className="text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </span>
      <a href={`/category/${product.category}`} className="hover:text-gray-900 transition-colors">
        {product.category}
      </a>
      <span className="text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </span>
      <span className="text-gray-900 font-medium">{product.name}</span>
    </nav>

    {/* Main Product Section */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Image Gallery Section with refined spacing */}
        <div className="p-6 sm:p-8 bg-gray-50">
          <Suspense fallback={
            <div className="aspect-square bg-gray-100 animate-pulse rounded-xl" />
          }>
            <ImageGallery images={product.images} productName={product.name} />
          </Suspense>
        </div>

        {/* Product Info Section with enhanced typography */}
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col h-full">
            {/* Category Tag */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-800 mb-4 w-fit">
              {product.category}
            </span>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl tracking-tight">
              {product.name}
            </h1>

            {/* Price and Rating with refined styling */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
                {product.stockCount > 0 ? (
                  <span className="mt-1 inline-flex items-center text-sm font-medium text-green-600">
                    <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    In Stock
                  </span>
                ) : (
                  <span className="mt-1 inline-flex items-center text-sm font-medium text-red-600">
                    <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Out of Stock
                  </span>
                )}
              </div>
              
              <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    ({product.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Description with elegant typography */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              <div className="mt-4 prose prose-sm text-gray-600 leading-relaxed">
                {product.description}
              </div>
            </div>

            {/* Product Specifications with refined design */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">Details</h2>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="bg-gray-50 px-4 py-3 rounded-lg">
                  <dt className="text-sm text-gray-500">Material</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{product.material}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-3 rounded-lg">
                  <dt className="text-sm text-gray-500">Size</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{product.size}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-3 rounded-lg">
                  <dt className="text-sm text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{product.category}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-3 rounded-lg">
                  <dt className="text-sm text-gray-500">Stock</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{product.stockCount} units</dd>
                </div>
              </dl>
            </div>

            {/* Add to Cart Section */}
            <div className="mt-8 sm:mt-auto">
              <AddToCart product={product} />
            </div>

            {/* Trust Badges with refined design */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 pt-8 border-t border-gray-100">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="mt-2 text-xs font-medium text-gray-600">Free Shipping</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <p className="mt-2 text-xs font-medium text-gray-600">Handmade</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="mt-2 text-xs font-medium text-gray-600">Secure Payment</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
                <p className="mt-2 text-xs font-medium text-gray-600">30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Reviews Section with enhanced styling */}
    <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-xl" />}>
        <ProductReviews productId={params.id} />
      </Suspense>
    </div>

    {/* Related Products Section */}
    {/* <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-xl" />}>
        <RelatedProducts 
          category={product.category} 
          currentProductId={params.id} 
        />
      </Suspense>
    </div> */}
  </div>
</main>
  );
}

export default ProductPage;
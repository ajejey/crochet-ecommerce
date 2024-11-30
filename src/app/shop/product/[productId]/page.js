import { getProduct, getProductReviews } from '../../actions';
import { notFound } from 'next/navigation';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import ProductReviews from './components/ProductReviews';
import { Suspense } from 'react';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export async function generateMetadata({ params }) {
  const product = await getProduct(params.productId);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }

  return {
    title: `${product.name} | Crochet Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.mainImage],
    },
  };
}

export default async function ProductPage({ params }) {
  const [product, initialReviews] = await Promise.all([
    getProduct(params.productId),
    getProductReviews(params.productId, 1)
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Gallery */}
        <div className="sticky top-8">
          <Suspense fallback={<LoadingSpinner />}>
            <ProductGallery images={product.images} name={product.name} />
          </Suspense>
        </div>

        {/* Product Information */}
        <div>
          <Suspense fallback={<LoadingSpinner />}>
            <ProductInfo product={product} initialReviews={initialReviews} />
          </Suspense>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <Suspense fallback={<LoadingSpinner />}>
          <ProductReviews
            productId={params.productId}
            initialReviews={initialReviews}
          />
        </Suspense>
      </div>
    </div>
  );
}


import { getProduct, getProductReviews } from '../../actions';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import MainLayout from './components/MainLayout';

export async function generateMetadata({ params }) {
  const product = await getProduct(params.productId);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }

  return {
    title: `${product.name}`,
    description: product.description?.short || product.description?.full || product.name,
    keywords: product.metadata.searchKeywords,
    alternates: {
      canonical: `https://www.knitkart.in/shop/product/${product.slug}`
    },
    openGraph: {
      title: product.name,
      description: product.description?.short || product.description?.full || product.name,
      images: [product.images[0].url],
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
    <div className="max-w-7xl mx-auto">
      <Suspense fallback={<LoadingSpinner />}>
        <MainLayout product={product} initialReviews={initialReviews} params={params} />
      </Suspense>
    </div>
  );
}

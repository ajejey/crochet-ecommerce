
import { getProduct } from '../../actions';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import MainLayout from './components/MainLayout';

export async function generateMetadata({ params }) {
  // Using the cached getProduct function - only minimal data needed for metadata
  const product = await getProduct(params.productId, { includeSeller: false });
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }

  // Generate the absolute URL for our optimized OG image
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.knitkart.in';
  const optimizedImageUrl = `${baseUrl}/api/og-image/${params.productId}`;

  return {
    title: `${product.name}`,
    description: product.description?.short || product.description?.full || product.name,
    keywords: product.metadata?.searchKeywords || [],
    alternates: {
      canonical: `https://www.knitkart.in/shop/product/${product._id}`
    },
    openGraph: {
      title: product.name,
      description: product.description?.short || product.description?.full || product.name,
      images: product.images && product.images.length > 0 ? [{
        url: product.images[0].url,
        width: 1200,
        height: 630,
        alt: product.name
      }] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  // Only fetch the product data initially - reviews will be loaded later
  const product = await getProduct(params.productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Suspense fallback={<LoadingSpinner />}>
        <MainLayout product={product} productId={params.productId} params={params} />
      </Suspense>
    </div>
  );
}

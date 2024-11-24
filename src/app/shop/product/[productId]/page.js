import { getProduct, getProductReviews } from '../../actions';
import { notFound } from 'next/navigation';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import ProductReviews from './components/ProductReviews';
import RelatedProducts from './components/RelatedProducts';

export default async function ProductPage({ params }) {
  const [product, reviews] = await Promise.all([
    getProduct(params.productId),
    getProductReviews(params.productId)
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-12">
      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Gallery */}
        <ProductGallery images={product.image_urls || []} />

        {/* Right Column - Product Info */}
        <ProductInfo product={product} />
      </div>

      {/* Reviews Section */}
      <ProductReviews 
        productId={params.productId}
        initialReviews={reviews}
        reviewsCount={product.reviews_count}
        averageRating={product.rating}
      />

      {/* Related Products */}
      <RelatedProducts 
        category={product.category}
        currentProductId={params.productId}
      />
    </div>
  );
}

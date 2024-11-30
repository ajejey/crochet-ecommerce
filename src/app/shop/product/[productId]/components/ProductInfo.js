'use client';

import { useState } from 'react';
import { useCart } from '@/app/components/CartProvider';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/format';

export default function ProductInfo({ product, initialReviews }) {
  console.log("product ", product)
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  console.log("initialReviews ", initialReviews)

  const stockQuantity = product.inventory?.stockCount || 0;
  const maxQuantity = Math.min(10, stockQuantity);

  const handleAddToCart = async () => {
    try {
      const result = await addToCart(product._id, quantity);
      if (result.success) {
        toast.success('Added to cart!');
      } else {
        toast.error(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="space-y-6">
      {/* Title and Rating */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">
              {(product.averageRating || 0).toFixed(1)} ({product.totalReviews || 0} reviews)
            </span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-600">By {product.sellerName}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        {product.salePrice ? (
          <>
            <span className="text-3xl font-bold text-purple-600">
              {formatPrice(product.salePrice)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
          </>
        ) : (
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Description</h2>
        <p className="mt-2 text-gray-600">{product.description}</p>
      </div>

      {/* Product Details */}
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Material</dt>
            <dd className="mt-1 text-sm text-gray-900">{product.material}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Size</dt>
            <dd className="mt-1 text-sm text-gray-900">{product.size}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Category</dt>
            <dd className="mt-1 text-sm text-gray-900">{product.category}</dd>
          </div>
        </dl>
      </div>

      {/* Add to Cart */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-4">
          <div className="w-24">
            <label htmlFor="quantity" className="sr-only">
              Quantity
            </label>
            <select
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="block w-full rounded-md border-gray-300 py-1.5 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              disabled={stockQuantity === 0}
            >
              {Array.from({ length: maxQuantity }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={stockQuantity === 0}
            className="flex-1 flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <button
            onClick={toggleWishlist}
            className="rounded-md p-2 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

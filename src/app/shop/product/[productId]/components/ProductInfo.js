'use client';

import { useState } from 'react';
import { useCart } from '@/app/components/CartProvider';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.$id, quantity);
      toast.success('Added to cart!');
    } catch (error) {
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
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(product.rating || 0)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.reviews_count} reviews
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-4">
        {product.sale_price ? (
          <>
            <span className="text-3xl font-bold text-purple-600">
              ${product.sale_price.toFixed(2)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-3xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="prose prose-sm">
        <p>{product.description}</p>
      </div>

      {/* Stock Status */}
      <div>
        <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="rounded-lg border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500"
          disabled={product.stock === 0}
        >
          {[...Array(Math.min(10, product.stock))].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </button>
        <button
          onClick={toggleWishlist}
          className={`p-3 rounded-lg border ${
            isWishlisted
              ? 'bg-pink-50 border-pink-200 text-pink-600'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Heart
            className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`}
          />
        </button>
      </div>
    </div>
  );
}

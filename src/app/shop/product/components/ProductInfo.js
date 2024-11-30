'use client';

import { useState } from 'react';
import { Star, Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '@/app/shop/cart/actions';

export default function ProductInfo({ product, formatPrice }) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart successfully!');
    } catch (error) {
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title and Rating */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="text-2xl font-bold text-gray-900">
        {formatPrice(product.price)}
      </div>

      {/* Description */}
      <div className="prose prose-sm">
        <p>{product.description}</p>
      </div>

      {/* Stock Status */}
      <div>
        <p className={`text-sm ${
          product.stock > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {product.stock > 0 
            ? `${product.stock} items in stock`
            : 'Out of stock'
          }
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Quantity:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product.stock}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.stock === 0}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <ShoppingCart className="h-5 w-5" />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
        <button
          className="p-3 border rounded-lg hover:bg-gray-50"
          aria-label="Add to wishlist"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {/* Seller Info */}
      <div className="pt-6 border-t">
        <h3 className="text-sm font-medium text-gray-900">Seller Information</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-600">{product.sellerName}</p>
          {product.sellerEmail && (
            <a
              href={`mailto:${product.sellerEmail}`}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Contact Seller
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

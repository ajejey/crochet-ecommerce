'use client';

import { useState } from 'react';
import { Star, Minus, Plus, ShoppingCart, Heart, Package, Ruler, Palette, Award, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/app/components/CartProvider';
import Link from 'next/link';

export default function ProductInfo({ product, initialReviews }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const stockQuantity = product.inventory?.stockCount || 0;
  const allowBackorder = product.inventory?.allowBackorder || false;
  const madeToOrderDays = product.inventory?.madeToOrderDays || 7;
  const currentQuantityInCart = cart.items.find(item => item._id === product._id)?.quantity || 0;
  const remainingStock = stockQuantity - currentQuantityInCart;

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= remainingStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (remainingStock < quantity && !allowBackorder) {
      toast.error(`Only ${remainingStock} items available`);
      return;
    }
    
    // If made-to-order is allowed but there's not enough stock, show a made-to-order message
    if (remainingStock < quantity && allowBackorder) {
      toast.info(`${quantity - remainingStock} item(s) will be made to order and delivered in ${madeToOrderDays} days`);
    }

    const result = await addToCart(product, quantity);
    if (result.success) {
      toast.success('Added to cart!');
      setQuantity(1); // Reset quantity after successful add
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="space-y-8 p-4">
      {/* Title and Badges */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded-full">
            Handmade
          </span>
          {stockQuantity <= 5 && stockQuantity > 0 && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
              Only {stockQuantity} left
            </span>
          )}
          {stockQuantity === 0 && allowBackorder && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Made to Order ({madeToOrderDays} days)
            </span>
          )}
          {remainingStock !== null && remainingStock < stockQuantity && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {remainingStock} available to add
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        
        {/* Seller and Rating */}
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-900">
              {(product.averageRating || 0).toFixed(1)}
            </span>
            <span className="ml-1 text-sm text-gray-500">
              ({product.totalReviews || 0} reviews)
            </span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-600">
            By <Link href={`/creators/${product.sellerId}`} className="font-medium text-gray-900 hover:text-rose-600 transition-colors">{product.sellerName}</Link>
          </span>
        </div>
      </div>

      {/* Price and Stock */}
      <div className="bg-pink-50 rounded-xl p-6">
        <div className="flex items-center gap-3">
          {product.salePrice ? (
            <>
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.salePrice}
              </span>
              <span className="text-xl text-gray-500 line-through">
                ₹{product.price}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-gray-900">
              ₹{product.price}
            </span>
          )}
        </div>
        
        {/* Stock Status */}
        <div className="mt-2 flex items-center text-sm">
          {stockQuantity > 0 ? (
            <span className="text-green-600 flex items-center gap-1">
              <Package className="h-4 w-4" />
              In Stock
            </span>
          ) : allowBackorder ? (
            <span className="text-amber-600 flex items-center gap-1">
              <Package className="h-4 w-4" />
              Made to Order ({madeToOrderDays} days delivery)
            </span>
          ) : (
            <span className="text-red-600 flex items-center gap-1">
              <Package className="h-4 w-4" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Quick Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <Ruler className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Size</p>
            <p className="text-sm text-gray-500">{product.size}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Palette className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Material</p>
            <p className="text-sm text-gray-500">{product.material}</p>
          </div>
        </div>
      </div>

      {/* Add to Cart Section */}
      <div className="space-y-4">
        {remainingStock > 0 && (
          <div className="flex items-center gap-4">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className={`p-2 rounded-full ${
                  quantity <= 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-gray-900 text-lg font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= remainingStock && !allowBackorder}
                className={`p-2 rounded-full ${
                  quantity >= remainingStock && !allowBackorder
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stock status */}
        <div className="mt-4">
          {remainingStock > 0 ? (
            <p className="text-sm text-gray-500">
              {remainingStock < 5 ? `Only ${remainingStock} left in stock!` : 'In stock'}
            </p>
          ) : allowBackorder ? (
            <p className="text-sm text-amber-500">Made to order - will be delivered in {madeToOrderDays} days</p>
          ) : (
            <p className="text-sm text-red-500">Out of stock</p>
          )}
        </div>

        {/* Add to cart and wishlist buttons */}
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleAddToCart}
            disabled={remainingStock < 1 && !allowBackorder}
            className={`flex-1 flex items-center justify-center px-8 py-3 rounded-md text-base font-medium ${
              remainingStock < 1 && !allowBackorder
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {remainingStock < 1 && allowBackorder ? 'Order Now (Made to Order)' : 'Add to Cart'}
          </button>
          <button
            onClick={toggleWishlist}
            className={`p-3 rounded-md border ${
              isWishlisted
                ? 'border-rose-600 text-rose-600 hover:bg-rose-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-gray-200 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <Award className="h-6 w-6 text-pink-600" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Handcrafted Quality</h3>
              <p className="mt-1 text-sm text-gray-500">Each piece is carefully made by skilled artisans</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-6 w-6 text-pink-600" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Made to Order</h3>
              <p className="mt-1 text-sm text-gray-500">Custom-made with attention to detail</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-pink-600" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Satisfaction Guaranteed</h3>
              <p className="mt-1 text-sm text-gray-500">Love it or return it within 7 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Short Description */}
      {product.description?.short && (
        <div className="border-t border-gray-200 pt-8">
          <p className="text-base text-gray-600">{product.description.short}</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/app/components/CartProvider';
import { Star, ShoppingCart, Heart, Package, Ruler, Palette, Award, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/format';

export default function ProductInfo({ product, initialReviews }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getRemainingStock, cartItems } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const stockQuantity = product.inventory?.stockCount || 0;
  
  // Calculate remaining stock (considering items already in cart)
  const remainingStock = getRemainingStock(product._id, stockQuantity);
  const maxQuantity = Math.min(10, remainingStock || stockQuantity);
  
  // Check if product can be added to cart
  const isOutOfStock = stockQuantity === 0;
  const canAddToCart = !isOutOfStock && (remainingStock === null || remainingStock > 0);

  // Adjust quantity if it exceeds available stock
  useEffect(() => {
    if (quantity > maxQuantity && maxQuantity > 0) {
      setQuantity(maxQuantity);
    }
  }, [maxQuantity, quantity]);

  const handleAddToCart = async () => {
    if (!canAddToCart) {
      toast.error('Cannot add to cart', {
        description: isOutOfStock ? 'Product is out of stock' : 'No more items available'
      });
      return;
    }
    
    try {
      // Prepare product data to avoid database lookup
      const productData = {
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        description: product.description,
        images: product.images || [{ url: product.mainImage || '/placeholder-product.jpg' }],
        inventory: {
          stockCount: stockQuantity
        },
        status: product.status || 'active'
      };

      const result = await addToCart({
        productId: product._id,
        quantity,
        productData
      });
      
      if (result.success) {
        toast.success('Added to cart!');
      } else {
        if (result.stockCheck) {
          toast.error('Limited stock', {
            description: result.stockCheck.reason
          });
          
          // If we can add some but not all requested items
          if (result.stockCheck.canAdd && result.stockCheck.availableToAdd > 0) {
            setQuantity(result.stockCheck.availableToAdd);
          }
        } else {
          toast.error(result.error || 'Failed to add to cart');
        }
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
            By <span className="font-medium text-gray-900">{product.sellerName}</span>
          </span>
        </div>
      </div>

      {/* Price and Stock */}
      <div className="bg-pink-50 rounded-xl p-6">
        <div className="flex items-center gap-3">
          {product.salePrice ? (
            <>
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        
        {/* Stock Status */}
        <div className="mt-2 flex items-center text-sm">
          {stockQuantity > 0 ? (
            <span className="text-green-600 flex items-center gap-1">
              <Package className="h-4 w-4" />
              In Stock
              {remainingStock !== null && remainingStock < stockQuantity && (
                <span className="ml-1 text-blue-600">
                  ({remainingStock} available to add)
                </span>
              )}
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
        {canAddToCart && maxQuantity > 0 && (
          <div className="flex items-center gap-4">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
              Quantity
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="rounded-lg border-gray-300 text-gray-900 text-sm focus:ring-pink-500 focus:border-pink-500"
            >
              {[...Array(maxQuantity)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart || maxQuantity === 0}
            className={`flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
              canAddToCart && maxQuantity > 0
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            {isOutOfStock 
              ? 'Out of Stock' 
              : maxQuantity === 0 
                ? 'Maximum in Cart' 
                : 'Add to Cart'}
          </button>
          <button
            onClick={toggleWishlist}
            className={`p-3 rounded-lg border ${
              isWishlisted
                ? 'bg-pink-50 border-pink-200 text-pink-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
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

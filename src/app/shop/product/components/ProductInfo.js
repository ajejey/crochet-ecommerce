'use client';

import { useState, useEffect } from 'react';
import { Star, Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/app/components/CartProvider';

export default function ProductInfo({ product, formatPrice }) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart, getRemainingStock } = useCart();

  // Get stock count from product
  const stockCount = product.stock || 0;
  
  // Calculate remaining stock (considering items already in cart)
  const remainingStock = getRemainingStock(product._id, stockCount);
  
  // Check if product can be added to cart
  const isOutOfStock = stockCount === 0;
  const canAddToCart = !isOutOfStock && (remainingStock === null || remainingStock > 0);
  
  // Calculate max quantity that can be added
  const maxQuantity = Math.min(stockCount, remainingStock || stockCount);

  // Adjust quantity if it exceeds available stock
  useEffect(() => {
    if (quantity > maxQuantity && maxQuantity > 0) {
      setQuantity(maxQuantity);
    }
  }, [maxQuantity, quantity]);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!canAddToCart) {
      toast.error('Cannot add to cart', {
        description: isOutOfStock ? 'Product is out of stock' : 'No more items available'
      });
      return;
    }
    
    setIsAddingToCart(true);
    try {
      // Prepare product data to avoid database lookup
      const productData = {
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        description: product.description,
        image: product.mainImage || '/placeholder-product.jpg',
        images: product.images || [{ url: product.mainImage || '/placeholder-product.jpg' }],
        inventory: {
          stockCount: stockCount
        },
        status: product.status || 'active'
      };

      const result = await addToCart({
        productId: product._id,
        quantity,
        productData
      });
      
      if (result.success) {
        toast.success('Added to cart successfully!');
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
          toast.error(result.error || 'Failed to add to cart. Please try again.');
        }
      }
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
          canAddToCart ? 'text-green-600' : 'text-red-600'
        }`}>
          {isOutOfStock 
            ? 'Out of stock'
            : remainingStock === 0
              ? 'Maximum quantity already in cart'
              : remainingStock !== null && remainingStock < stockCount
                ? `${remainingStock} more available to add`
                : `${stockCount} items in stock`
          }
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Quantity:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || !canAddToCart}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= maxQuantity || !canAddToCart}
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
          disabled={isAddingToCart || !canAddToCart}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg ${
            canAddToCart 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
          {isAddingToCart 
            ? 'Adding...' 
            : isOutOfStock 
              ? 'Out of Stock' 
              : remainingStock === 0 
                ? 'Maximum in Cart' 
                : 'Add to Cart'}
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

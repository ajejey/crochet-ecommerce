'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { addToCart } from '../actions/cart';
import { toast } from 'sonner';
import { useCart } from '@/app/components/CartProvider';
import { formatPrice } from '@/utils/format';

export default function ProductCard({ product }) {
  const { addToCart: addToCartContext, cartItems, getRemainingStock } = useCart();

  // Get stock count from product - Fix: use inventory.stockCount instead of stock
  const stockCount = product.inventory?.stockCount || 0;
  
  // Calculate remaining stock (considering items already in cart)
  const remainingStock = getRemainingStock(product._id, stockCount);
  
  // Check if product can be added to cart
  const isOutOfStock = stockCount === 0;
  const isInStock = stockCount > 0;
  const canAddToCart = isInStock && (remainingStock === null || remainingStock > 0);

  // Debug stock values
  console.log('Product:', product.name);
  console.log('Stock Count:', stockCount);
  console.log('Remaining Stock:', remainingStock);
  console.log('Can Add To Cart:', canAddToCart);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!canAddToCart) {
      toast.error('Cannot add to cart', {
        description: isOutOfStock ? 'Product is out of stock' : 'No more items available'
      });
      return;
    }
    
    try {
      // Pass product data to avoid database lookup
      const productData = {
        name: product.name,
        price: product.price,
        description: product.description || '',
        image: product.mainImage || '/placeholder-product.jpg',
        images: product.images || [{ url: product.mainImage || '/placeholder-product.jpg' }],
        inventory: {
          stockCount: stockCount
        },
        status: product.status || 'active'
      };

      // Use the context function that updates local state immediately
      const result = await addToCartContext({
        productId: product._id,
        quantity: 1,
        productData
      });

      if (result.success) {
        toast.success('Added to cart', {
          description: 'Product has been added to your cart successfully.'
        });
      } else {
        if (result.stockCheck) {
          toast.error('Limited stock', {
            description: result.stockCheck.reason
          });
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to add product to cart. Please try again.'
      });
    }
  };

  return (
    <Link href={`/shop/product/${product._id}`}>
      <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Sale Badge */}
        {product.salePrice && (
          <div className="absolute top-2 left-2 z-10 bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            SALE
          </div>
        )}
        
        {/* Wishlist Button */}
        <button 
          className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full hover:bg-rose-50 transition-colors shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            toast.success('Added to wishlist');
          }}
        >
          <Heart className="w-3.5 h-3.5 text-gray-400 hover:text-rose-600 transition-colors" />
        </button>

        {/* Image */}
        <div className="aspect-square relative overflow-hidden bg-gray-50">
          <Image
            src={product.mainImage || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Category */}
          <div className="text-[10px] sm:text-xs font-medium text-rose-600 tracking-wider uppercase mb-1">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-gray-700">
                {product.averageRating.toFixed(1)}
              </span>
              {product.totalReviews > 0 && (
                <span className="text-xs text-gray-500">
                  ({product.totalReviews})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base sm:text-xl font-bold text-gray-900">
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className={`w-full py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm
              ${canAddToCart 
                ? 'bg-rose-600 text-white hover:bg-rose-700' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {isOutOfStock ? 'Out of Stock' : remainingStock === 0 ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>

        {/* Stock Status */}
        {stockCount <= 5 && stockCount > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-orange-100 text-orange-800 text-[10px] text-center py-0.5">
            Only {stockCount} left in stock
          </div>
        )}
        {stockCount === 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-100 text-red-800 text-[10px] text-center py-0.5">
            Out of Stock
          </div>
        )}
      </div>
    </Link>
  );
}

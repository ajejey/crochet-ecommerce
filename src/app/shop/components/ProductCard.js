'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/app/components/CartProvider';
import { formatPrice } from '@/utils/format';

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart();

  // Get inventory details from product
  const stockCount = product.inventory?.stockCount || 0;
  const allowBackorder = product.inventory?.allowBackorder || false;
  const madeToOrderDays = product.inventory?.madeToOrderDays || 7;
  const currentQuantityInCart = cart.items.find(item => item._id === product._id)?.quantity || 0;
  const remainingStock = stockCount - currentQuantityInCart;

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button

    if (remainingStock < 1 && !allowBackorder) {
      toast.error('Product is out of stock');
      return;
    }

    const result = await addToCart(product, 1);
    console.log("result product card", result);
    if (!result) {
      toast.error('Failed to add to cart product card');
    }
  };

  return (
    <Link href={`/shop/product/${product._id}`} className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
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
        
        {/* Seller/Artisan Name */}
        {product.seller && (
          <div className="text-[10px] sm:text-xs text-gray-500 mb-1 flex items-center">
            <span className="truncate">By </span>
            <Link 
              href={`/creators/${product.sellerId}`} 
              className="truncate ml-1 hover:text-rose-600 transition-colors"
              onClick={(e) => e.stopPropagation()} // Prevent triggering the parent link
            >
              {product.seller.businessName}
            </Link>
          </div>
        )}

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
          disabled={remainingStock < 1 && !allowBackorder}
          className={`w-full py-2 mb-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm
            ${remainingStock < 1 && !allowBackorder
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-rose-600 hover:bg-rose-700 text-white'}`}
        >
          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {remainingStock < 1 ? (allowBackorder ? 'Made to Order' : 'Out of Stock') : 'Add to Cart'}
        </button>
      </div>

      {/* Stock Status */}
      {remainingStock < 5 && remainingStock > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-orange-100 text-orange-800 text-[10px] text-center py-0.5">
          Only {remainingStock} left in stock
        </div>
      )}
      {remainingStock === 0 && (
        <div className="absolute mt-2 bottom-0 left-0 right-0 bg-red-100 text-red-800 text-[10px] text-center py-0.5">
          {allowBackorder ? `Made to Order (${madeToOrderDays} days)` : 'Out of Stock'}
        </div>
      )}
    </Link>
  );
}

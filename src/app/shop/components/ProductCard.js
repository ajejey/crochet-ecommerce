'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { addToCart } from '../actions/cart';
import { toast } from 'sonner';
import { useCart } from '@/app/components/CartProvider';
import { formatPrice } from '@/utils/format';

export default function ProductCard({ product }) {
  const { refreshCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      const result = await addToCart({
        productId: product._id,
        quantity: 1
      });

      if (result.success) {
        toast.success('Added to cart', {
          description: 'Product has been added to your cart successfully.'
        });
        refreshCart();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to add product to cart. Please try again.'
      });
    }
  };

  return (
    <Link href={`/shop/product/${product._id}`}>
      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Sale Badge */}
        {product.salePrice && (
          <div className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            SALE
          </div>
        )}
        
        {/* Wishlist Button */}
        <button 
          className="absolute top-3 right-3 z-10 p-2.5 bg-white rounded-full hover:bg-rose-50 transition-colors shadow-md"
          onClick={(e) => {
            e.preventDefault();
            toast.success('Added to wishlist');
          }}
        >
          <Heart className="w-4 h-4 text-gray-400 hover:text-rose-600 transition-colors" />
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
        <div className="p-5">
          {/* Category */}
          <div className="text-xs font-medium text-rose-600 tracking-wider uppercase mb-2">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-gray-700">
                {product.averageRating.toFixed(1)}
              </span>
              {product.totalReviews > 0 && (
                <span className="text-sm text-gray-500">
                  ({product.totalReviews})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-rose-600 text-white py-3 rounded-xl font-medium hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>

        {/* Stock Status */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-orange-100 text-orange-800 text-xs text-center py-1">
            Only {product.stock} left in stock
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-100 text-red-800 text-xs text-center py-1">
            Out of Stock
          </div>
        )}
      </div>
    </Link>
  );
}

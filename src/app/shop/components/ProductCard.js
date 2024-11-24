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
        productId: product.$id,
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
    <Link href={`/shop/product/${product.$id}`}>
      <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Sale Badge */}
        {product.sale_price && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
        
        {/* Wishlist Button */}
        <button 
          className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          onClick={(e) => {
            e.preventDefault();
            toast.success('Added to wishlist');
          }}
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>

        {/* Image */}
        <div className="aspect-square relative overflow-hidden bg-gray-100 mb-2">
          <Image
            src={product.image_urls?.[0] || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <div className="text-xs text-purple-600 font-medium mb-1">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">
                {product.rating.toFixed(1)}
              </span>
              {product.reviews_count && (
                <span className="text-xs text-gray-500">
                  ({product.reviews_count})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-gray-800">
              {formatPrice(product.sale_price || product.price)}
            </span>
            {product.sale_price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
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

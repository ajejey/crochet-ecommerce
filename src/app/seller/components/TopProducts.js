'use client';

import { formatPrice } from '@/utils/format';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function TopProducts({ products, loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Top Products</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="h-16 w-16 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Top Products</h2>
        <div className="text-center py-6">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No products yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Top Products</h2>
      <div className="space-y-4">
        {products.map((product) => (
          <Link 
            key={product._id}
            href={`/seller/products/${product._id}`}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="relative h-16 w-16 rounded-lg overflow-hidden">
              <Image
                src={product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">{product.name}</p>
                <p className="font-medium">{formatPrice(product.price)}</p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-600">
                  {product.metadata?.totalSales || 0} sales
                </p>
                <p className="text-sm text-gray-600">
                  {product.inventory?.stockCount || 0} in stock
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link 
        href="/seller/products" 
        className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-4"
      >
        View All Products →
      </Link>
    </div>
  );
}

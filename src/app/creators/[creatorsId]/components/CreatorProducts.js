'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import Pagination from '@/app/components/Pagination';
import { formatPrice } from '@/utils/format';

export default function CreatorProducts({ initialProducts, creatorId }) {
  const searchParams = useSearchParams();
  const { products, pagination } = initialProducts;

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Products</h2>
        <select
          className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md"
          value={searchParams.get('sort') || 'newest'}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            params.set('sort', e.target.value);
            params.set('page', '1');
            window.location.href = `/creators/${creatorId}?${params.toString()}`;
          }}
        >
          <option value="newest">Newest First</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Products Grid */}
      <div 
        className="grid gap-4 sm:gap-6"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))'
        }}
      >
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/shop/product/${product._id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-200 hover:-translate-y-1">
              {/* Product Image */}
              <div className="relative aspect-square">
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
                  {product.name}
                </h3>

                <div className="mt-1 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                  {product.metadata?.rating && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-xs text-gray-600">
                        {product.metadata.rating.average.toFixed(1)} ({product.metadata.rating.count})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination {...pagination} />
        </div>
      )}
    </div>
  );
}

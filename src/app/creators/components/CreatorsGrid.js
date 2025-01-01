'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/app/components/Pagination';

export default function CreatorsGrid({ creators, pagination }) {
  const searchParams = useSearchParams();

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="flex justify-end">
        <select
          className="block w-48 pl-3 pr-10 py-2 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 rounded-lg bg-white shadow-sm transition-shadow duration-200"
          value={searchParams.get('sort') || 'newest'}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            params.set('sort', e.target.value);
            params.set('page', '1');
            window.location.href = `/creators?${params.toString()}`;
          }}
        >
          <option value="newest">Newest First</option>
          <option value="rating">Highest Rated</option>
          <option value="popular">Most Popular</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {creators.map((creator) => (
          <Link
            key={creator.userId}
            href={`/creators/${creator.userId}`}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/50 overflow-hidden transition duration-300 hover:shadow-md hover:-translate-y-1">
              {/* Creator Banner/Image */}
              <div className="relative h-40 sm:h-48 bg-gray-50">
                {creator.bannerImage ? (
                  <Image
                    src={creator.bannerImage.url}
                    alt={creator.bannerImage.alt || creator.businessName}
                    fill
                    className="object-cover transition duration-700 ease-in-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-gray-100" />
                )}
              </div>

              {/* Creator Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 truncate group-hover:text-rose-600 transition-colors">
                    {creator.businessName}
                  </h3>
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                      {creator.metadata.rating.average.toFixed(1)} ({creator.metadata.rating.count})
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2">
                  {creator.description || 'Crafting beautiful crochet pieces'}
                </p>
                
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">
                    {creator.metadata.productsCount} {creator.metadata.productsCount === 1 ? 'Product' : 'Products'}
                  </span>
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

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
          className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <Link
            key={creator.userId}
            href={`/creators/${creator.userId}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:-translate-y-1">
              {/* Creator Banner/Image */}
              <div className="relative h-48 bg-gray-100">
                {creator.bannerImage ? (
                  <Image
                    src={creator.bannerImage.url}
                    alt={creator.bannerImage.alt || creator.businessName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-rose-50 flex items-center justify-center">
                    <span className="text-rose-500 text-lg font-medium">
                      {creator.businessName[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Creator Info */}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-rose-600 transition-colors">
                  {creator.businessName}
                </h3>
                
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {creator.description || 'Crafting beautiful crochet pieces'}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                      {creator.metadata.rating.average.toFixed(1)} ({creator.metadata.rating.count})
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {creator.metadata.productsCount} products
                  </span>
                </div>

                {creator.specialties && creator.specialties.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {creator.specialties.slice(0, 3).map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
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

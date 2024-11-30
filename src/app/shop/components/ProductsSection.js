'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { Loader2, Star, Search } from 'lucide-react';
import debounce from 'lodash/debounce';
import { getActiveProducts } from '../actions';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import { PRODUCT_CATEGORIES } from '@/constants/product';

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(price);
};

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' }
];

// Create a fetcher that uses our server action
const fetcher = async (key) => {
  const params = new URLSearchParams(key.split('?')[1]);
  const filters = Object.fromEntries(params.entries());
  return getActiveProducts(filters);
};

// SWR configuration for infinite scroll
const getKey = (pageIndex, previousPageData, filters) => {
  if (previousPageData && !previousPageData.pagination.hasMore) return null;
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  params.set('page', pageIndex + 1);
  return `/shop/products?${params.toString()}`;
};

export default function ProductsSection({ initialData, currentFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState(currentFilters.search || '');
  const [filters, setFilters] = useState(currentFilters);
  const { ref, inView } = useInView();

  // Use SWR infinite for pagination
  const { data, size, setSize, isValidating } = useSWRInfinite(
    (...args) => getKey(...args, filters),
    fetcher,
    {
      fallbackData: [initialData],
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      persistSize: true,
    }
  );

  const isLoading = isValidating;
  const allProducts = data ? data.flatMap(page => page.products) : [];
  const hasMore = data?.[data.length - 1]?.pagination.hasMore ?? false;

  // Update URL and filters
  const updateFilters = useCallback(async (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
    setFilters(newFilters);
  }, [pathname, router]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    updateFilters(newFilters);
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      const newFilters = { ...filters, search: value, page: 1 };
      updateFilters(newFilters);
    }, 500),
    [filters, updateFilters]
  );

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  // Handle infinite scroll
  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      setSize(size + 1);
    }
  }, [inView, isLoading, hasMore, setSize, size]);

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex gap-4 items-center">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {PRODUCT_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
        <span className="text-sm text-gray-600">Price Range:</span>
        <input
          type="number"
          min="0"
          step="100"
          value={filters.minPrice || ''}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          placeholder="Min"
          className="border rounded-lg px-3 py-1 w-24 focus:ring-2 focus:ring-blue-500"
        />
        <span>-</span>
        <input
          type="number"
          min="0"
          step="100"
          value={filters.maxPrice || ''}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          placeholder="Max"
          className="border rounded-lg px-3 py-1 w-24 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts.map((product) => (
          <Link
            key={product._id}
            href={`/shop/product/${product._id}`}
            className="group"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-square">
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={false}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {(product.averageRating || 0).toFixed(1)} ({product.totalReviews || 0})
                  </span>
                </div>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {formatPrice(product.price)}
                </p>
                <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                  By {product.sellerName}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More / Loading Indicator */}
      <div ref={ref} className="flex justify-center py-8">
        {isLoading && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more products...</span>
          </div>
        )}
      </div>
    </div>
  );
}

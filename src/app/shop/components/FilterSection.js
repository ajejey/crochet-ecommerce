'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import debounce from 'lodash/debounce';
import { PRODUCT_CATEGORIES } from '@/constants/product';

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' }
];

export default function FilterSection({ initialFilters = {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState(initialFilters?.search || '');
  const [filters, setFilters] = useState(initialFilters);

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

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="flex flex-wrap gap-3">
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            key={category.value}
            onClick={() => handleFilterChange('category', category.value)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
              ${filters.category === category.value
                ? 'bg-rose-600 text-white shadow-md hover:bg-rose-700'
                : 'bg-white text-gray-700 hover:bg-rose-50 border border-gray-200 hover:border-rose-200'
              }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Sort and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 bg-white shadow-sm"
          />
        </div>

        <select
          value={filters.sort || 'latest'}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 bg-white shadow-sm min-w-[180px]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

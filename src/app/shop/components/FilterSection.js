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
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            key={category.value}
            onClick={() => handleFilterChange('category', category.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${filters.category === category.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Sort and Search */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <select
          value={filters.sort || 'latest'}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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

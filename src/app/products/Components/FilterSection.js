'use client';

import { useState, useTransition } from 'react';
import { searchProducts } from '../actions';
import { categories } from '@/constants/constants';

export default function FilterSection({ onProductsUpdate }) {
  const [isPending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  const handleSearch = (newQuery, newCategory) => {
    startTransition(async () => {
      try {
        const results = await searchProducts(newQuery, newCategory);
        onProductsUpdate(results);
      } catch (error) {
        console.error('Search failed:', error);
        // You might want to add error handling UI here
      }
    });
  };

  // Updated handlers
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsFilterOpen(false);
    handleSearch(searchQuery, category);
  };

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    handleSearch(newQuery, selectedCategory);
  };

  return (
    <div className="mb-8">
      {/* Mobile Filter Button */}
      <div className="flex flex-col gap-4 md:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white border 
            border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
          </svg>
          {isPending ? 'Updating...' : 'Filters & Sort'}
        </button>

        {/* Search Bar for Mobile */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-purple-500 
              focus:border-purple-500"
          />
          {isPending && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              Loading...
            </span>
          )}
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <div className={`
        fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40
        ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <div className={`
          fixed inset-y-0 right-0 max-w-full w-full bg-white transform transition-transform
          ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-medium text-gray-900">Filters & Sort</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close panel</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 py-6 px-4 overflow-y-auto">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      disabled={isPending}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${selectedCategory === category
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex md:flex-row justify-between items-center gap-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              disabled={isPending}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-purple-50'
                } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search and Sort */}
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={isPending}
              className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-purple-500 
                focus:border-purple-500"
            />
            {isPending ? (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                Loading...
              </span>
            ) : (
              <svg
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
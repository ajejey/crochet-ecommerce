'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search as SearchIcon, X, Clock, Tag, Percent } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { getSearchSuggestions, logSearchClick } from '../actions/search';
import Image from 'next/image';

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const router = useRouter();
  
  // Get recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Debounce search query
  const debouncedQuery = useDebounce(query, 300);

  // Fetch suggestions
  useEffect(() => {
    async function fetchSuggestions() {
      console.log("Searching for:", debouncedQuery);
      if (debouncedQuery.length >= 2) {
        setIsLoading(true);
        try {
          const results = await getSearchSuggestions(debouncedQuery);
          console.log("Search suggestions results:", results);
          
          // Validate that results is an array and has valid data
          if (Array.isArray(results) && results.length > 0) {
            // Check if any result is missing a phrase
            const hasInvalidResults = results.some(item => !item.phrase);
            if (hasInvalidResults) {
              console.error('Invalid search results detected:', results);
            }
          }
          
          setSuggestions(results);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
        setIsLoading(false);
      } else {
        setSuggestions([]);
      }
    }

    fetchSuggestions();
  }, [debouncedQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add to recent searches
  const addToRecentSearches = useCallback((searchQuery) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, MAX_RECENT_SEARCHES);
    
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }, [recentSearches]);

  // Handle search submission
  const handleSearch = (searchQuery) => {
    if (searchQuery?.trim()) {
      setIsOpen(false);
      const trimmedQuery = searchQuery.trim();
      addToRecentSearches(trimmedQuery);
      
      // Log the search click for improving future suggestions
      logSearchClick(trimmedQuery).catch(console.error);
      
      // Clear the input field after search
      setQuery('');
      setSuggestions([]);
      
      // Navigate to shop page with search query
      router.push(`/shop?search=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const suggestions_length = suggestions.length;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions_length - 1 ? prev + 1 : -1
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > -1 ? prev - 1 : suggestions_length - 1
      );
    } else if (e.key === 'Enter' && selectedIndex > -1) {
      e.preventDefault();
      handleSearch(suggestions[selectedIndex].phrase);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }} 
        className="relative"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for crochet products..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        />
        <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              setSuggestions([]);
            }}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>

      {/* Search Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-[80vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin h-5 w-5 border-2 border-rose-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {/* Recent Searches - Top Section */}
              {!query && recentSearches.length > 0 && (
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-medium text-gray-500 uppercase">Recent Searches</h3>
                    <button 
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem(RECENT_SEARCHES_KEY);
                      }}
                      className="text-xs text-rose-500 hover:text-rose-600"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((phrase) => (
                      <button
                        key={phrase}
                        onClick={() => handleSearch(phrase)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Suggestions */}
              {query && suggestions.length > 0 && (
                <div className="py-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.phrase}
                      onClick={() => handleSearch(suggestion.phrase)}
                      className={`w-full flex items-start px-4 py-3 text-left ${
                        index === selectedIndex ? 'bg-gray-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {suggestion.type === 'product_match' && suggestion.productDetails?.thumbnailImage ? (
                        <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden mr-3 border border-gray-200">
                          <Image 
                            src={suggestion.productDetails.thumbnailImage}
                            alt={suggestion.phrase}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <SearchIcon className="h-5 w-5 mr-3 text-gray-400 mt-1" />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.phrase || 'Unnamed product'}
                          </span>
                          {suggestion.type === 'product_match' && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-rose-50 text-rose-600 rounded flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              Product
                            </span>
                          )}
                        </div>
                        
                        {suggestion.type === 'product_match' && suggestion.productDetails && (
                          <div className="mt-1 flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {suggestion.productDetails.price}
                            </span>
                            {suggestion.productDetails.salePrice && (
                              <span className="ml-2 text-xs text-gray-500 line-through">
                                {suggestion.productDetails.salePrice}
                              </span>
                            )}
                            {suggestion.productDetails.salePrice && (
                              <span className="ml-2 text-xs text-green-600 flex items-center">
                                <Percent className="h-3 w-3 mr-0.5" />
                                Sale
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {suggestion.matchType === 'exact' && (
                        <span className="ml-auto text-xs text-green-600">Exact Match</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {query && !isLoading && suggestions.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No suggestions found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

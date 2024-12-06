'use client';

import { createContext, useContext, useReducer, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const FilterContext = createContext(null);

const initialState = {
  category: '',
  priceRange: { min: '', max: '' },
  materials: [],
  sizes: [],
  colors: [],
  rating: 0,
  availability: 'all', // all, inStock, outOfStock
  sort: 'latest',
  search: '',
};

function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, [action.filter]: action.value };
    case 'RESET_FILTER':
      return { ...state, [action.filter]: initialState[action.filter] };
    case 'RESET_ALL':
      return initialState;
    default:
      return state;
  }
}

export function FilterProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, dispatch] = useReducer(filterReducer, initialState);

  // Update URL with filters
  const updateURL = useCallback((newFilters) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== initialState[key]) {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subValue) {
              params.set(`${key}_${subKey}`, subValue);
            } else {
              params.delete(`${key}_${subKey}`);
            }
          });
        } else {
          params.set(key, value);
        }
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  // Set a single filter
  const setFilter = useCallback((filter, value) => {
    dispatch({ type: 'SET_FILTER', filter, value });
    const newFilters = { ...filters, [filter]: value };
    updateURL(newFilters);
  }, [filters, updateURL]);

  // Reset a single filter
  const resetFilter = useCallback((filter) => {
    dispatch({ type: 'RESET_FILTER', filter });
    const newFilters = { ...filters, [filter]: initialState[filter] };
    updateURL(newFilters);
  }, [filters, updateURL]);

  // Reset all filters
  const resetAllFilters = useCallback(() => {
    dispatch({ type: 'RESET_ALL' });
    router.push(pathname);
  }, [pathname, router]);

  // Get active filter count
  const getActiveFilterCount = useCallback(() => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      if (key === 'sort' || key === 'search') return count;
      if (value === initialState[key]) return count;
      if (Array.isArray(value) && value.length === 0) return count;
      if (typeof value === 'object' && !Array.isArray(value)) {
        const hasValue = Object.values(value).some(v => v !== '');
        return count + (hasValue ? 1 : 0);
      }
      return count + 1;
    }, 0);
  }, [filters]);

  return (
    <FilterContext.Provider value={{
      filters,
      setFilter,
      resetFilter,
      resetAllFilters,
      getActiveFilterCount
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}

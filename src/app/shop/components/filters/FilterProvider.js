'use client';

import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { analyzeSearchIntent } from '../../actions/searchAnalysis';

const FilterContext = createContext(null);

const initialState = {
  // Traditional filters
  category: '',
  priceRange: { min: '', max: '' },
  materials: [],
  sizes: [],
  colors: [],
  rating: 0,
  availability: 'all',
  sort: 'latest',
  search: '',
  
  // AI-powered filters
  aiSuggestions: {
    autoApplied: [], // Filters AI automatically applied
    suggested: [],   // AI-suggested filters
    related: []      // Related categories/searches
  },
  
  // Smart filter groups
  smartGroups: {
    occasion: [],
    skillLevel: [],
    season: [],
    ageGroup: []
  }
};

function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, [action.filter]: action.value };
    
    case 'SET_AI_SUGGESTIONS':
      return { 
        ...state, 
        aiSuggestions: action.suggestions,
        // Auto-apply AI-detected filters if they're not already set by user
        ...(action.autoApply ? action.suggestions.autoApplied.reduce((acc, filter) => ({
          ...acc,
          [filter.type]: state[filter.type] || filter.value
        }), {}) : {})
      };
    
    case 'APPLY_SMART_GROUP':
      return {
        ...state,
        smartGroups: {
          ...state.smartGroups,
          [action.group]: action.values
        }
      };
    
    case 'RESET_FILTER':
      return { ...state, [action.filter]: initialState[action.filter] };
    
    case 'RESET_ALL':
      return {
        ...initialState,
        search: state.search // Preserve search term
      };
    
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
        if (typeof value === 'object' && !Array.isArray(value)) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subValue) {
              params.set(`${key}_${subKey}`, subValue);
            } else {
              params.delete(`${key}_${subKey}`);
            }
          });
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','));
          } else {
            params.delete(key);
          }
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
  const setFilter = useCallback((filter, value, source = 'user') => {
    dispatch({ type: 'SET_FILTER', filter, value });
    const newFilters = { ...filters, [filter]: value };
    updateURL(newFilters);
    
    // Log filter usage for learning if it's from AI suggestion
    if (source === 'ai_suggestion') {
      // TODO: Implement filter usage logging
      console.log('AI filter applied:', { filter, value });
    }
  }, [filters, updateURL]);

  // Apply AI suggestions
  const applyAISuggestions = useCallback(async (searchQuery, autoApply = true) => {
    if (!searchQuery) return;
    
    try {
      const analysis = await analyzeSearchIntent(searchQuery);
      if (!analysis) return;

      // Format suggestions for our filter system
      const suggestions = {
        autoApplied: [],
        suggested: [],
        related: []
      };

      // Process primary category and attributes
      if (analysis.searchIntent.primaryCategory) {
        suggestions.autoApplied.push({
          type: 'category',
          value: analysis.searchIntent.primaryCategory,
          label: 'Category',
          confidence: 1
        });
      }

      // Add attribute-based filters
      Object.entries(analysis.searchIntent.attributes || {}).forEach(([key, value]) => {
        if (value) {
          suggestions.suggested.push({
            type: key,
            value,
            label: `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
            confidence: 0.8
          });
        }
      });

      // Add price range if suggested
      if (analysis.searchIntent.priceRange?.min || analysis.searchIntent.priceRange?.max) {
        suggestions.suggested.push({
          type: 'priceRange',
          value: analysis.searchIntent.priceRange,
          label: `Price: ₹${analysis.searchIntent.priceRange.min || 0} - ₹${analysis.searchIntent.priceRange.max || '∞'}`,
          confidence: 0.7
        });
      }

      // Add related categories
      suggestions.related = analysis.relatedCategories || [];

      // Add any explicit suggested filters
      if (analysis.suggestedFilters) {
        suggestions.suggested.push(...analysis.suggestedFilters);
      }

      dispatch({ 
        type: 'SET_AI_SUGGESTIONS', 
        suggestions,
        autoApply
      });

    } catch (error) {
      console.error('Error applying AI suggestions:', error);
    }
  }, []);

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
      if (key === 'sort' || key === 'search' || key === 'aiSuggestions' || key === 'smartGroups') return count;
      if (value === initialState[key]) return count;
      if (Array.isArray(value) && value.length === 0) return count;
      if (typeof value === 'object' && !Array.isArray(value)) {
        const hasValue = Object.values(value).some(v => v !== '');
        return count + (hasValue ? 1 : 0);
      }
      return count + 1;
    }, 0);
  }, [filters]);

  // Process search params on mount and updates
  useEffect(() => {
    const search = searchParams.get('search');
    if (search && search !== filters.search) {
      dispatch({ type: 'SET_FILTER', filter: 'search', value: search });
      applyAISuggestions(search);
    }
  }, [searchParams, filters.search, applyAISuggestions]);

  return (
    <FilterContext.Provider value={{
      filters,
      setFilter,
      resetFilter,
      resetAllFilters,
      getActiveFilterCount,
      aiSuggestions: filters.aiSuggestions,
      applyAISuggestions,
      smartGroups: filters.smartGroups
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

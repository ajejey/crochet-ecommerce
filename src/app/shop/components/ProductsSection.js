'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import { getFilteredProducts } from '../actions';
import useSWRInfinite from 'swr/infinite';
import ProductGrid from './ProductGrid';

// Create a fetcher that uses our server action
const fetcher = async (key) => {
  const params = new URLSearchParams(key.split('?')[1]);
  const filters = Object.fromEntries(params.entries());
  return getFilteredProducts(filters);
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

export default function ProductsSection({ products, pagination, initialFilters }) {
  const { ref, inView } = useInView();

  // Use SWR infinite for pagination
  const { data, size, setSize, isValidating } = useSWRInfinite(
    (...args) => getKey(...args, initialFilters),
    fetcher,
    {
      fallbackData: [{ products, pagination }],
      revalidateOnFocus: true, // Revalidate when the user comes back
      revalidateOnReconnect: true, // Revalidate when the user reconnects
      dedupingInterval: 5000,
      persistSize: true,
    }
  );

  const isLoading = isValidating;
  const allProducts = data ? data.flatMap(page => page.products) : products;
  const hasMore = data?.[data.length - 1]?.pagination.hasMore ?? pagination.hasMore;

  // Load more when scrolling to the bottom
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setSize(size + 1);
    }
  }, [inView, hasMore, isLoading, setSize, size]);

  return (
    <div className="space-y-6">
      <ProductGrid products={allProducts} />

      {/* Load More */}
      {hasMore && (
        <div ref={ref} className="flex justify-center py-8">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          ) : (
            <div className="h-6" /> // Spacer for intersection observer
          )}
        </div>
      )}
    </div>
  );
}

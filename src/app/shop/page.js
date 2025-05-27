import { getInitialProducts, getFilteredProducts } from './actions';
import ProductsSection from './components/ProductsSection';
import DesktopFilters from './components/filters/DesktopFilters';
import MobileFilters from './components/filters/MobileFilters';
import ActiveFilters from './components/common/ActiveFilters';
import { FilterProvider } from './components/filters/FilterProvider';
import { Suspense } from 'react';

export default async function ShopPage({
  searchParams
}) {
  // Check if any search parameters are present
  const hasFilters = Object.keys(searchParams).length > 0;

  // Use simpler query for initial load
  const { products, pagination } = hasFilters 
    ? await getFilteredProducts(searchParams)
    : await getInitialProducts();

  return (
    <FilterProvider>
      <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Filters */}
          <div className="lg:hidden">
            <MobileFilters />
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <DesktopFilters />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <ActiveFilters />
              <Suspense fallback={
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              }>
              <ProductsSection 
                products={products} 
                pagination={pagination}
                initialFilters={searchParams}
              />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </FilterProvider>
  );
}

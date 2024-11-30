import HeroSection from './components/HeroSection';
import { getInitialProducts, getFilteredProducts } from './actions';
import ProductsSection from './components/ProductsSection';

export default async function ShopPage({
  searchParams
}) {
  const hasFilters = searchParams.category || 
                    searchParams.sort || 
                    searchParams.minPrice || 
                    searchParams.maxPrice || 
                    searchParams.search ||
                    searchParams.page;

  // Use simpler query for initial load
  const { products, pagination } = hasFilters 
    ? await getFilteredProducts(searchParams)
    : await getInitialProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductsSection 
          products={products} 
          pagination={pagination}
          initialFilters={searchParams}
        />
      </div>
    </div>
  );
}

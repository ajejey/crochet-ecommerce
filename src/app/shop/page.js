import ProductsSection from './components/ProductsSection';
import HeroSection from './components/HeroSection';
import { getActiveProducts } from './actions';

// Revalidate every hour instead of every request
export const revalidate = 3600;

export default async function ShopPage({
  searchParams
}) {
  // Get filter parameters from URL
  const page = Number(searchParams.page) || 1;
  const category = searchParams.category || 'all';
  const sort = searchParams.sort || 'latest';
  const search = searchParams.search || null;
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : null;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : null;

  // Fetch products with filters
  const result = await getActiveProducts({
    page,
    category,
    sort,
    search,
    minPrice,
    maxPrice
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* <HeroSection /> */}
      <ProductsSection 
        initialData={result}
        currentFilters={{
          page,
          category,
          sort,
          search,
          minPrice,
          maxPrice
        }}
      />
    </div>
  );
}

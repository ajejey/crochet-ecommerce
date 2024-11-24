import ProductsSection from './components/ProductsSection';
import HeroSection from './components/HeroSection';
import { getActiveProducts } from './actions';

// Disable caching for this route
export const revalidate = 0;

export default async function ShopPage() {
  // Only fetch on server for initial render
  const products = await getActiveProducts();
  const categories = ['all', ...new Set(products?.map(p => p.category) || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HeroSection />
      <ProductsSection 
        initialProducts={products} 
        categories={categories}
      />
    </div>
  );
}

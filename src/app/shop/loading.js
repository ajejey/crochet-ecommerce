import HeroSection from './components/HeroSection';
import ProductGridSkeleton from './components/ProductGridSkeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HeroSection />
      <div className="h-20 mb-8" /> {/* Space for filters */}
      <ProductGridSkeleton />
    </div>
  );
}

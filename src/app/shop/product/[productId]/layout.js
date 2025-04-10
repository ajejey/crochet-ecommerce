import { getProduct } from '../../actions';
import { notFound } from 'next/navigation';
import { SuspendedPostHogPageView } from '@/components/PostHogProvider';

export default async function ProductLayout({ children, params }) {
  const product = await getProduct(params.productId);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <SuspendedPostHogPageView />
      {/* Breadcrumb */}
      {/* <nav className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/shop" className="hover:text-purple-600">Shop</Link>
          </li>
          <li>•</li>
          <li>
            <Link href={`/shop?category=${product.category}`} className="hover:text-purple-600">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Link>
          </li>
          <li>•</li>
          <li className="text-gray-900 font-medium">{product.name}</li>
        </ol>
      </nav> */}

      {children}
    </div>
  );
}

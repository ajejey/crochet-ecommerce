import { requireSeller } from '@/lib/auth-context';
import { Product } from '@/models/Product';
import dbConnect from '@/lib/mongodb';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProductList from './components/ProductList';

export default async function ProductsPage() {
  // This will redirect if not a seller
  const user = await requireSeller();
  await dbConnect();
  
  // Get products
  const products = await Product.find({ sellerId: user.$id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pt-20 md:pt-0">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/seller/products/add"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
          <div className="mt-6">
            <Link
              href="/seller/products/add"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Link>
          </div>
        </div>
      ) : (
        <ProductList initialProducts={products} />
      )}
    </div>
  );
}
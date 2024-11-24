import { getProduct } from '../../actions';
import EditProductForm from './EditProductForm';
import { redirect } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export default async function EditProductPage({ params }) {
  const result = await getProduct(params.id);

  if (result.error === 'Not authenticated') {
    redirect('/login');
  }

  if (result.error) {
    return (
      <div className="text-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-2xl mx-auto">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{result.error}</p>
              <p className="mt-2">
                <a href="/seller/products" className="text-red-700 font-medium hover:text-red-600 underline">
                  Back to Products
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <p className="text-gray-600">Update your product details.</p>
      </div>
      <EditProductForm product={result.product} />
    </div>
  );
}
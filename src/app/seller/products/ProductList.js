'use client';

import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { deleteProduct, updateProductStatus } from './actions';
import { useState } from 'react';
import { PRODUCT_CATEGORIES } from '@/constants/product';

export default function ProductList({ initialProducts }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const { data: products, mutate } = useSWR(
    'seller-products',
    null,
    {
      fallbackData: initialProducts,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  async function handleDelete(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteProduct(productId);
      if (result.success) {
        mutate(products.filter(p => p._id !== productId));
        router.refresh();
      } else {
        alert(result.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleStatusToggle(product) {
    setUpdatingStatus(product._id);
    try {
      const newStatus = product.status === 'active' ? 'outOfStock' : 'active';
      const result = await updateProductStatus(product._id, newStatus);
      
      if (result.success) {
        const updatedProducts = products.map(p => 
          p._id === product._id ? { ...p, status: newStatus } : p
        );
        await mutate(updatedProducts, false);
      } else {
        alert(result.error || 'Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Failed to update product status');
    } finally {
      setUpdatingStatus(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Your Products</h1>
        <Link
          href="/seller/products/add"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Product
        </Link>
      </div>

      {products ? (
        products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No products</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new product.
            </p>
            <div className="mt-6">
              <Link
                href="/seller/products/add"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Product
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Product</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={product.images?.[0]?.url || '/placeholder.png'}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-gray-500">
                            {PRODUCT_CATEGORIES.find(cat => cat.id === product.category)?.label || product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {product.formattedPrice || `₹${product.price}`}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {product.inventory?.quantity || 0}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <button
                        onClick={() => handleStatusToggle(product)}
                        disabled={updatingStatus === product._id}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        } transition-colors`}
                      >
                        {updatingStatus === product._id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                        ) : product.status === 'active' ? (
                          <ToggleRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 mr-1" />
                        )}
                        {product.status}
                      </button>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                      <Link
                        href={`/seller/products/edit/${product._id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit2 className="h-5 w-5 inline" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={isDeleting}
                        className={`text-red-600 hover:text-red-900 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Trash2 className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 mx-auto text-gray-900 animate-spin" />
        </div>
      )}
    </div>
  );
}
'use client';

import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2, Layers } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { deleteProduct, updateProductStatus } from '../actions';
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
    <div className="space-y-4">
      {products ? (
        products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <img src="/images/create-icon.svg" alt="Create" className="w-full h-full text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-8">
              Get started by creating your first product listing.
            </p>
            <Link
              href="/seller/products/add"
              className="inline-flex items-center px-6 py-3 bg-rose-600 text-white rounded-full text-lg font-medium hover:bg-rose-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Product
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Desktop view */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Product</th>
                    <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                    <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="relative py-4 pl-3 pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 pl-6 pr-3">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                            <img
                              className="h-full w-full object-cover"
                              src={product.images?.[0]?.url || '/placeholder.png'}
                              alt={product.name}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">
                              {PRODUCT_CATEGORIES.find(cat => cat.id === product.category)?.label || product.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900 font-medium">
                        ₹{product.price}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {product.inventory?.stockCount || 0} units
                      </td>
                      <td className="px-3 py-4 text-sm">
                        <button
                          onClick={() => handleStatusToggle(product)}
                          disabled={updatingStatus === product._id}
                          className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${
                            product.status === 'active'
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          } transition-colors`}
                        >
                          {updatingStatus === product._id ? (
                            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                          ) : product.status === 'active' ? (
                            <ToggleRight className="w-6 h-6 mr-2" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 mr-2" />
                          )}
                          {product.status === 'active' ? 'Active' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="py-4 pl-3 pr-6 text-right space-x-2">
                        <Link
                          href={`/seller/products/edit/${product._id}`}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        <Link
                          href={`/seller/products/edit/${product._id}#variants`}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Manage product variants"
                        >
                          <Layers className="h-4 w-4 mr-1" />
                          Variants
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={isDeleting}
                          className={`inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${
                            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="md:hidden divide-y divide-gray-200">
              {products.map((product) => (
                <div key={product._id} className="p-4 space-y-2">
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        className="h-full w-full object-cover"
                        src={product.images?.[0]?.url || '/placeholder.png'}
                        alt={product.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {PRODUCT_CATEGORIES.find(cat => cat.id === product.category)?.label || product.category}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-base font-medium text-gray-900">₹{product.price}</span>
                        <span className="text-sm text-gray-500">• {product.inventory?.stockCount || 0} units</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => handleStatusToggle(product)}
                      disabled={updatingStatus === product._id}
                      className={`flex-1 inline-flex items-center justify-center rounded-full py-2 text-sm font-medium ${
                        product.status === 'active'
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      } transition-colors`}
                    >
                      {updatingStatus === product._id ? (
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      ) : product.status === 'active' ? (
                        <ToggleRight className="w-6 h-6 mr-2" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 mr-2" />
                      )}
                      {product.status === 'active' ? 'Active' : 'Out of Stock'}
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-1">
                    <Link
                      href={`/seller/products/edit/${product._id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                    <Link
                      href={`/seller/products/edit/${product._id}#variants`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      Variants
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={isDeleting}
                      className={`flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${
                        isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
          <Loader2 className="w-8 h-8 mx-auto text-rose-600 animate-spin" />
        </div>
      )}
    </div>
  );
}
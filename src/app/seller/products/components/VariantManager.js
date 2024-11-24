'use client';

import { useState } from 'react';
import { Plus, X, Edit2, Trash2, Save, XCircle } from 'lucide-react';
import { createVariant, updateVariant, deleteVariant, getProductVariants } from '../actions';
import useSWR from 'swr';

export default function VariantManager({ productId, disabled = false }) {
  const [error, setError] = useState('');
  const [editingVariant, setEditingVariant] = useState(null);
  const [newVariant, setNewVariant] = useState(false);

  // Form state for new/editing variant
  const [formData, setFormData] = useState({
    name: '',
    options: [],
    price_adjustment: 0,
    stock: 0
  });

  const { data: variants, mutate, isLoading } = useSWR(
    productId ? `variants-${productId}` : null,
    () => getProductVariants(productId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  function handleOptionChange(e) {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      options: value ? value.split(',').map(opt => opt.trim()) : []
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      if (editingVariant) {
        const result = await updateVariant(editingVariant.$id, formData);
        if (result.success) {
          mutate(prev => ({
            ...prev,
            variants: prev.variants.map(v => 
              v.$id === editingVariant.$id ? result.variant : v
            )
          }));
          setEditingVariant(null);
        } else {
          setError(result.error);
        }
      } else {
        const result = await createVariant(productId, formData);
        if (result.success) {
          mutate(prev => ({
            ...prev,
            variants: [...prev.variants, result.variant]
          }));
          setNewVariant(false);
        } else {
          setError(result.error);
        }
      }
      // Reset form
      setFormData({
        name: '',
        options: [],
        price_adjustment: 0,
        stock: 0
      });
    } catch (err) {
      setError('Failed to save variant');
    }
  }

  async function handleDelete(variantId) {
    if (!confirm('Are you sure you want to delete this variant?')) {
      return;
    }

    try {
      const result = await deleteVariant(variantId);
      if (result.success) {
        mutate(prev => ({
          ...prev,
          variants: prev.variants.filter(v => v.$id !== variantId)
        }));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to delete variant');
    }
  }

  function startEdit(variant) {
    setEditingVariant(variant);
    setFormData({
      name: variant.name,
      options: variant.options,
      price_adjustment: variant.price_adjustment,
      stock: variant.stock
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Product Variants</h3>
        {!newVariant && !editingVariant && (
          <button
            type="button"
            onClick={() => setNewVariant(true)}
            disabled={disabled}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Variant
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {(newVariant || editingVariant) && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Variant Name (e.g., &quot;Size&quot;, &quot;Color&quot;)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Options (comma-separated, e.g., &quot;Small, Medium, Large&quot;)
            </label>
            <input
              type="text"
              value={formData.options.join(', ')}
              onChange={handleOptionChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price Adjustment (₹)
              </label>
              <input
                type="number"
                value={formData.price_adjustment}
                onChange={e => setFormData(prev => ({ ...prev, price_adjustment: e.target.value }))}
                step="0.01"
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={e => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                min="0"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setNewVariant(false);
                setEditingVariant(null);
                setFormData({
                  name: '',
                  options: [],
                  price_adjustment: 0,
                  stock: 0
                });
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingVariant ? 'Update' : 'Add'} Variant
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading variants...</div>
      ) : variants && variants.length > 0 ? (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Options</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price Adj.</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="relative py-3.5 pl-3 pr-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {variants.map(variant => (
                <tr key={variant.$id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {variant.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {variant.options.join(', ')}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    ₹{variant.price_adjustment}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {variant.stock}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <button
                      onClick={() => startEdit(variant)}
                      disabled={disabled}
                      className="text-blue-600 hover:text-blue-900 mr-4 disabled:opacity-50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(variant.$id)}
                      disabled={disabled}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !newVariant && (
        <p className="text-gray-500 text-center py-4">No variants added yet.</p>
      )}
    </div>
  );
}
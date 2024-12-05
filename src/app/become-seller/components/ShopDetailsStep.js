'use client';

import { Store } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/constants/product';

export default function ShopDetailsStep({ onBack, initialData = {} }) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
          Shop Name
        </label>
        <div className="mt-2 relative">
          <input
            type="text"
            id="businessName"
            name="businessName"
            defaultValue={initialData.businessName || ''}
            required
            className="block w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200"
            placeholder="Your creative shop name"
          />
          <Store className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Tell Us About Your Shop
        </label>
        <div className="mt-2">
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={initialData.description || ''}
            required
            className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200"
            placeholder="Share your story and what makes your creations special..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Primary Category
        </label>
        <div className="mt-2">
          <select
            id="category"
            name="category"
            defaultValue={initialData.category || ''}
            required
            className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200"
          >
            <option value="">Select your main product category</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label} - {category.description}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Choose the category that best represents your primary products
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}

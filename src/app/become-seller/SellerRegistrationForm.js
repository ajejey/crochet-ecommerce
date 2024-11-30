'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { registerSeller } from './actions';
import { useRouter } from 'next/navigation';

export default function SellerRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData(e.target);
      const result = await registerSeller(formData);
      if (result.error) {
        setError(result.error);
      } else {
        // Redirect to seller dashboard
        router.push('/seller');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Shop Information</h2>
        
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
            Business/Shop Name
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="business_name"
              name="business_name"
              required
              className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500"
              placeholder="Your shop name"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Shop Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500"
              placeholder="Tell us about your shop and what you sell..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Registering...' : 'Register as Seller'}
        </button>
      </div>
    </form>
  );
}
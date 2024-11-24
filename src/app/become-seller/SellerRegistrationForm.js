'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { registerSeller } from './actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SellerRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setError('');

    try {
      const result = await registerSeller(formData);
      if (result.error) {
        setError(result.error);
      } else {
        // Redirect to seller dashboard
        router.push('/admin');  // or wherever your seller dashboard is
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
      {/* Basic Information */}
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
            <Building2 className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            This will be your public shop name on the marketplace.
          </p>
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

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                {error === 'You must be logged in to register as a seller' && (
                  <p className="mt-2">
                    Please{' '}
                    <Link href="/login" className="text-red-800 hover:text-red-900 underline">
                      log in
                    </Link>
                    {' '}or{' '}
                    <Link href="/signup" className="text-red-800 hover:text-red-900 underline">
                      create an account
                    </Link>
                    {' '}to continue.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Creating Shop...' : 'Create Your Shop'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        By creating a shop, you agree to our Terms of Service and Seller Guidelines.
      </p>
      <p className="text-sm text-gray-500 text-center">
        Already registered? <Link href={`/login?redirect=${encodeURIComponent('/seller')}`} className="text-blue-600 hover:underline">Login here</Link>.
      </p>
    </form>
  );
}
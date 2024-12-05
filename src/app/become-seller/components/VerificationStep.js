'use client';

import { MapPin, Phone } from 'lucide-react';

export default function VerificationStep({ onBack, isSubmitting, initialData = {} }) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <div className="mt-2 relative">
          <input
            type="tel"
            id="phone"
            name="phone"
            defaultValue={initialData.phone || ''}
            required
            className="block w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200"
            placeholder="+91 1234567890"
          />
          <Phone className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <div className="mt-2 relative">
          <input
            type="text"
            id="street"
            name="street"
            defaultValue={initialData.street || ''}
            required
            className="block w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200"
            placeholder="123 Main St"
          />
          <MapPin className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            defaultValue={initialData.city || ''}
            required
            className="mt-2 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200"
            placeholder="City"
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            defaultValue={initialData.state || ''}
            required
            className="mt-2 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200"
            placeholder="State"
          />
        </div>
      </div>

      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
          Postal Code
        </label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          defaultValue={initialData.postalCode || ''}
          required
          className="mt-2 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200"
          placeholder="123456"
        />
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-900">Document Requirements</h3>
        <p className="mt-1 text-sm text-gray-500">
          To enable payments through Razorpay, you'll need to submit the following documents later:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-500">
          <li>PAN Card</li>
          <li>Aadhar Card</li>
          <li>Bank Account Details</li>
          <li>GST Registration (if applicable)</li>
        </ul>
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
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating Profile...' : 'Create Seller Profile'}
        </button>
      </div>
    </div>
  );
}

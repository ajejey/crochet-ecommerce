'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { syncAllProductsToMerchant, getMerchantProductsStatus } from '@/lib/google-merchant/actions';

export default function GoogleMerchantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [productStatus, setProductStatus] = useState(null);
  const [syncResults, setSyncResults] = useState(null);

  const handleSyncAll = async () => {
    try {
      setLoading(true);
      const result = await syncAllProductsToMerchant();
      
      if (result.success) {
        toast.success(`Successfully synced ${result.results.success} products to Google Merchant Center`);
        setSyncResults(result.results);
      } else {
        toast.error(result.error || 'Failed to sync products');
      }
    } catch (error) {
      console.error('Error syncing products:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const handleGetStatus = async () => {
    try {
      setStatusLoading(true);
      const result = await getMerchantProductsStatus();
      
      if (result.success) {
        setProductStatus(result.products);
      } else {
        toast.error(result.error || 'Failed to get product status');
      }
    } catch (error) {
      console.error('Error getting product status:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Google Merchant Center Integration</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Synchronization</h2>
        <p className="text-gray-600 mb-6">
          Sync your Knitkart products to Google Merchant Center to make them available on Google Shopping, Search, and other Google services.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleSyncAll}
            disabled={loading}
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors disabled:bg-rose-300"
          >
            {loading ? 'Syncing...' : 'Sync All Products'}
          </button>
          
          <button
            onClick={handleGetStatus}
            disabled={statusLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-300"
          >
            {statusLoading ? 'Loading...' : 'Get Product Status'}
          </button>
        </div>
      </div>
      
      {syncResults && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sync Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">{syncResults.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-green-600">Successfully Synced</p>
              <p className="text-2xl font-bold text-green-600">{syncResults.success}</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-md">
              <p className="text-rose-600">Failed to Sync</p>
              <p className="text-2xl font-bold text-rose-600">{syncResults.failed}</p>
            </div>
          </div>
          
          {syncResults.errors && syncResults.errors.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Errors</h3>
              <div className="max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-md">
                {syncResults.errors.map((error, index) => (
                  <div key={index} className="mb-2 pb-2 border-b border-gray-200 last:border-0">
                    <p className="font-medium">Product ID: {error.productId}</p>
                    <p className="text-rose-600">{error.error}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {productStatus && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Status in Google Merchant Center</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productStatus.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.productId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.destinationStatuses?.[0]?.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.destinationStatuses?.[0]?.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.itemLevelIssues ? product.itemLevelIssues.length : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Setup Instructions</h2>
        <div className="prose max-w-none">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Create a Google Merchant Center account at <a href="https://merchants.google.com" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">merchants.google.com</a></li>
            <li>Set up your store information and verify your website ownership</li>
            <li>Create a service account in Google Cloud Console and download the JSON key file</li>
            <li>Add the following environment variables to your project:
              <ul className="list-disc pl-5 mt-2">
                <li><code>GOOGLE_MERCHANT_ID</code> - Your Google Merchant Center ID</li>
                <li><code>GOOGLE_APPLICATION_CREDENTIALS</code> - Path to your service account JSON key file</li>
                <li><code>GOOGLE_MERCHANT_API_KEY</code> - A secure API key for the sync endpoint</li>
              </ul>
            </li>
            <li>Set up a cron job to call the sync API endpoint regularly (e.g., daily)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useGoogleMerchant } from '@/lib/google-merchant/hooks';
import { PRODUCT_STATUSES } from '@/constants/product';

/**
 * Component for syncing products to Google Merchant Center
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 * @param {Function} props.onSync - Optional callback after successful sync
 */
export default function GoogleMerchantSync({ product, onSync }) {
  const [expanded, setExpanded] = useState(false);
  const { syncProduct, deleteProduct, syncInventory, syncLoading, deleteLoading, inventoryLoading } = useGoogleMerchant();

  // Only published products can be synced to Google Merchant
  const canSync = product.status === PRODUCT_STATUSES.PUBLISHED;

  const handleSync = async () => {
    const result = await syncProduct(product._id);
    if (result.success && onSync) {
      onSync(result);
    }
  };

  const handleDelete = async () => {
    const result = await deleteProduct(product._id);
    if (result.success && onSync) {
      onSync(result);
    }
  };

  const handleInventorySync = async () => {
    const result = await syncInventory(product._id);
    if (result.success && onSync) {
      onSync(result);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-semibold text-gray-900">Google Merchant Center</h3>
        <button className="text-gray-500">
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-4">
          <p className="text-gray-600 text-sm mb-4">
            Sync this product to Google Merchant Center to make it available on Google Shopping, Search, and other Google services.
          </p>
          
          {!canSync && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Only published products can be synced to Google Merchant Center. Publish this product to enable syncing.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSync}
              disabled={syncLoading || !canSync}
              className="px-3 py-2 bg-rose-600 text-white text-sm rounded-md hover:bg-rose-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {syncLoading ? 'Syncing...' : 'Sync to Google Merchant'}
            </button>
            
            <button
              onClick={handleInventorySync}
              disabled={inventoryLoading || !canSync}
              className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {inventoryLoading ? 'Updating...' : 'Update Inventory Only'}
            </button>
            
            <button
              onClick={handleDelete}
              disabled={deleteLoading || !canSync}
              className="px-3 py-2 bg-white border border-rose-600 text-rose-600 text-sm rounded-md hover:bg-rose-50 transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              {deleteLoading ? 'Removing...' : 'Remove from Google Merchant'}
            </button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>Note: Changes may take up to 24 hours to appear in Google Shopping results.</p>
          </div>
        </div>
      )}
    </div>
  );
}

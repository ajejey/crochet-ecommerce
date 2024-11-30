'use client';

import { useState } from 'react';
import { updateOrderStatus } from '../actions';
import { Loader2 } from 'lucide-react';
import { useSWRConfig } from 'swr';

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

export default function UpdateStatus({ orderId, currentStatus, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const { mutate } = useSWRConfig();

  const handleStatusChange = async () => {
    if (selectedStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    setIsUpdating(true);
    setError('');

    try {
      const result = await updateOrderStatus(orderId, selectedStatus);
      if (result.success) {
        setIsOpen(false);
        // Mutate the order data in all relevant components
        mutate(['order-basic', orderId]);
        mutate(['order-items', orderId]);
        mutate(['buyer-details', orderId]);
        // Also mutate the orders list if it exists
        mutate(key => typeof key === 'string' && key.startsWith('orders'));
        
        if (onUpdate) {
          onUpdate(result.order);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to update order status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        disabled={isUpdating}
      >
        {isUpdating ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          'Update Status'
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isUpdating}
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isUpdating || selectedStatus === currentStatus}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

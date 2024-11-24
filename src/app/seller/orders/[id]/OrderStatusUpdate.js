'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { updateOrderStatus, getOrderStatus } from '../actions';
import { toast } from 'sonner';
import useSWR, { mutate } from 'swr';

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

const StatusBadge = ({ status }) => {
  if (!status) return null;
  
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function OrderStatusUpdate({ orderId }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Fetch current status
  const { data: result, error } = useSWR(
    ['order-status', orderId],
    () => getOrderStatus(orderId)
  );

  if (error || (result && !result.success)) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-red-500">Failed to load order status</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow p-4 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const currentStatus = result.status;

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;
    
    setSelectedStatus(newStatus);
    setShowConfirm(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedStatus) return;

    setIsUpdating(true);
    try {
      const result = await updateOrderStatus(orderId, selectedStatus);
      if (result.success) {
        toast.success('Order status updated successfully');
        // Revalidate all order-related queries
        mutate((key) => Array.isArray(key) && key[1] === orderId);
      } else {
        toast.error(result.message || 'Failed to update order status');
      }
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
      setShowConfirm(false);
      setSelectedStatus(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Update Status</h2>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">Current Status</p>
            <StatusBadge status={currentStatus} />
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Change Status To</p>
            <div className="grid grid-cols-1 gap-2">
              {ORDER_STATUSES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={isUpdating || status.value === currentStatus}
                  className={`w-full px-4 py-2 text-left rounded-lg border transition-colors
                    ${status.value === currentStatus
                      ? 'bg-gray-100 cursor-not-allowed'
                      : 'hover:bg-gray-50 active:bg-gray-100'
                    }
                    ${selectedStatus === status.value ? 'border-blue-500' : 'border-gray-200'}
                  `}
                >
                  <StatusBadge status={status.value} />
                </button>
              ))}
            </div>
          </div>

          {showConfirm && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to change the order status to{' '}
                <StatusBadge status={selectedStatus} />?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={confirmStatusUpdate}
                  disabled={isUpdating}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    'Confirm'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedStatus(null);
                  }}
                  disabled={isUpdating}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

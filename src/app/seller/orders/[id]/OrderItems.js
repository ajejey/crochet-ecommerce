'use client';

import { formatPrice } from '@/utils/format';
import { getOrderItems } from '../actions';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';

export default function OrderItems({ orderId }) {
  const { data: result, error } = useSWR(
    ['order-items', orderId],
    () => getOrderItems(orderId)
  );

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <p className="text-red-500">Failed to load order items</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  const { items } = result;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.$id} className="py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-4 md:col-span-2">
                {item.product_image && (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  {item.variant_name && (
                    <p className="text-sm text-gray-500">Variant: {item.variant_name}</p>
                  )}
                </div>
              </div>
              <div className="text-gray-600">
                Quantity: {item.quantity}
              </div>
              <div className="font-medium">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { Package, IndianRupee, Clock, Truck } from 'lucide-react';
import { formatPrice, formatDate } from '@/utils/format';
import { getOrderBasicDetails } from '../actions';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';



export default function OrderSummary({ orderId }) {
  const { data: result, error } = useSWR(
    ['order-basic', orderId],
    () => getOrderBasicDetails(orderId),
    { refreshInterval: 0 } // Disable auto-refresh, we'll handle updates manually
  );

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-red-500">Failed to load order summary</p>
      </div>
    );
  }

  if (!result?.order) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ))}
      </div>
    );
  }

  const { order } = result;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Order Status</p>
            <p className="font-semibold">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-3">
          <IndianRupee className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8 text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="font-semibold">{formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-3">
          <Truck className="w-8 h-8 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">Payment Status</p>
            <p className="font-semibold">{order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

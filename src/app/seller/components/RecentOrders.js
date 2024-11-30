'use client';

import { formatPrice } from '@/utils/format';
import { Package } from 'lucide-react';
import Link from 'next/link';

// Helper function to format date
function formatDate(date) {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(date).toLocaleDateString('en-US', options);
}

function OrderStatusBadge({ status }) {
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
}

export default function RecentOrders({ orders, loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="h-12 w-12 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="text-center py-6">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No orders yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link 
            key={order._id}
            href={`/seller/orders/${order._id}`}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">Order #{order._id.toString().slice(-6)}</p>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                <p className="font-medium">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link 
        href="/seller/orders" 
        className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-4"
      >
        View All Orders →
      </Link>
    </div>
  );
}

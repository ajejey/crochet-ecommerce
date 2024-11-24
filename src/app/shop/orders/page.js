'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { getOrders } from './actions';

// SWR fetcher function that wraps our getOrders action
const fetcher = () => getOrders();

export default function OrdersPage() {
  const { data: result, error, isLoading } = useSWR('orders', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || (result && !result.success)) {
    return (
      <div className="min-h-screen p-4">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Error Loading Orders</h1>
          <p className="text-gray-600 mb-4">
            {result?.message || 'Failed to load your orders. Please try again later.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const orders = result.orders || [];

  if (orders.length === 0) {
    return (
      <div className="min-h-screen p-4">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">No Orders Found</h1>
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <Link 
            href="/shop"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Link 
            key={order.$id} 
            href={`/shop/orders/${order.$id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">Order #{order.$id}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.$createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{order.total_amount}</p>
                <span className={`
                  inline-block px-2 py-1 text-xs rounded-full
                  ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'}
                `}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <p>Payment Status: {order.payment_status}</p>
              <span className="text-blue-600">View Details →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

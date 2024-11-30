'use client';

import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import { getOrders } from './actions';
// import { formatDistance } from 'date-fns';
import { Loader2 } from 'lucide-react';

// SWR fetcher function that wraps our getOrders action
const fetcher = () => getOrders();

// Add the price formatter at the top of the file
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(price);
};

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

  const { orders } = result;

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen p-4">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">No Orders Found</h1>
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <Link 
            href="/shop"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link 
            key={order._id} 
            href={`/shop/orders/${order._id}`}
            className="block"
          >
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order placed {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Order #{order._id.slice(-8)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    Total: {formatPrice(order.total)}
                  </p>
                  <p className={`text-sm ${
                    order.status === 'completed' ? 'text-green-600' :
                    order.status === 'cancelled' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex space-x-3">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.product.mainImage}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="font-medium line-clamp-2">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

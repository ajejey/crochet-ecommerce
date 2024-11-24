'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { getOrderById } from '../actions';

// SWR fetcher function that wraps our getOrderById action
const fetcher = (_, orderId) => getOrderById(orderId);

export default function OrderDetailsPage({ params }) {
  const { data: result, error, isLoading } = useSWR(
    ['order', params.id],
    ([_, orderId]) => fetcher(_, orderId),
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !result?.success) {
    return (
      <div className="min-h-screen p-4">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Error Loading Order</h1>
          <p className="text-gray-600 mb-4">{result?.message || 'Failed to load order details. Please try again later.'}</p>
          <Link 
            href="/shop/orders" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const { order, orderItems } = result;

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/shop/orders"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Orders
        </Link>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>

      {order && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Order Information</h3>
              <p className="text-gray-600">Order ID: {order.$id}</p>
              <p className="text-gray-600">Status: {order.status}</p>
              <p className="text-gray-600">Payment Status: {order.payment_status}</p>
              <p className="text-gray-600">Total Amount: ₹{order.total_amount}</p>
              <p className="text-gray-600">Date: {new Date(order.$createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Shipping Details</h3>
              <p className="text-gray-600">Name: {order.buyer_name}</p>
              <p className="text-gray-600">Phone: {order.buyer_phone}</p>
              <p className="text-gray-600">Email: {order.buyer_email}</p>
              <div className="mt-2">
                <p className="text-gray-600">{order.shipping_address}</p>
                <p className="text-gray-600">{order.shipping_city}, {order.shipping_state}</p>
                <p className="text-gray-600">PIN: {order.shipping_pincode}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="font-medium">#{order.$id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="font-medium">
              {new Date(order.$createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Status</p>
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
          <div>
            <p className="text-sm text-gray-600">Payment Status</p>
            <p className="font-medium">{order.payment_status}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {orderItems.map((item) => (
              <div 
                key={item.$id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{item.product_id}</p>
                    {item.variant_id && (
                      <p className="text-sm text-gray-600">Variant: {item.variant_id}</p>
                    )}
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-medium">₹{order.total_amount}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Platform Fee</p>
              <p className="font-medium">₹{order.platform_fee}</p>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <p>Total</p>
              <p>₹{order.total_amount}</p>
            </div>
          </div>
        </div>
      </div>

      {order.status === 'delivered' && (
        <div className="text-center">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
              // TODO: Implement review functionality
              console.log('Write review clicked');
            }}
          >
            Write a Review
          </button>
        </div>
      )}
    </div>
  );
}

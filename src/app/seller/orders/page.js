'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Search, Filter, Loader2 } from 'lucide-react';
import { getSellerOrders } from './actions';
import { formatPrice } from '@/utils/format';
import Link from 'next/link';

const ORDER_STATUSES = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

const StatusBadge = ({ status }) => {
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

export default function SellerOrdersPage() {
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1
  });

  // SWR configuration
  const { data: result, error, isLoading } = useSWR(
    ['orders', filters.status, filters.search, filters.page],
    () => getSellerOrders(filters)
  );

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value, page: 1 }));
    }, 500);
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearchChange}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="relative">
          <select
            className="w-full sm:w-48 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            value={filters.status}
            onChange={handleStatusChange}
          >
            {ORDER_STATUSES.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50">
            <div className="grid grid-cols-6 gap-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">Order Details</div>
              <div>Status</div>
              <div>Items</div>
              <div>Total</div>
              <div>Actions</div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 bg-white">
            {isLoading && !result ? (
              <div className="px-6 py-4 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </div>
            ) : result?.orders?.length ? (
              result.orders.map(order => (
                <div key={order.$id} className="grid grid-cols-6 gap-4 px-6 py-4 text-sm">
                  <div className="col-span-2">
                    <p className="font-medium text-gray-900">#{order.$id}</p>
                    <p className="text-gray-500">{order.buyer_name}</p>
                    <p className="text-gray-500 text-xs">{new Date(order.$createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="text-gray-500">{order.items?.length || 0} items</div>
                  <div className="font-medium">{formatPrice(order.total_amount)}</div>
                  <div>
                    <Link
                      href={`/seller/orders/${order.$id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-gray-500">
                No orders found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {result?.total > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {((filters.page - 1) * 10) + 1} to {Math.min(filters.page * 10, result.total)} of{' '}
            {result.total} orders
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={!result?.totalPages || filters.page >= result.totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSellers } from '../actions';

export default function SellersTable({ initialData }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(initialData);

  const currentPage = Number(searchParams.get('page')) || 1;

  const handleSearch = async (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    if (search) newParams.set('search', search);
    else newParams.delete('search');
    if (status !== 'all') newParams.set('status', status);
    else newParams.delete('status');
    
    router.push(`?${newParams.toString()}`);
    
    startTransition(async () => {
      const result = await getSellers({
        status: status !== 'all' ? status : undefined,
        search: search || undefined,
        page: 1
      });
      setData(result);
    });
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    router.push(`?${newParams.toString()}`);

    startTransition(async () => {
      const result = await getSellers({
        status: status !== 'all' ? status : undefined,
        search: search || undefined,
        page
      });
      setData(result);
    });
  };

  if (!data) return <div>Failed to load sellers</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">All Sellers</h2>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sellers..." 
            className="px-4 py-2 border rounded-lg w-full md:w-auto"
          />
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full md:w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <button 
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isPending ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : data?.sellers?.length ? (
              data.sellers.map((seller) => (
                <tr key={seller._id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{seller.businessName}</div>
                      <div className="text-sm text-gray-500">{seller.user?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{seller.contactEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                      ${seller.status === 'active' ? 'bg-green-100 text-green-800' : 
                        seller.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {seller.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{seller.metadata?.productsCount || 0}</td>
                  <td className="px-6 py-4">{seller.metadata?.ordersCount || 0}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">View</button>
                    {seller.status === 'pending' && (
                      <button className="text-green-600 hover:text-green-900">Approve</button>
                    )}
                    {seller.status === 'active' && (
                      <button className="text-red-600 hover:text-red-900">Suspend</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">No sellers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data?.pages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: data.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={isPending}
              className={`px-3 py-1 rounded disabled:opacity-50 ${
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import Card from '@/app/components/Card';
import SellersTable from './components/SellersTable';
import { getSellerStats, getSellers } from './actions';

export default async function SellersPage({ searchParams }) {
  // Get initial data
  const [stats, sellers] = await Promise.all([
    getSellerStats(),
    getSellers({
      status: searchParams.status,
      search: searchParams.search,
      page: Number(searchParams.page) || 1
    })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sellers Management</h1>
        <p className="text-gray-500 mt-2">Manage and monitor seller accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-500">Active Sellers</h3>
          <p className="text-3xl font-bold mt-2">{stats.active}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold text-gray-500">Pending Verification</h3>
          <p className="text-3xl font-bold mt-2">{stats.pending}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold text-gray-500">Suspended</h3>
          <p className="text-3xl font-bold mt-2">{stats.suspended}</p>
        </Card>
      </div>

      <Card className="p-6">

        <SellersTable initialData={sellers} />
      </Card>
    </div>
  );
}

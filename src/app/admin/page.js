import React from 'react';
import Card from '@/app/components/Card';

export default async function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-500">Total Sellers</h3>
          <p className="text-3xl font-bold mt-2">Loading...</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold text-gray-500">Active Products</h3>
          <p className="text-3xl font-bold mt-2">Loading...</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold text-gray-500">Pending Orders</h3>
          <p className="text-3xl font-bold mt-2">Loading...</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">Loading...</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <p className="text-gray-500">Loading...</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Seller Verification Requests</h2>
          <p className="text-gray-500">Loading...</p>
        </Card>
      </div>
    </div>
  );
}
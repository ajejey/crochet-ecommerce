'use client';
import React, { useState } from 'react';
import { Package, ShoppingBag, Image, Clock, ChevronRight, Plus, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const AdminDashboard = () => {
  const [newOrders] = useState(3);
  
  // Sample data
  const recentOrders = [
    { id: '1234', customer: 'Sarah Johnson', product: 'Winter Scarf', status: 'New', date: '20 Oct 2024' },
    { id: '1235', customer: 'Mike Smith', product: 'Baby Blanket', status: 'Processing', date: '19 Oct 2024' },
  ];

  const lowStockItems = [
    { name: 'Blue Wool Scarf', stock: 2 },
    { name: 'Baby Booties', stock: 1 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="mt-2 text-lg text-gray-600">Today is {new Intl.DateTimeFormat('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).format(new Date())}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* New Orders Alert */}
          {newOrders > 0 && (
            <div className="col-span-full bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-8 h-8 text-blue-500 mr-4" />
                <div>
                  <h2 className="text-xl font-bold text-blue-900">You have {newOrders} new orders!</h2>
                  <p className="text-blue-700">Click to view and process them</p>
                </div>
              </div>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors">
                View Orders
              </button>
            </div>
          )}

          {/* Add New Product Card */}
          {/* <Link href="/admin/add-product" > */}
          <Link  href="/admin/add-product" className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="flex items-center justify-between mb-4">
              <Plus className="w-10 h-10 text-green-500" />
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Add New Product</h3>
            <p className="text-gray-600 text-lg">Create a new product listing</p>
          </Link>
          {/* </Link> */}

          {/* Manage Products Card */}
          <button className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-10 h-10 text-purple-500" />
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Manage Products</h3>
            <p className="text-gray-600 text-lg">Update or edit your products</p>
          </button>

          {/* Upload Photos Card */}
          <button className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="flex items-center justify-between mb-4">
              <Image className="w-10 h-10 text-indigo-500" />
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Photos</h3>
            <p className="text-gray-600 text-lg">Add new product photos</p>
          </button>
        </div>

        {/* Recent Orders */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <button className="text-blue-500 text-lg hover:text-blue-600">View All Orders</button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-gray-600">{order.customer}</p>
                    <p className="text-gray-600">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm
                      ${order.status === 'New' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {order.status}
                    </span>
                    <p className="text-gray-500 mt-1">{order.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <section className="bg-orange-50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <ShoppingBag className="w-8 h-8 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-orange-900">Low Stock Alert</h2>
            </div>
            <div className="space-y-3">
              {lowStockItems.map(item => (
                <div key={item.name} className="flex items-center justify-between bg-white rounded-lg p-4">
                  <span className="text-lg text-gray-900">{item.name}</span>
                  <span className="text-orange-600 font-medium">Only {item.stock} left</span>
                </div>
              ))}
            </div>
            <button className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg text-lg w-full hover:bg-orange-600 transition-colors">
              Update Stock Levels
            </button>
          </section>
        )}

        {/* Recent Activity Timeline */}
        <section className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <div className="flex items-center mb-6">
            <Clock className="w-8 h-8 text-gray-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4"></div>
              <div>
                <p className="text-lg text-gray-900">New order received</p>
                <p className="text-gray-500">20 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-4"></div>
              <div>
                <p className="text-lg text-gray-900">Product &quot;Winter Scarf&quot; stock updated</p>
                <p className="text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-4"></div>
              <div>
                <p className="text-lg text-gray-900">3 photos uploaded</p>
                <p className="text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
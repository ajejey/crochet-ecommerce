import React from 'react';
import Card from '@/app/components/Card';
import Link from 'next/link';
import { Users, BarChart2, FileText, Bell, ShoppingBag } from 'lucide-react';

export default async function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl lg:text-7xl font-serif text-gray-900">Admin Dashboard</h1>
        <p className="text-lg sm:text-xl text-gray-600 mt-4">Welcome to the KnitKart admin panel. Manage your platform from here.</p>
      </div>

      {/* Admin Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sellers Management */}
        <Link href="/admin/sellers" className="group">
          <Card className="p-6 h-full transition-all duration-300 border border-gray-200 hover:border-rose-300 hover:shadow-lg group-hover:bg-rose-50/50">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Sellers</h2>
                <p className="text-lg text-gray-600 mt-2">Manage seller accounts, verification, and performance</p>
              </div>
              <div className="p-3 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
                <Users className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <div className="mt-6 flex items-center text-rose-600 font-medium">
              <span>Manage sellers</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Card>
        </Link>

        {/* Google Merchant */}
        <Link href="/admin/google-merchant" className="group">
          <Card className="p-6 h-full transition-all duration-300 border border-gray-200 hover:border-rose-300 hover:shadow-lg group-hover:bg-rose-50/50">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Google Merchant</h2>
                <p className="text-lg text-gray-600 mt-2">Manage product listings on Google Shopping</p>
              </div>
              <div className="p-3 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
                <ShoppingBag className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <div className="mt-6 flex items-center text-rose-600 font-medium">
              <span>Manage listings</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Card>
        </Link>

        {/* System Logs */}
        <Link href="/admin/logs" className="group">
          <Card className="p-6 h-full transition-all duration-300 border border-gray-200 hover:border-rose-300 hover:shadow-lg group-hover:bg-rose-50/50">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">System Logs</h2>
                <p className="text-lg text-gray-600 mt-2">View application logs and system activity</p>
              </div>
              <div className="p-3 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
                <FileText className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <div className="mt-6 flex items-center text-rose-600 font-medium">
              <span>View logs</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Card>
        </Link>

        {/* Social Proof */}
        <Link href="/admin/social-proof" className="group">
          <Card className="p-6 h-full transition-all duration-300 border border-gray-200 hover:border-rose-300 hover:shadow-lg group-hover:bg-rose-50/50">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Social Proof</h2>
                <p className="text-lg text-gray-600 mt-2">Manage social proof notifications and events</p>
              </div>
              <div className="p-3 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
                <Bell className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <div className="mt-6 flex items-center text-rose-600 font-medium">
              <span>Manage notifications</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Card>
        </Link>
      </div>

      {/* Quick Stats Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-500">Total Sellers</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">—</p>
          </Card>
          
          <Card className="p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-500">Active Products</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">—</p>
          </Card>
          
          <Card className="p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-500">Pending Orders</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">—</p>
          </Card>
          
          <Card className="p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-500">Total Revenue</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">—</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
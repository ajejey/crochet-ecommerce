import { requireSeller } from '@/lib/auth-context';
import dbConnect from '@/lib/mongodb';
import { getDashboardStats, getRecentOrders, getTopProducts } from './actions';
import dynamic from 'next/dynamic';
import { AlertTriangle } from 'lucide-react';

// Import client components
const StatCard = dynamic(() => import('./components/StatCard'));
const RecentOrders = dynamic(() => import('./components/RecentOrders'));
const TopProducts = dynamic(() => import('./components/TopProducts'));
const RevenueChart = dynamic(() => import('./components/RevenueChart'));

// Import icons on client side
const DynamicIcons = dynamic(() => 
  import('lucide-react').then((mod) => ({
    Package: mod.Package,
    ShoppingCart: mod.ShoppingCart,
    AlertTriangle: mod.AlertTriangle,
    DollarSign: mod.DollarSign,
  })), 
  { ssr: false }
);

export default async function SellerDashboard() {
  await dbConnect();
  const user = await requireSeller();

  console.log("user ", user)

  const stats = await getDashboardStats(user.$id);
  const recentOrders = await getRecentOrders(user.$id);
  const topProducts = await getTopProducts(user.$id);

  if (user.pendingApproval) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 lg:py-1">
        {/* Welcome Banner */}
        <div className="relative bg-white rounded-xl p-8 mb-8 border border-gray-100 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-white to-transparent"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 font-serif">Welcome to Your Creative Journey! 🧶</h1>
            <p className="text-lg text-gray-600">We're thrilled to have you join our community of talented crochet artisans.</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-rose-50 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Account Under Review</h2>
              <p className="text-gray-600">We're reviewing your application to ensure the best experience for everyone.</p>
            </div>
          </div>
          <div className="bg-rose-50 rounded-lg p-4 text-sm text-gray-700">
            <p>Expected review time: 24-48 hours</p>
          </div>
        </div>

        {/* Next Steps Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Profile Setup Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Complete Your Profile</h3>
            <div className="space-y-3">
              <a 
                href="/seller/settings" 
                className="block p-3 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-rose-700">Update Shop Profile</span>
                  <span className="text-rose-600">→</span>
                </div>
              </a>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Add Shop Banner</span>
                  <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">Coming Soon</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Set Shop Policies</span>
                  <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prepare Content Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">While You Wait</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-rose-50 p-2 rounded-full mt-1">
                  <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600">Prepare beautiful photos of your crochet work</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-rose-50 p-2 rounded-full mt-1">
                  <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600">Set competitive prices for your creations</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-rose-50 p-2 rounded-full mt-1">
                  <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600">Plan your shipping and return policies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Need Help?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-rose-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Seller Guide</h4>
              <p className="text-gray-600 text-sm">Learn tips and best practices for successful selling</p>
            </div>
            <div className="p-4 bg-rose-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Support</h4>
              <p className="text-gray-600 text-sm">Our seller support team is here to help you succeed</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-20 md:pt-0">
      <DynamicStats stats={stats} />
      <RevenueChart data={stats.revenueData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={recentOrders} />
        <TopProducts products={topProducts} />
      </div>
    </div>
  );
}

// Client component for stats
function DynamicStats({ stats }) {
  'use client';
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Active Products"
        value={stats.activeProducts}
        IconComponent={DynamicIcons.Package}
      />
      <StatCard
        title="Total Orders"
        value={stats.totalOrders}
        IconComponent={DynamicIcons.ShoppingCart}
      />
      <StatCard
        title="Low Stock"
        value={stats.lowStockProducts}
        IconComponent={DynamicIcons.AlertTriangle}
      />
      <StatCard
        title="Total Revenue"
        value={`₹${stats.totalRevenue.toLocaleString()}`}
        IconComponent={DynamicIcons.DollarSign}
        trend={stats.revenueTrend}
      />
    </div>
  );
}
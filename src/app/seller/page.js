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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Pending Approval</h2>
          <p className="text-gray-600">Your seller account is currently under review.</p>
          <p className="text-gray-600">We'll notify you once it's approved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
import { createAdminClient } from '@/appwrite/config';
import auth from '@/auth';
import { Package, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

async function getSellerStats(userId) {
  if (!userId) return null;
  
  const { databases } = createAdminClient();
  
  try {
    // Get seller profile
    const sellerProfiles = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_SELLER_PROFILES,
      [
        databases.createQuery().equal('user_id', userId)
      ]
    );

    if (!sellerProfiles.documents.length) {
      return null;
    }

    const sellerProfile = sellerProfiles.documents[0];

    // Get products count
    const products = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      [
        databases.createQuery().equal('seller_id', sellerProfile.$id)
      ]
    );

    // Get orders count (pending)
    const pendingOrders = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ORDERS,
      [
        databases.createQuery()
          .equal('seller_id', sellerProfile.$id)
          .equal('status', 'pending')
      ]
    );

    return {
      profile: sellerProfile,
      stats: {
        totalProducts: products.total,
        pendingOrders: pendingOrders.total,
        totalSales: 0, // We'll implement this when we add orders
        accountStatus: sellerProfile.status
      }
    };
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    return null;
  }
}

export default async function SellerDashboard() {
  const user = await auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const sellerData = await getSellerStats(user.$id);

  if (!sellerData) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Welcome {user.name}!</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-2xl mx-auto">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your seller profile is not set up yet. Please complete your registration.
              </p>
              <p className="mt-2">
                <a href="/become-seller" className="text-yellow-700 font-medium hover:text-yellow-600 underline">
                  Complete Seller Registration
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { profile, stats } = sellerData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Here's what's happening with your shop today.</p>
      </div>

      {/* Status Banner */}
      {profile.status === 'pending' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your seller account is pending verification. Some features might be limited.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-semibold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-semibold">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-semibold">₹{stats.totalSales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Shop Status</p>
              <p className="text-2xl font-semibold capitalize">{profile.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/seller/products/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add New Product
          </a>
          <a
            href="/seller/orders?status=pending"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            View Pending Orders
          </a>
          <a
            href="/seller/settings"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
          >
            Complete Profile
          </a>
        </div>
      </div>
    </div>
  );
}
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';
import { requireSeller } from '@/lib/auth-context';

export default async function SellerLayout({ children }) {
  try {
    // This will throw an error if user is not an active seller
    await requireSeller();

    return (
      <div className="flex min-h-screen">
        <nav className="w-64 bg-white shadow-lg">
          {/* Sidebar */}
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Seller Dashboard</h2>
          </div>
          
          <ul className="p-4 space-y-2">
            <li>
              <Link 
                href="/seller" 
                className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/seller/products" 
                className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
              >
                <Package className="w-5 h-5 mr-3" />
                Products
              </Link>
            </li>
            <li>
              <Link 
                href="/seller/orders" 
                className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Orders
              </Link>
            </li>
            <li>
              <Link 
                href="/seller/settings" 
                className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
            </li>
          </ul>

          <div className="absolute bottom-0 w-64 p-4 border-t">
            <form action="/api/auth/logout">
              <button 
                type="submit"
                className="flex items-center w-full p-2 text-gray-700 rounded hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </form>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    );
  } catch (error) {
    redirect('/login?from=/seller');
  }
}
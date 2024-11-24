import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';
import auth from '@/auth';

export default async function SellerLayout({ children }) {
  const user = await auth.getUser();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Seller Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">{user?.name}</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
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
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <form action={auth.deleteSession}>
            <button 
              type="submit"
              className="flex items-center w-full p-2 text-gray-700 rounded hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
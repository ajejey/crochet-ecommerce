'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

// Navigation items
const navItems = [
  { href: '/seller', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/products', label: 'Products', icon: Package },
  { href: '/seller/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/seller/settings', label: 'Settings', icon: Settings },
];

export default function SellerNavigation({ user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const NavLink = ({ href, label, icon: Icon }) => {
    const isActive = pathname === href;
    const baseClasses = "flex items-center p-2 rounded transition-colors";
    const activeClasses = isActive 
      ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100" 
      : "text-gray-700 hover:bg-gray-100";

    return (
      <Link href={href} className={`${baseClasses} ${activeClasses}`}>
        <Icon className="w-5 h-5 mr-3" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-white border-b">
        <h2 className="text-xl font-semibold">Seller Dashboard</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop and Mobile */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-white border-r
        transform transition-transform duration-300 ease-in-out
        lg:transform-none lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Seller Dashboard</h2>
          {user?.name && (
            <p className="text-sm text-gray-600 mt-1">{user.name}</p>
          )}
        </div>
        
        {/* Navigation Links */}
        <div className="overflow-y-auto h-[calc(100vh-180px)]">
          <ul className="p-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink {...item} />
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-white">
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
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Bottom Navigation - Mobile only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center p-3 ${
                  isActive ? 'text-indigo-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

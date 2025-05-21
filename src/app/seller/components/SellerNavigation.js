'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu, X, Home, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';

// Navigation items
const navItems = [
  { href: '/seller', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/products', label: 'Products', icon: Package },
  { href: '/seller/orders', label: 'Orders', icon: ShoppingCart },
  // { href: '/seller/resources', label: 'Resources', icon: Lightbulb },
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
    const baseClasses = "flex items-center p-3 rounded-lg transition-all duration-200";
    const activeClasses = isActive 
      ? "text-rose-600 bg-rose-50 font-medium" 
      : "text-gray-600 hover:bg-rose-50/50 hover:text-rose-600";

    return (
      <Link href={href} className={`${baseClasses} ${activeClasses}`} prefetch={true}>
        <Icon className="w-5 h-5 mr-3" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 backdrop-blur-lg bg-white/80">
        <div className="flex items-center">
          <Link href="/" className="mr-3 text-rose-600 hover:text-rose-700 transition-colors">
            <Home className="w-5 h-5" />
          </Link>
          <h2 className="text-xl font-semibold font-serif text-gray-900">Seller Dashboard</h2>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-600 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop and Mobile */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-72 bg-white border-r border-gray-100
        transform transition-transform duration-300 ease-in-out
        lg:transform-none lg:translate-x-0 lg:shadow-sm
        ${isSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
      `}>
        {/* Sidebar Header with Pattern Background */}
        <div className="relative overflow-hidden border-b border-gray-100">
          <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-white to-transparent"></div>
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-3">
              <Link 
                href="/" 
                className="text-rose-600 hover:text-rose-700 transition-colors p-2 -ml-2 hover:bg-rose-50 rounded-lg"
                title="Go to Home"
              >
                <Home className="w-5 h-5" />
              </Link>
              <h2 className="text-xl font-bold text-gray-900 font-serif">Seller Dashboard</h2>
            </div>
            {user?.name && (
              <p className="text-sm text-gray-600">{user.name}</p>
            )}
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="overflow-y-auto h-[calc(100vh-180px)]">
          <div className="p-4 border-b border-gray-100">
            <Link 
              href="/"
              className="flex items-center p-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-rose-50/50 hover:text-rose-600"
            >
              <Home className="w-5 h-5 mr-3" />
              <span>Back to Shop</span>
            </Link>
          </div>
          <ul className="p-4 space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink {...item} />
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-white">
          <form action="/api/auth/logout">
            <button 
              type="submit"
              className="flex items-center w-full p-3 text-gray-600 rounded-lg transition-all duration-200 hover:bg-rose-50/50 hover:text-rose-600"
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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Bottom Navigation - Mobile only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 backdrop-blur-lg bg-white/80">
        <div className="flex justify-around">
          <Link
            href="/"
            className="flex flex-col items-center py-3 px-4 transition-colors text-gray-600 hover:text-rose-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Shop</span>
          </Link>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-3 px-4 transition-colors ${
                  isActive 
                    ? 'text-rose-600' 
                    : 'text-gray-600 hover:text-rose-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

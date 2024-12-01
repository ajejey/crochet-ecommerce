'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, ShoppingCart, Settings, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/sellers', label: 'Sellers', icon: Users },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminNavigation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const NavLink = ({ href, label, icon: Icon }) => {
    const isActive = pathname === href;
    const baseClasses = "flex items-center p-3 rounded-lg transition-colors";
    const activeClasses = isActive 
      ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100" 
      : "text-gray-700 hover:bg-gray-100";

    return (
      <Link href={href} className={`${baseClasses} ${activeClasses}`}>
        <Icon className="w-5 h-5 mr-3" />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-white border-b">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-10 h-full w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
      </aside>
    </>
  );
}

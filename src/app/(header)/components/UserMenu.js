'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, LogOut, Settings, Package, Store } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="w-6 h-6 animate-pulse rounded-full bg-gray-200" />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
        >
          <User className="w-5 h-5" />
          <span className="hidden sm:inline">Login</span>
        </Link>
        <Link
          href="/become-seller"
          className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-full text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          <span className="hidden sm:inline">Become a </span>Seller
        </Link>
      </div>
    );
  }

  console.log("user ", user)

  return (
    <div className="relative">
      {/* User Avatar/Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User className="w-5 h-5 text-indigo-600" />
          )}
        </div>
        <span className="hidden sm:block">{user.name}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
          {user.role === 'seller' && (
            <Link
              href="/seller"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Store className="w-4 h-4" />
              Seller Dashboard
            </Link>
          )}
          
          <Link
            href="/orders"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <Package className="w-4 h-4" />
            My Orders
          </Link>
          
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          
          <button
            onClick={async () => {
              setIsOpen(false);
              await logout();
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

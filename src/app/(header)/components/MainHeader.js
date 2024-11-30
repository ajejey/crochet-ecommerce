'use client';

import Link from 'next/link';
import { Menu, X, ShoppingCart, Heart } from 'lucide-react';
import UserMenu from './UserMenu';
import SearchBar from './SearchBar';
import { useCart } from '@/app/components/CartProvider';

// This is a client component that receives the server-side user data
export default function MainHeader({ isMenuOpen, onMenuToggle }) {
  const { itemCount } = useCart();

  return (
    <div className="border-b">
      <div className="max-w-8xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Left: Menu Button (Mobile) & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="p-2 -m-2 lg:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link 
              href="/" 
              className="text-2xl font-medium font-serif ml-2 text-indigo-800 hover:text-indigo-600 transition-colors"
            >
              CraftedWithLove
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-grow max-w-3xl hidden lg:block">
            <SearchBar />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              className="hidden sm:flex items-center p-2 -m-2 text-gray-600 hover:text-gray-900"
            >
              <Heart className="w-6 h-6" />
            </Link>

            {/* Cart */}
            <Link 
              href="/shop/cart" 
              className="flex items-center p-2 -m-2 text-gray-600 hover:text-gray-900 relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  );
}

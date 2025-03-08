'use client';

import { Heart, Menu, Search, ShoppingCart, X, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/app/components/CartProvider';

const HeaderSection = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md lg:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link 
              href="/" 
              className="text-2xl font-serif ml-2 text-indigo-900 hover:text-indigo-700 transition-colors"
            >
              CraftedWithLove
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/shop" 
              className={`text-gray-700 hover:text-indigo-600 transition-colors ${
                isActive('/shop') ? 'text-indigo-600 font-medium' : ''
              }`}
            >
              Shop
            </Link>
            <Link 
              href="/categories" 
              className={`text-gray-700 hover:text-indigo-600 transition-colors ${
                isActive('/categories') ? 'text-indigo-600 font-medium' : ''
              }`}
            >
              Categories
            </Link>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-1 rounded-full border border-gray-300 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/wishlist" className="hidden sm:block">
              <Heart className="w-6 h-6 text-gray-600 hover:text-indigo-600 transition-colors" />
            </Link>
            <Link href="/shop/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-indigo-600 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link 
              href="/login" 
              className="hidden sm:flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Login</span>
            </Link>
            <Link 
              href="/become-seller" 
              className="hidden sm:block bg-indigo-600 text-white px-4 py-2 rounded-full text-sm hover:bg-indigo-700 transition-colors"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <Link 
              href="/shop" 
              className={`block text-gray-700 hover:text-indigo-600 transition-colors ${
                isActive('/shop') ? 'text-indigo-600 font-medium' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="/categories" 
              className={`block text-gray-700 hover:text-indigo-600 transition-colors ${
                isActive('/categories') ? 'text-indigo-600 font-medium' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            {/* <Link 
              href="/wishlist" 
              className="block text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Wishlist
            </Link> */}
            <Link 
              href="/login" 
              className="block text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              href="/become-seller" 
              className="block text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Become a Seller
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HeaderSection;
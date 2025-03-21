'use client';

import Link from 'next/link';
import { Menu, X, ShoppingCart, Heart } from 'lucide-react';
import UserMenu from './UserMenu';
import SearchBar from './SearchBar';
import { useCart } from '@/app/components/CartProvider';
import { useEffect } from 'react';

export default function MainHeader({ isMenuOpen, onMenuToggle }) {
  const { itemCount, cartItems } = useCart();

  useEffect(() => {
    console.log('Cart items:', cartItems);
  }, [cartItems]);

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Left: Menu Button (Mobile) & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="p-2 -m-2 lg:hidden text-gray-500 hover:text-gray-700"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link 
              href="/" 
              className="font-allura text-3xl font-bold tracking-widest text-rose-600 hover:text-rose-700 transition-colors"
            >
              KnitKart
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-2xl hidden sm:block">
            <SearchBar />
          </div>

          {/* Right: Cart, Wishlist, User */}
          <div className="flex items-center gap-4">
            {/* <Link
              href="/wishlist"
              className="p-2 -m-2 text-gray-500 hover:text-rose-600 transition-colors relative hidden sm:block"
            >
              <Heart size={24} />
            </Link> */}

            <Link
              href="/shop/cart"
              className="p-2 -m-2 text-gray-500 hover:text-rose-600 transition-colors relative"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <UserMenu />
          </div>
        </div>

        {/* Mobile Search (Below Header) */}
        <div className="mt-4 sm:hidden">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

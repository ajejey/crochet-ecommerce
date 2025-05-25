'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { PRODUCT_CATEGORIES } from '@/constants/product';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CategoryNav({ isMenuOpen }) {
  const pathname = usePathname();
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check if a path is active
  const isActive = (path) => {
    if (path === '/shop') {
      return pathname === '/shop' && !pathname.includes('?category=');
    }
    return pathname === path;
  };

  // Check if a category is active
  const isCategoryActive = (categoryId) => {
    return pathname.includes(`/shop?category=${categoryId}`) || 
           pathname.includes(`category=${categoryId}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDesktopDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 h-12">
          {/* Shop Link */}
          <Link
            href="/shop"
            className={`text-sm font-medium transition-colors hover:text-rose-600 ${
              isActive('/shop') ? 'text-rose-600' : 'text-gray-700'
            }`}
          >
            Shop
          </Link>

          {/* Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className={`flex items-center text-sm font-medium transition-colors hover:text-rose-600 ${
                pathname.includes('category=') ? 'text-rose-600' : 'text-gray-700'
              }`}
              onMouseEnter={() => setDesktopDropdownOpen(true)}
              onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
            >
              Categories
              <span className="ml-1">
                {desktopDropdownOpen ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />}
              </span>
            </button>

            {/* Desktop Dropdown Menu */}
            {desktopDropdownOpen && (
              <div 
                className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
                onMouseLeave={() => setDesktopDropdownOpen(false)}
              >
                {PRODUCT_CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${category.id}`}
                    className={`block px-4 py-2 text-sm hover:bg-rose-50 ${
                      isCategoryActive(category.id) ? 'bg-rose-50 text-rose-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {category.label}
                    <p className="text-xs text-gray-500 mt-0.5">{category.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Creators Link */}
          <Link
            href="/creators"
            className={`text-sm font-medium transition-colors hover:text-rose-600 ${
              isActive('/creators') ? 'text-rose-600' : 'text-gray-700'
            }`}
          >
            Creators
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden ${
            isMenuOpen ? 'block' : 'hidden'
          } py-4 space-y-2`}
        >
          {/* Shop Link */}
          <Link
            href="/shop"
            className={`block text-sm font-medium transition-colors hover:text-rose-600 py-2 ${
              isActive('/shop') ? 'text-rose-600' : 'text-gray-700'
            }`}
          >
            Shop
          </Link>

          {/* Categories Accordion */}
          <div className="border-b border-gray-100 pb-1">
            <button
              className="flex items-center justify-between w-full text-sm font-medium py-2"
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            >
              <span className={`${pathname.includes('category=') ? 'text-rose-600' : 'text-gray-700'}`}>
                Categories
              </span>
              <span>
                {mobileDropdownOpen ? 
                  <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                  <ChevronDown className="h-4 w-4 text-gray-500" />}
              </span>
            </button>

            {/* Mobile Dropdown Menu */}
            {mobileDropdownOpen && (
              <div className="pl-4 space-y-2 mt-1 mb-2">
                {PRODUCT_CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${category.id}`}
                    className={`block text-sm py-1.5 ${
                      isCategoryActive(category.id) ? 'text-rose-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Creators Link */}
          <Link
            href="/creators"
            className={`block text-sm font-medium transition-colors hover:text-rose-600 py-2 ${
              isActive('/creators') ? 'text-rose-600' : 'text-gray-700'
            }`}
          >
            Creators
          </Link>
        </div>
      </div>
    </nav>
  );
}

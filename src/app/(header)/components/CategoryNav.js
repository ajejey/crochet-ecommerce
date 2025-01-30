'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PRODUCT_CATEGORIES } from '@/constants/product';

export default function CategoryNav({ isMenuOpen }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 h-12">
          {/* link to creators route */}
          <Link
            href="/creators"
            className={`text-sm font-medium transition-colors hover:text-rose-600 ${
              isActive('/creators')
                ? 'text-rose-600'
                : 'text-gray-700'
            }`}
          >
            Creators
          </Link>
          {PRODUCT_CATEGORIES.map((category, index) => (
            <Link
              key={`${category.value}-${index}`}
              href={`/shop?category=${category.value}`}
              className={`text-sm font-medium transition-colors hover:text-rose-600 ${
                isActive(`/shop?category=${category.value}`)
                  ? 'text-rose-600'
                  : 'text-gray-700'
              }`}
            >
              {category.label}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden ${
            isMenuOpen ? 'block' : 'hidden'
          } py-4 space-y-4`}
        >
          {PRODUCT_CATEGORIES.map((category, index) => (
            <Link
              key={`${category.value}-${index}`}
              href={`/shop?category=${category.value}`}
              className={`block text-sm font-medium transition-colors hover:text-rose-600 ${
                isActive(`/shop?category=${category.value}`)
                  ? 'text-rose-600'
                  : 'text-gray-700'
              }`}
            >
              {category.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

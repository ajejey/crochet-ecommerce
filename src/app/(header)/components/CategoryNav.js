'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PRODUCT_CATEGORIES } from '@/constants/product';

export default function CategoryNav({ isMenuOpen }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <nav className="border-b bg-white">
      <div className="max-w-8xl mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 h-12">
          {PRODUCT_CATEGORIES.map((category) => (
            <Link
              key={category.value}
              href={`/shop?category=${category.value}`}
              className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                isActive(`/shop?category=${category.value}`)
                  ? 'text-indigo-600'
                  : 'text-gray-700'
              }`}
            >
              {category.label}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-4">
            {PRODUCT_CATEGORIES.map((category) => (
              <Link
                key={category.value}
                href={`/shop?category=${category.value}`}
                className={`block text-sm font-medium transition-colors hover:text-indigo-600 ${
                  isActive(`/shop?category=${category.value}`)
                    ? 'text-indigo-600'
                    : 'text-gray-700'
                }`}
              >
                {category.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
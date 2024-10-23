'use client';
import { Heart, Menu, Search, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'

const HeaderSection = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md lg:hidden"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/" className="text-2xl font-serif ml-2 text-indigo-900">CraftedWithLove</Link>
            </div>

            <div className="hidden lg:flex space-x-8">
              <Link href="/shop" className="text-gray-700 hover:text-indigo-600">Shop</Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600">About</Link>
              <Link href="/contact" className="text-gray-700 hover:text-indigo-600">Contact</Link>
              <Link href="/admin" className="text-gray-700 hover:text-indigo-600">Admin</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Search className="w-6 h-6 text-gray-600 cursor-pointer" />
              <Heart className="w-6 h-6 text-gray-600 cursor-pointer" />
              <ShoppingCart className="w-6 h-6 text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/shop" className="block px-3 py-2 text-gray-700">Shop</Link>
              <Link href="/about" className="block px-3 py-2 text-gray-700">About</Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700">Contact</Link>
              <Link href="/admin" className="block px-3 py-2 text-gray-700">Admin</Link>
            </div>
          </div>
        )}
      </nav>
  )
}

export default HeaderSection
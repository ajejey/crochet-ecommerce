'use client';
import React, { useState } from 'react';
import { Heart, ShoppingCart, Menu, Search, X } from 'lucide-react';
import Link from 'next/link';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Sample data - in production, this would come from your database
  const featuredProducts = [
    { id: 1, name: 'Hand-knitted Winter Scarf', price: 45.99, image: '/api/placeholder/300/400' },
    { id: 2, name: 'Crochet Baby Blanket', price: 89.99, image: '/api/placeholder/300/400' },
    { id: 3, name: 'Wool Beanie Hat', price: 29.99, image: '/api/placeholder/300/400' },
  ];

  const categories = [
    { name: 'Scarves', image: '/api/placeholder/200/200' },
    { name: 'Blankets', image: '/api/placeholder/200/200' },
    { name: 'Baby Items', image: '/api/placeholder/200/200' },
    { name: 'Accessories', image: '/api/placeholder/200/200' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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
              <span className="text-2xl font-serif ml-2 text-indigo-900">CraftedWithLove</span>
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

      {/* Hero Section */}
      <div className="relative pt-16">
        <div className="h-[70vh] bg-cover bg-center relative" style={{ backgroundImage: `url('/api/placeholder/1920/1080')` }}>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-serif mb-4">Handcrafted with Love</h1>
              <p className="text-xl mb-8">Unique, handmade knitted & crochet creations</p>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-serif text-gray-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-6 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Quick View
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-gray-900 mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div key={category.name} className="relative group cursor-pointer">
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xl font-medium">{category.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif mb-4">Join Our Newsletter</h2>
          <p className="mb-8">Get updates on new products and exclusive offers</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-full text-gray-900"
            />
            <button className="bg-white text-indigo-900 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-medium mb-4">About Us</h3>
              <p className="text-sm">Handcrafted with love, each piece tells a unique story. Made with care in small batches using premium materials.</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/shop" className="hover:text-white">Shop</a></li>
                <li><a href="/about" className="hover:text-white">About</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
                <li><a href="/shipping" className="hover:text-white">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>Email: hello@craftedwithlove.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Location: Portland, OR</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © 2024 CraftedWithLove. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import HeaderSection from './HeaderSection';
import useSWR from 'swr';
import { getActiveProducts } from './shop/actions';

const HomePage = () => {
  const { data: products, error } = useSWR('featured-products', getActiveProducts);

  const categories = [
    { 
      name: 'All Products', 
      image: 'https://images.unsplash.com/photo-1530396333989-24c5b8f805dd?q=80&w=2070&auto=format&fit=crop',
      href: '/shop'
    },
    { 
      name: 'Baby Items', 
      image: 'https://images.unsplash.com/photo-1619704685668-5570c998688a?q=80&w=1473&auto=format&fit=crop',
      href: '/shop?category=baby'
    },
    { 
      name: 'Accessories', 
      image: 'https://images.unsplash.com/photo-1517496267011-39d56c54984d?q=80&w=1074&auto=format&fit=crop',
      href: '/shop?category=accessories'
    },
    { 
      name: 'Home Decor', 
      image: 'https://images.unsplash.com/photo-1531414264812-7b5838eb2dfc?q=80&w=1170&auto=format&fit=crop',
      href: '/shop?category=home'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSection />

      {/* Hero Section */}
      <div className="relative pt-16">
        <div
          className="h-[70vh] bg-cover bg-center relative"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1530396333989-24c5b8f805dd?q=80&w=2070&auto=format&fit=crop')` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-serif mb-4">Handcrafted with Love</h1>
              <p className="text-xl mb-8">Unique, handmade knitted & crochet creations</p>
              <div className="space-x-4">
                <Link 
                  href="/shop" 
                  className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                </Link>
                <Link 
                  href="/become-seller" 
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Become a Seller
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif text-gray-900">Featured Products</h2>
          <Link 
            href="/shop" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products?.slice(0, 3).map((product) => (
            <div key={product.$id} className="group">
              <Link href={`/shop/product/${product.$id}`}>
                <div className="relative overflow-hidden rounded-lg aspect-square">
                  {product.image_urls?.[0] ? (
                    <Image
                      src={product.image_urls[0]}
                      alt={product.name}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                </div>
              </Link>
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
              <Link 
                key={category.name} 
                href={category.href}
                className="relative group cursor-pointer"
              >
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <h3 className="text-white text-xl font-medium">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif mb-4">Start Selling Your Creations</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our community of talented artisans and share your handcrafted items with customers worldwide.
          </p>
          <Link
            href="/become-seller"
            className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Become a Seller
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
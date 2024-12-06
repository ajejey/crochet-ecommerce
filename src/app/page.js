'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { getActiveProducts } from './shop/actions';
import HeaderSection from './(header)/HeaderSection';
import { ArrowRight, Star } from 'lucide-react';

const HomePage = () => {
  const { data: products, error } = useSWR('featured-products', getActiveProducts);
  console.log('Products:', products);
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
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?q=80&w=1470&auto=format&fit=crop',
      href: '/shop?category=home-decor'
    }
  ];

  const trustFeatures = [
    {
      icon: Star,
      title: 'Handcrafted Quality',
      description: 'Each item is carefully made with love and attention to detail'
    },
    {
      icon: Star,
      title: 'Secure Payments',
      description: 'Shop with confidence using our secure payment system'
    },
    {
      icon: Star,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to your doorstep'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HeaderSection />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 font-serif">
                Handcrafted with Love
                <span className="block text-rose-600">Just for You</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl font-light">
                Discover unique, handmade crochet creations that bring warmth and character to your home
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <button className="px-8 py-4 bg-rose-600 text-white rounded-full text-lg font-medium hover:bg-rose-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                    Shop Now
                  </button>
                </Link>
                <Link href="/become-seller">
                  <button className="px-8 py-4 bg-white text-rose-600 border-2 border-rose-600 rounded-full text-lg font-medium hover:bg-rose-50 transition-colors duration-200">
                    Become a Seller
                  </button>
                </Link>
              </div>
            </div>
            {/* Right Column - Featured Image */}
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/crochet-yarn.png"
                alt="Handcrafted Crochet Items"
                fill
                className="object-contain md:object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link href={category.href} key={index}>
                <div className="group relative h-64 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                    <p className="text-rose-200 group-hover:text-rose-300 flex items-center mt-2">
                      Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {!products && !error ? (
              // Loading state
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center text-gray-500">
                Unable to load products at this time
              </div>
            ) : products?.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No featured products available yet
              </div>
            ) : (
              products?.slice(0, 6).map((product) => (
                <Link 
                  href={`/shop/product/${product._id}`} 
                  key={product._id}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2">
                    <div className="relative h-64">
                      <Image
                        src={product.images[0]?.url || '/images/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                      <div className="flex items-center mt-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="ml-2 text-gray-600">
                          {product.rating.toFixed(1)} ({product.numReviews} reviews)
                        </span>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-rose-600">₹{product.price}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-600 mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, Camera, DollarSign, Package2, HeartHandshake, 
  TrendingUp, Users, Palette, Truck, Award, Lightbulb,
  ChevronRight, Play, Clock, Star
} from 'lucide-react';

// Categories for resources
const categories = [
  { id: 'getting-started', name: 'Getting Started', icon: Lightbulb },
  { id: 'product-photography', name: 'Product Photography', icon: Camera },
  { id: 'pricing', name: 'Pricing & Finance', icon: DollarSign },
  { id: 'inventory', name: 'Inventory Management', icon: Package2 },
  { id: 'customer-service', name: 'Customer Service', icon: HeartHandshake },
  { id: 'growth', name: 'Growth Strategies', icon: TrendingUp },
  { id: 'community', name: 'Seller Community', icon: Users },
  { id: 'design', name: 'Design Trends', icon: Palette },
  { id: 'shipping', name: 'Shipping & Logistics', icon: Truck },
  { id: 'success-stories', name: 'Success Stories', icon: Award }
];

// Featured content
const featuredContent = [
  {
    id: 1,
    title: 'Ultimate Guide to Crochet Product Photography',
    category: 'product-photography',
    type: 'guide',
    duration: '15 min read',
    image: '/images/resources/photography-guide.jpg',
    rating: 4.9,
    reviews: 128
  },
  {
    id: 2,
    title: 'Pricing Strategies for Handmade Items',
    category: 'pricing',
    type: 'video',
    duration: '12 min watch',
    image: '/images/resources/pricing-guide.jpg',
    rating: 4.8,
    reviews: 95
  },
  {
    id: 3,
    title: 'From Hobby to Business: A Seller Success Story',
    category: 'success-stories',
    type: 'case-study',
    duration: '10 min read',
    image: '/images/resources/success-story.jpg',
    rating: 5.0,
    reviews: 67
  }
];

// Latest resources
const latestResources = [
  {
    id: 1,
    title: 'Seasonal Trends: Winter Collection Ideas',
    category: 'design',
    type: 'article',
    date: '2 days ago'
  },
  {
    id: 2,
    title: 'Optimizing Your Shop for the Holiday Season',
    category: 'growth',
    type: 'webinar',
    date: '1 week ago'
  },
  {
    id: 3,
    title: 'Eco-Friendly Packaging Solutions',
    category: 'shipping',
    type: 'guide',
    date: '2 weeks ago'
  }
];

// Resource card component
function ResourceCard({ resource }) {
  const { title, category, type, duration, image, rating, reviews } = resource;
  const categoryData = categories.find(c => c.category === category);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-medium">
            {type}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {duration}
          </span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        {rating && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium text-gray-900">{rating}</span>
            </div>
            <span className="text-sm text-gray-500">({reviews} reviews)</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative bg-white rounded-xl p-8 mb-12 border border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-white to-transparent"></div>
        <div className="relative max-w-3xl">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Seller Resources</h1>
          <p className="text-xl text-gray-600 mb-6">
            Everything you need to grow your crochet business. From photography tips to pricing strategies,
            we're here to help you succeed.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/seller/resources/getting-started"
              className="inline-flex items-center px-6 py-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors"
            >
              Get Started
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/seller/resources/community"
              className="inline-flex items-center px-6 py-3 bg-rose-50 text-rose-600 rounded-full hover:bg-rose-100 transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedCategory === category.id
                  ? 'border-rose-200 bg-rose-50'
                  : 'border-gray-100 bg-white hover:border-rose-100 hover:bg-rose-50/50'
              }`}
            >
              <Icon className={`w-6 h-6 mb-2 ${
                selectedCategory === category.id ? 'text-rose-600' : 'text-gray-400'
              }`} />
              <h3 className={`font-medium ${
                selectedCategory === category.id ? 'text-rose-600' : 'text-gray-900'
              }`}>
                {category.name}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Featured Content */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif text-gray-900">Featured Resources</h2>
          <Link 
            href="/seller/resources/featured"
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            View All
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredContent.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </section>

      {/* Latest Resources */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif text-gray-900 mb-6">Latest Updates</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {latestResources.map((resource) => (
            <Link
              key={resource.id}
              href={`/seller/resources/${resource.category}/${resource.id}`}
              className="flex items-center justify-between p-4 hover:bg-rose-50/50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-xs font-medium">
                    {resource.type}
                  </span>
                  <span>•</span>
                  <span>{resource.date}</span>
                </div>
                <h3 className="font-medium text-gray-900">{resource.title}</h3>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-serif text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-4">
            Connect with fellow sellers, share experiences, and grow together in our vibrant community.
          </p>
          <Link
            href="/seller/resources/community"
            className="inline-flex items-center text-rose-600 hover:text-rose-700 font-medium"
          >
            Join Now
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-serif text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-4">
            Our seller support team is here to help you succeed. Get in touch with us.
          </p>
          <Link
            href="/seller/resources/support"
            className="inline-flex items-center text-rose-600 hover:text-rose-700 font-medium"
          >
            Contact Support
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}

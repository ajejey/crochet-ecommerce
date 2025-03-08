import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-6 font-allura text-3xl font-bold tracking-widest text-rose-600 hover:text-rose-700 transition-colors">
              KnitKart
            </Link>
            <p className="text-gray-600 mb-6">
              India's first AI-powered platform for handcrafted crochet products. 
              Discover unique, artisanal pieces made with love.
            </p>
            <div className="flex space-x-4">
              {/* TODO: Add actual social media links */}
              <a href="#" className="text-gray-400 hover:text-rose-600 transition-colors duration-200">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-600 transition-colors duration-200">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-600 transition-colors duration-200">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-600 transition-colors duration-200">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h3 className="font-serif text-xl text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/best-sellers" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  Sale
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Company */}
          <div>
            <h3 className="font-serif text-xl text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/become-seller" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  Become a Seller
                </Link>
              </li>
              {/* <li>
                <Link href="/blog" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  Blog
                </Link>
              </li> */}
              {/* <li>
                <Link href="/careers" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  Careers
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <h3 className="font-serif text-xl text-gray-900 mb-4">Support & Policies</h3>
            <ul className="space-y-3">
              {/* <li>
                <Link href="/help" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  Help Center
                </Link>
              </li> */}
              <li>
                <Link href="/policies/shipping" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/cancellation-refund" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  Returns & Refunds
                </Link>
              </li>
              {/* <li>
                <Link href="/track-order" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  Track Order
                </Link>
              </li> */}
              <li>
                <Link href="/policies/privacy" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-serif text-xl text-gray-900 mb-4">Join Our Newsletter</h3>
            <p className="text-gray-600 mb-6">
              Subscribe to get special offers, free giveaways, and amazing deals.
            </p>
            {/* TODO: Add newsletter subscription functionality */}
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm">
              &copy; {currentYear} KnitKart. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:space-x-6">
              <Link href="/policies/terms" className="text-gray-600 hover:text-rose-600 transition-colors duration-200 text-sm">
                Terms & Conditions
              </Link>
              <Link href="/policies/privacy" className="text-gray-600 hover:text-rose-600 transition-colors duration-200 text-sm">
                Privacy Policy
              </Link>
              <Link href="/policies/pricing" className="text-gray-600 hover:text-rose-600 transition-colors duration-200 text-sm">
                Pricing Policy
              </Link>
              <Link href="/policies/shipping" className="text-gray-600 hover:text-rose-600 transition-colors duration-200 text-sm">
                Shipping Policy
              </Link>
              <Link href="/policies/cancellation-refund" className="text-gray-600 hover:text-rose-600 transition-colors duration-200 text-sm">
                Cancellation & Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

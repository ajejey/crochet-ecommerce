"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Target, TrendingUp, Lightbulb, Bot, BarChart3, Rocket, Brain } from 'lucide-react';

export default function BecomeSellerPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden py-12 sm:py-20">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white to-transparent"></div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 font-serif">
              Share Your Beautiful Crochet Work
              <span className="block text-rose-600 mt-4 text-3xl sm:text-3xl md:text-4xl lg:text-6xl">Build Your Creative Business</span>
            </h1>
            <p className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light px-4">
              Join India's first AI Powered platform made specially for crochet artists like you. 
              Whether you create in your free time or want to start a business, we're here to help you succeed.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
              <Link href="/become-seller/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-rose-600 text-white rounded-full text-base sm:text-lg font-medium hover:bg-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  Start Your Journey
                </button>
              </Link>
              <Link href="#learn-more" className="text-gray-600 hover:text-rose-600 transition-colors duration-200 text-base sm:text-lg">
                Learn more →
              </Link>
            </div>
            
            {/* Quick Highlight Points */}
            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto px-4">
              {[
                { 
                  icon: <Sparkles className="w-8 h-8 text-rose-600" />, 
                  text: "Smart AI technology writes perfect product descriptions for you" 
                },
                { 
                  icon: <Target className="w-8 h-8 text-rose-600" />, 
                  text: "We help customers find your creations easily" 
                },
                { 
                  icon: <TrendingUp className="w-8 h-8 text-rose-600" />, 
                  text: "Your products rank higher on Google and get discovered by more customers" 
                },
                { 
                  icon: <Lightbulb className="w-8 h-8 text-rose-600" />, 
                  text: "Know what products sell best" 
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="mb-2 flex justify-center">{item.icon}</div>
                  <p className="text-gray-700 text-center">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Advantage Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-rose-50" id="learn-more">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
              We Make Selling Simple
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Focus on creating beautiful crochet pieces. Our smart AI technology handles everything else - 
              from writing product descriptions to helping you reach customers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 px-4">
            {[
              {
                title: "Easy Product Listings",
                description: "Just take photos of your work. Our AI writes perfect descriptions that help sell your items. No typing needed!",
                icon: <Bot className="w-8 h-8 text-rose-600" />
              },
              {
                title: "Know What Sells",
                description: "We show you which products are popular and what prices work best. Make more of what customers love!",
                icon: <BarChart3 className="w-8 h-8 text-rose-600" />
              },
              {
                title: "Personal Growth Guide",
                description: "Get friendly tips to improve your sales. We're like having a helpful friend who knows the business.",
                icon: <Brain className="w-8 h-8 text-rose-600" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex justify-center mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              A complete suite of tools and support to help you grow your business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 px-4">
            <div className="space-y-6 sm:space-y-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Easy to Start, Easy to Run</h3>
              <ul className="space-y-4 sm:space-y-6">
                {[
                  "Simple photo uploads - just click pictures from your phone",
                  "Get paid directly to your bank account",
                  "We help you with packaging and shipping",
                  "Keep upto 90% of your sales - lowest fees in the market"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-start"
                  >
                    <span className="flex-shrink-0 p-1 bg-rose-100 rounded-full mr-4">
                      <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="text-lg text-gray-600">{item}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="space-y-6 sm:space-y-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Grow Your Business Your Way</h3>
              <ul className="space-y-4 sm:space-y-6">
                {[
                  "Sell to crochet lovers across India",
                  "Your own beautiful shop page to share with everyone",
                  "Join a friendly community of crochet artists",
                  "Learn new skills with our resources"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-start"
                  >
                    <span className="flex-shrink-0 p-1 bg-rose-100 rounded-full mr-4">
                      <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="text-lg text-gray-600">{item}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
              The Perfect Time to Start
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              More people than ever want to buy handmade crochet items. Start your journey today and be part of this growing market.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
            {[
              {
                stat: "₹75,000Cr",
                label: "Growing Market",
                subtext: "Indian handicraft market size by 2024"
              },
              {
                stat: "28%",
                label: "Rising Demand",
                subtext: "More people buying handmade items online every year"
              },
              {
                stat: "70M+",
                label: "Big Community",
                subtext: "Crochet lovers waiting to discover your work"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="text-3xl font-bold text-rose-600 mb-2">{item.stat}</div>
                <div className="text-xl font-semibold text-gray-900 mb-2">{item.label}</div>
                <p className="text-gray-600">{item.subtext}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-3xl p-6 sm:p-12 text-center shadow-xl"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Start Your Success Story Today
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">
              Join hundreds of crochet artists who are turning their skill into success. 
              We're here to help you every step of the way.
            </p>
            <Link href="/become-seller/register" className="block w-full sm:w-auto sm:inline-block">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-rose-600 text-white rounded-full text-base sm:text-lg font-medium hover:bg-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                Begin Your Journey
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
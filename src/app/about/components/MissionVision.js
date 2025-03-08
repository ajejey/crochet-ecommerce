'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function MissionVision() {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            {/* Tab Navigation */}
            <div className="inline-flex bg-gray-100 rounded-lg p-1 mb-8">
              <button
                onClick={() => setActiveTab('mission')}
                className={`px-6 py-2 rounded-md text-lg ${
                  activeTab === 'mission'
                    ? 'bg-rose-600 text-white'
                    : 'text-gray-700 hover:text-rose-600'
                } transition-colors duration-200`}
              >
                Our Mission
              </button>
              <button
                onClick={() => setActiveTab('vision')}
                className={`px-6 py-2 rounded-md text-lg ${
                  activeTab === 'vision'
                    ? 'bg-rose-600 text-white'
                    : 'text-gray-700 hover:text-rose-600'
                } transition-colors duration-200`}
              >
                Our Vision
              </button>
            </div>

            {/* Mission Content */}
            {activeTab === 'mission' && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-4">
                  To empower Indian crochet artisans by providing them a digital platform that celebrates their 
                  craftsmanship, ensures fair compensation, and connects them directly with appreciative customers worldwide.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  We strive to preserve traditional crochet techniques while embracing innovation, 
                  creating sustainable livelihoods for artisans and delivering exceptional handcrafted 
                  products to our customers.
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-rose-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Provide a platform for artisans to showcase their crochet craftsmanship</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-rose-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ensure fair and transparent pricing that benefits creators</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-rose-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Educate consumers about the value of handmade, sustainable products</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-rose-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Preserve traditional techniques while embracing modern designs</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Vision Content */}
            {activeTab === 'vision' && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-6">Our Vision</h2>
                <p className="text-lg text-gray-600 mb-4">
                  To be India's leading platform for handcrafted crochet products, where technology 
                  and tradition come together to create a thriving ecosystem for artisans and consumers alike.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  We envision a future where crochet artistry is widely recognized and valued, 
                  where skilled craftspeople can earn dignified livelihoods, and where consumers 
                  can easily access unique, sustainable, and meaningful products.
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-rose-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Create the largest digital marketplace for handcrafted crochet products in India</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-rose-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Leverage AI to enhance the discovery and creation of crochet designs</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-rose-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Build a community that values handcrafted quality over mass production</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-rose-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Establish a globally recognized brand for Indian crochet craftsmanship</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="order-1 md:order-2">
            {activeTab === 'mission' ? (
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/mission-image.jpg"
                  alt="Artisan creating crochet products"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/vision-image.jpg"
                  alt="Digital marketplace for crochet products"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

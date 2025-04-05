import Link from 'next/link';
import Image from 'next/image';
import { Clock, Sparkles, Target } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rose-50 rounded-3xl overflow-hidden shadow-lg relative">
          <div className="absolute inset-0 opacity-5 pattern-diagonal-lines pattern-rose-600 pattern-bg-transparent pattern-size-4"></div>
          
          <div className="md:flex items-center relative z-10">
            <div className="md:w-1/2 p-8 md:p-12 lg:p-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">Join Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8">
                Whether you're a crochet enthusiast, a skilled artisan, or simply someone who appreciates handcrafted beauty, 
                there are many ways to become part of the KnitKart community and support our mission.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Shop Mindfully</h3>
                  <p className="text-gray-600 text-sm">
                    Every purchase directly supports an artisan and helps preserve traditional crochet techniques.
                  </p>
                  <Link href="/shop" className="text-rose-600 font-medium mt-2 inline-block hover:text-rose-700">
                    Explore Products →
                  </Link>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Join as an Artisan</h3>
                  <p className="text-gray-600 text-sm">
                    If you're a crochet artist looking to reach new customers and grow your business, join our platform.
                  </p>
                  <Link href="/become-seller" className="text-rose-600 font-medium mt-2 inline-block hover:text-rose-700">
                    Apply Now →
                  </Link>
                </div>
              </div>
              
              <div className="space-x-4">
                <Link 
                  href="/contact" 
                  className="inline-block px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-300"
                >
                  Contact Us
                </Link>
                {/* <Link 
                  href="/newsletter" 
                  className="inline-block px-6 py-3 bg-white text-rose-600 rounded-lg border border-rose-200 hover:border-rose-600 transition-colors duration-300"
                >
                  Join Newsletter
                </Link> */}
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="relative h-64 md:h-full min-h-[320px] bg-gradient-to-br from-rose-100 to-rose-50 rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('/pattern-bg.svg')] opacity-10"></div>
                
                {/* Central content */}
                <div className="text-center px-6 z-10">
                  <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Grow Your Craft Business</h3>
                  <p className="text-gray-700 max-w-md mx-auto">Join our community of artisans and turn your passion into a thriving online business.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Partners and Recognition */}
        {/* <div className="mt-16 md:mt-24">
          <h3 className="text-center text-xl font-semibold text-gray-900 mb-12">Recognized By</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
            <div className="relative h-16 w-full max-w-[120px]">
              <Image
                src="/images/partner-1.png"
                alt="Craft Council of India"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative h-16 w-full max-w-[120px]">
              <Image
                src="/images/partner-2.png"
                alt="Ministry of Textiles"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative h-16 w-full max-w-[120px]">
              <Image
                src="/images/partner-3.png"
                alt="Forbes India"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative h-16 w-full max-w-[120px]">
              <Image
                src="/images/partner-4.png"
                alt="India Artisan Association"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}

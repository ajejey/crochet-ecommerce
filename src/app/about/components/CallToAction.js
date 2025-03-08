import Link from 'next/link';
import Image from 'next/image';

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
                  <Link href="/products" className="text-rose-600 font-medium mt-2 inline-block hover:text-rose-700">
                    Explore Products →
                  </Link>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Join as an Artisan</h3>
                  <p className="text-gray-600 text-sm">
                    If you're a crochet artist looking to reach new customers and grow your business, join our platform.
                  </p>
                  <Link href="/artisans/join" className="text-rose-600 font-medium mt-2 inline-block hover:text-rose-700">
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
                <Link 
                  href="/newsletter" 
                  className="inline-block px-6 py-3 bg-white text-rose-600 rounded-lg border border-rose-200 hover:border-rose-600 transition-colors duration-300"
                >
                  Join Newsletter
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="relative h-64 md:h-full min-h-[320px]">
                <Image
                  src="/images/cta-image.jpg"
                  alt="Join the KnitKart community"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Floating elements */}
                <div className="absolute top-12 right-12 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg hidden md:block">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Quick Onboarding</p>
                      <p className="text-xs text-gray-500">Start selling in 24 hours</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-12 left-12 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg hidden md:block">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Fair Compensation</p>
                      <p className="text-xs text-gray-500">3x more than local markets</p>
                    </div>
                  </div>
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

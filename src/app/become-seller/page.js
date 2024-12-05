import Link from 'next/link';

export default function BecomeSellerPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 font-serif">
              Share Your Crochet Creations
              <span className="block text-rose-600">with Art Lovers</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              A dedicated marketplace for your handcrafted treasures
            </p>
            <Link href="/become-seller/register">
              <button className="mt-8 px-8 py-4 bg-rose-600 text-white rounded-full text-lg font-medium hover:bg-rose-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                Start Your Journey
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="w-16 h-16 mx-auto mb-6 text-rose-600">
                  <img src="/images/create-icon.svg" alt="Create" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Focus on Your Craft</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Spend more time creating beautiful pieces and less time on marketing
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="w-16 h-16 mx-auto mb-6 text-emerald-600">
                  <img src="/images/reach-icon.svg" alt="Reach" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Reach Art Lovers</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Connect with enthusiasts who value handcrafted treasures
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="w-16 h-16 mx-auto mb-6 text-amber-600">
                  <img src="/images/grow-icon.svg" alt="Grow" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Grow Your Business</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Turn your passion into a thriving business, your way
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-900">Simple Selling Experience</h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <span className="flex-shrink-0 p-1 bg-rose-100 rounded-full mr-4">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <p className="text-lg text-gray-600">Easy product listings with multiple photos</p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 p-1 bg-rose-100 rounded-full mr-4">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <p className="text-lg text-gray-600">Secure and timely payments</p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 p-1 bg-rose-100 rounded-full mr-4">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <p className="text-lg text-gray-600">Hassle-free shipping management</p>
                </li>
              </ul>
            </div>
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-900">Growth Opportunities</h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <span className="flex-shrink-0 p-1 bg-rose-100 rounded-full mr-4">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <p className="text-lg text-gray-600">Reach art enthusiasts nationwide</p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 p-1 bg-rose-100 rounded-full mr-4">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <p className="text-lg text-gray-600">Build your brand with a dedicated store page</p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 p-1 bg-rose-100 rounded-full mr-4">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <p className="text-lg text-gray-600">Join a supportive community of artisans</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Early Seller Benefits */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-3xl p-12 text-center shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Join Our Growing Artisan Community
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Join Early and Unlock Premium Benefits
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Priority Features</h3>
                <p className="text-gray-600">Get featured placement and early access to new platform features</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dedicated Support</h3>
                <p className="text-gray-600">Get personalized assistance to help grow your business</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Launch Benefits</h3>
                <p className="text-gray-600">Enjoy special commission rates and promotional support</p>
              </div>
            </div>
            <Link href="/become-seller/register">
              <button className="px-8 py-4 bg-rose-600 text-white rounded-full text-lg font-medium hover:bg-rose-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                Start Selling Today
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Support */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            We're Here to Support Your Creative Journey
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Have questions? We're here to help every step of the way
          </p>
          <button className="px-8 py-4 bg-gray-900 text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl">
            Contact Support
          </button>
        </div>
      </section>
    </main>
  );
}
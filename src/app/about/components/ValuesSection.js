import Image from 'next/image';

export default function ValuesSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            The principles that guide everything we do at KnitKart
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Value 1 */}
          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-600 rounded-full mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Artisan First</h3>
            <p className="text-gray-600">
              We prioritize the well-being, fair compensation, and growth of our artisan community. Their success is our success.
            </p>
          </div>
          
          {/* Value 2 */}
          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-600 rounded-full mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality & Authenticity</h3>
            <p className="text-gray-600">
              We are committed to maintaining the highest standards of craftsmanship, authenticity, and quality in every product.
            </p>
          </div>
          
          {/* Value 3 */}
          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-600 rounded-full mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainability</h3>
            <p className="text-gray-600">
              We embrace environmentally responsible practices, from sourcing materials to packaging and shipping our products.
            </p>
          </div>
          
          {/* Value 4 */}
          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-600 rounded-full mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
            <p className="text-gray-600">
              We leverage technology to enhance traditional craftsmanship, creating a harmonious blend of heritage and innovation.
            </p>
          </div>
        </div>
        
        {/* Detail section */}
        <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">How Our Values Shape KnitKart</h3>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-4 h-4 bg-rose-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Fair Trade Practices</h4>
                  <p className="text-gray-600">
                    Every artisan on our platform receives fair compensation for their work, typically 2-3 times what they would earn in local markets. We maintain transparent pricing policies and ensure prompt payments.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-4 h-4 bg-rose-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Skill Development</h4>
                  <p className="text-gray-600">
                    We provide ongoing training and resources to help artisans enhance their skills, learn new techniques, and adapt to market trends while preserving traditional methods.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-4 h-4 bg-rose-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Eco-Friendly Materials</h4>
                  <p className="text-gray-600">
                    We encourage and support the use of sustainable, natural fibers and eco-friendly materials, minimizing environmental impact while creating products that last.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-4 h-4 bg-rose-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">AI-Enhanced Design</h4>
                  <p className="text-gray-600">
                    Our proprietary AI tools help artisans create innovative designs, predict trends, and streamline production while maintaining the unique human touch that makes each piece special.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
              <Image 
                src="/images/values-image.jpg" 
                alt="KnitKart values in action" 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* <div className="absolute -bottom-8 -left-8 w-64 h-32 bg-rose-50 rounded-lg p-6 shadow-md hidden md:block">
              <p className="text-gray-700 italic text-sm">
                "KnitKart's commitment to fair trade and artisan welfare isn't just talk—it's built into every aspect of how they operate."
              </p>
              <p className="text-gray-900 font-semibold text-sm mt-2">— Craft Council of India</p>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

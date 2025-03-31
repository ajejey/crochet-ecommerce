import Image from 'next/image';

export default function StorySection() {
  return (
    <section className="py-16 md:py-24 bg-rose-50 relative">
      <div className="absolute inset-0 opacity-5 pattern-diagonal-lines pattern-rose-600 pattern-bg-transparent pattern-size-4"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            From a small idea to India's first AI-powered crochet marketplace
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 items-center">
          {/* Timeline */}
          <div className="space-y-12">
            {/* Timeline item 1 */}
            <div className="relative pl-10 border-l-2 border-rose-200 py-2">
              <div className="absolute top-0 left-0 w-6 h-6 bg-rose-600 rounded-full -ml-3 mt-2"></div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">The Beginning</h3>
                <p className="text-lg text-gray-700">
                  KnitKart began with a simple observation: countless talented crochet artisans across India lacked access to markets that appreciated their craftsmanship and would pay them fairly. We witnessed firsthand how these skilled artisans struggled to find customers beyond local markets.
                </p>
              </div>
            </div>
            
            {/* Timeline item 2 */}
            <div className="relative pl-10 border-l-2 border-rose-200 py-2">
              <div className="absolute top-0 left-0 w-6 h-6 bg-rose-600 rounded-full -ml-3 mt-2"></div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Building the Foundation</h3>
                <p className="text-lg text-gray-700">
                  After extensive research and consultation with artisans, and designers, we developed the concept for KnitKart – a dedicated platform that would bridge the gap between talented creators and appreciative consumers while leveraging technology to enhance the creative process.
                </p>
              </div>
            </div>
            
            {/* Timeline item 3 */}
            <div className="relative pl-10 border-l-2 border-rose-200 py-2">
              <div className="absolute top-0 left-0 w-6 h-6 bg-rose-600 rounded-full -ml-3 mt-2"></div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Expertise & Vision</h3>
                <p className="text-lg text-gray-700">
                  Our co-founder brings over 30 years of experience in knitting and crocheting to KnitKart. This deep expertise has shaped our understanding of both the craft's traditions and the challenges artisans face in the modern marketplace. Her passion for these traditional crafts forms the backbone of KnitKart's mission.
                </p>
              </div>
            </div>
            
            {/* Timeline item 4 */}
            <div className="relative pl-10 py-2">
              <div className="absolute top-0 left-0 w-6 h-6 bg-rose-600 rounded-full -ml-3 mt-2"></div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">KnitKart Today</h3>
                <p className="text-lg text-gray-700">
                  As we launch KnitKart, we're focused on creating India's first AI-powered platform for handcrafted crochet products. Our mission is to empower talented artisans across the country to build sustainable businesses of their own. By combining traditional craftsmanship with innovative technology, we're creating new opportunities for artisans and unique products for customers.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right column with images */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="relative h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden shadow-md">
                <Image 
                  src="/images/story-1.jpg" 
                  alt="KnitKart beginnings" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden shadow-md">
                <Image 
                  src="/images/story-2.jpg" 
                  alt="KnitKart community" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            <div className="space-y-6 mt-12">
              <div className="relative h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden shadow-md">
                <Image 
                  src="/images/story-3.jpg" 
                  alt="KnitKart growth" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden shadow-md">
                <Image 
                  src="/images/story-4.jpg" 
                  alt="KnitKart today" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

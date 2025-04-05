
export default function MissionVision() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pattern-diagonal-lines pattern-rose-600 pattern-bg-transparent pattern-size-4"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Our Purpose</h2>
          <div className="w-24 h-1 bg-rose-600 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Mission Column */}
          <div className="bg-rose-50 rounded-2xl p-8 lg:p-10 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-14 w-14 bg-rose-600 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0">
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-serif text-3xl text-gray-900 mb-6 text-center md:text-left">Our Mission</h3>
            <p className="text-lg text-gray-700 mb-4">
              To empower Indian crochet artisans by providing them a digital platform that celebrates their 
              craftsmanship, ensures fair compensation, and connects them directly with appreciative customers worldwide.
            </p>
            <p className="text-lg text-gray-700 mb-6">
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
          
          {/* Vision Column */}
          <div className="bg-gray-50 rounded-2xl p-8 lg:p-10 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-14 w-14 bg-gray-500 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0">
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="font-serif text-3xl text-gray-900 mb-6 text-center md:text-left">Our Vision</h3>
            <p className="text-lg text-gray-700 mb-4">
              To be India's leading platform for handcrafted crochet products, where technology 
              and tradition come together to create a thriving ecosystem for artisans and consumers alike.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              We envision a future where crochet artistry is widely recognized and valued, 
              where skilled craftspeople can earn dignified livelihoods, and where consumers 
              can easily access unique, sustainable, and meaningful products.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Create the largest digital marketplace for handcrafted crochet products in India</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Leverage AI to enhance the discovery and creation of crochet designs</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Build a community that values handcrafted quality over mass production</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Establish a globally recognized brand for Indian crochet craftsmanship</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

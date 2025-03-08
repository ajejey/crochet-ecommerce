import Image from 'next/image';
import Link from 'next/link';
import MissionVision from './components/MissionVision';
import TeamSection from './components/TeamSection';
import StorySection from './components/StorySection';
import ValuesSection from './components/ValuesSection';
import TestimonialsSection from './components/TestimonialsSection';
import CallToAction from './components/CallToAction';

export const metadata = {
  title: 'About Us | KnitKart',
  description: 'Learn about KnitKart - India\'s first AI-powered platform for handcrafted crochet products. Discover our story, mission, and the artisans behind our beautiful creations.',
};

export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-rose-50">
        <div className="absolute inset-0 opacity-5 pattern-diagonal-lines pattern-rose-600 pattern-bg-transparent pattern-size-4"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h1 className="font-serif text-5xl lg:text-7xl text-gray-900 mb-6">Crafting Stories, Connecting Hearts</h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8">
                At KnitKart, we believe in the beauty of handmade creations. Each stitch tells a story, 
                each piece carries the warmth of human touch, and every creation represents hours of dedication 
                and artistry.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop" className="px-8 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-300">
                  Explore Our Collection
                </Link>
                <Link href="/become-seller" className="px-8 py-3 border border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors duration-300">
                  Join As Artisan
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/images/about-hero.jpg" 
                  alt="Artisan creating crochet products"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Mission & Vision Section */}
      <MissionVision />
      
      {/* Our Story Section */}
      <StorySection />
      
      {/* Our Values Section */}
      <ValuesSection />
      
      {/* Team Section */}
      <TeamSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Call To Action Section */}
      <CallToAction />
      
      {/* Stats Section */}
      {/* <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Through our platform, we're creating meaningful impact for artisans and sustainable products for conscious consumers.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-4xl md:text-5xl font-bold text-rose-600 mb-2">500+</p>
              <p className="text-gray-700">Artisans Supported</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-4xl md:text-5xl font-bold text-rose-600 mb-2">15k+</p>
              <p className="text-gray-700">Products Sold</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-4xl md:text-5xl font-bold text-rose-600 mb-2">200+</p>
              <p className="text-gray-700">Designs Created</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-4xl md:text-5xl font-bold text-rose-600 mb-2">25+</p>
              <p className="text-gray-700">States Reached</p>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  );
}

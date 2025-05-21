import Link from 'next/link';
import Image from 'next/image';
import HeaderSection from './(header)/HeaderSection';
import { ArrowRight, Star } from 'lucide-react';
import Footer from './components/Footer';

const HomePage = () => {
  const categories = [
    // { 
    //   name: 'All Products', 
    //   image: '/images/crochet-products.jpg',
    //   href: '/shop'
    // },
    { 
      name: 'Baby Items', 
      image: '/images/babycrochet.jpg',
      href: '/shop?category=baby'
    },
    { 
      name: 'Accessories', 
      image: '/images/crochet-accessories.jpg',
      href: '/shop?category=accessories'
    },
    { 
      name: 'Home Decor', 
      image: '/images/crochet-home-decor.jpg',
      href: '/shop?category=home'
    },
    { 
      name: 'Amigurumi', 
      image: '/images/crochet-amigurumi.jpg',
      href: '/shop?category=amigurumi'
    },
    
  ];

  const trustFeatures = [
    {
      icon: Star,
      title: 'Handcrafted Quality',
      description: 'Each item is carefully made with love and attention to detail'
    },
    {
      icon: Star,
      title: 'Secure Payments',
      description: 'Shop with confidence using our secure payment system'
    },
    {
      icon: Star,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to your doorstep'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HeaderSection />
      
      {/* Hero Section */}
      <section className="relative py-10 sm:py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 font-serif">
                Handcrafted with Love
                <span className="block text-rose-600">Just for You</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl font-light">
                Discover unique, handmade crochet creations that bring warmth and character to your home
              </p>
              <div className="flex flex-wrap gap-4">
                <Link className="px-6 py-3 sm:px-8 sm:py-4 bg-rose-600 text-white rounded-full text-lg font-medium hover:bg-rose-700 transition-colors duration-200 shadow-lg hover:shadow-xl" href="/shop" prefetch={true}>
                  <button>
                    Shop Now
                  </button>
                </Link>
                <Link className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-rose-600 border-2 border-rose-600 rounded-full text-lg font-medium hover:bg-rose-50 transition-colors duration-200" href="/become-seller" prefetch={true}>
                  <button>
                    Become a Seller
                  </button>
                </Link>
              </div>
            </div>
            {/* Right Column - Featured Image */}
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={"/images/crochet-yarn.png"}
                alt="Handcrafted Crochet Items"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link href={category.href} key={index}>
                <div className="group relative h-64 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                    <p className="text-rose-200 group-hover:text-rose-300 flex items-center mt-2">
                      Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-600 mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
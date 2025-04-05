export default function StorySection() {
  const timelineItems = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'KnitKart began with a simple observation: countless talented crochet artisans across India lacked access to markets that appreciated their craftsmanship and would pay them fairly. We witnessed firsthand how these skilled artisans struggled to find customers beyond local markets.'
    },
    {
      year: '2021',
      title: 'Building the Foundation',
      description: 'After extensive research and consultation with artisans and designers, we developed the concept for KnitKart – a dedicated platform that would bridge the gap between talented creators and appreciative consumers while leveraging technology to enhance the creative process.'
    },
    {
      year: '2022',
      title: 'Expertise & Vision',
      description: 'Our co-founder brings over 30 years of experience in knitting and crocheting to KnitKart. This deep expertise has shaped our understanding of both the craft\'s traditions and the challenges artisans face in the modern marketplace. Her passion for these traditional crafts forms the backbone of KnitKart\'s mission.'
    },
    {
      year: '2023',
      title: 'KnitKart Today',
      description: 'As we launch KnitKart, we\'re focused on creating India\'s first AI-powered platform for handcrafted crochet products. Our mission is to empower talented artisans across the country to build sustainable businesses of their own. By combining traditional craftsmanship with innovative technology, we\'re creating new opportunities for artisans and unique products for customers.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('/pattern-bg.svg')]"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Our Story</h2>
          <div className="w-24 h-1 bg-rose-600 mx-auto mb-6"></div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            From a small idea to India's first AI-powered crochet marketplace
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline vertical line - visible on all devices */}
          <div className="absolute left-8 sm:left-12 top-0 bottom-0 w-0.5 bg-rose-200"></div>
          
          <div className="space-y-12 relative">
            {timelineItems.map((item, index) => (
              <div key={index} className="ml-8 sm:ml-12 pl-12 relative">
                {/* Year marker circle with dot */}
                <div className="absolute left-0 top-0 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white font-bold text-xs z-10 shadow-md">
                    {item.year}
                  </div>
                  <div className="absolute top-4 h-full w-0.5 bg-rose-200"></div>
                </div>
                
                {/* Content card */}
                <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-serif text-2xl sm:text-3xl text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 max-w-3xl mx-auto italic font-serif">
            "Our journey continues as we grow, innovate, and create a more inclusive marketplace for traditional crafts in the digital age."
          </p>
        </div>
      </div>
    </section>
  );
}

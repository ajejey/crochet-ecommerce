export default function CreatorsHeader() {
  return (
    <div className="relative py-4 px-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[200%] h-48 bg-gradient-to-b from-rose-50/50 to-transparent"></div>
        <div className="absolute -left-4 top-12 w-24 h-24 bg-rose-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -right-4 top-20 w-32 h-32 bg-rose-200 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      {/* Content */}
      <div className="relative text-center space-y-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 font-serif">
          Discover Our{' '}
          <span className="relative">
            <span className="relative z-10">Talented</span>
            <div className="absolute -bottom-2 left-0 w-full h-3 bg-rose-100/50 -rotate-1"></div>
          </span>{' '}
          Creators
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Meet the artisans behind our unique crochet creations. Each creator brings their own style 
          and expertise to craft beautiful, handmade pieces that tell a story.
        </p>
      </div>
    </div>
  );
}

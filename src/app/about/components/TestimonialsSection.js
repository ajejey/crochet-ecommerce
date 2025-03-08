'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      quote: "KnitKart has transformed my life as a crochet artist. Before joining, I struggled to find customers who valued handmade items. Now, I have a steady stream of orders and earn three times what I used to make.",
      author: "Sunita Devi",
      location: "Artisan from Rajasthan",
      image: "/images/testimonial-1.jpg"
    },
    {
      id: 2,
      quote: "The quality of crochet products from KnitKart is exceptional. I ordered a custom blanket for my newborn, and the attention to detail was remarkable. It's become a family heirloom that we'll cherish forever.",
      author: "Aisha Patel",
      location: "Customer from Mumbai",
      image: "/images/testimonial-2.jpg"
    },
    {
      id: 3,
      quote: "As someone who values sustainable and ethically made products, KnitKart aligns perfectly with my values. I love knowing exactly who made my items and that they were fairly compensated for their amazing skills.",
      author: "Rohan Malhotra",
      location: "Customer from Bangalore",
      image: "/images/testimonial-3.jpg"
    },
    {
      id: 4,
      quote: "The KnitKart platform has helped me showcase my traditional crochet techniques to a global audience. The technology they provide makes it simple to manage orders and connect with customers who appreciate our craft.",
      author: "Lakshmi Rao",
      location: "Artisan from Tamil Nadu",
      image: "/images/testimonial-4.jpg"
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-16 md:py-24 bg-rose-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pattern-diagonal-lines pattern-rose-600 pattern-bg-transparent pattern-size-4"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">What People Say</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our community of artisans and customers
          </p>
        </div>
        
        <div className="relative">
          {/* Large quote marks */}
          <div className="absolute -top-10 left-0 md:left-10 text-rose-200 opacity-50">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          
          {/* Testimonial Slides */}
          <div className="overflow-hidden">
            <div 
              className="transition-transform duration-500 ease-in-out flex"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12">
                    <div className="md:flex items-center">
                      <div className="md:w-1/3 mb-6 md:mb-0 md:pr-8">
                        <div className="relative h-64 w-full rounded-xl overflow-hidden">
                          <Image 
                            src={testimonial.image}
                            alt={testimonial.author}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <p className="text-gray-700 text-lg md:text-xl mb-6 italic">
                          "{testimonial.quote}"
                        </p>
                        <div>
                          <h4 className="text-gray-900 font-semibold text-lg">{testimonial.author}</h4>
                          <p className="text-rose-600">{testimonial.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots navigation */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeIndex === index ? 'bg-rose-600' : 'bg-gray-300 hover:bg-rose-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation arrows for larger screens */}
          <div className="hidden md:block">
            <button 
              onClick={() => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)}
              className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-rose-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => setActiveIndex((current) => (current + 1) % testimonials.length)}
              className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-rose-50 transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Stats */}
        {/* <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-rose-600 mb-2">500+</p>
            <p className="text-gray-600">Artisans Empowered</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-rose-600 mb-2">25,000+</p>
            <p className="text-gray-600">Handcrafted Products</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-rose-600 mb-2">20</p>
            <p className="text-gray-600">Indian States Represented</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-rose-600 mb-2">98%</p>
            <p className="text-gray-600">Customer Satisfaction</p>
          </div>
        </div> */}
      </div>
    </section>
  );
}

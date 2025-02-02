'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';

const sampleProducts = [
  {
    id: 1,
    title: 'Handmade Baby Blanket',
    seller: 'CrochetMaster',
    rating: 4.9,
    reviews: 128,
    price: 2499,
    image: '/images/samples/baby-blanket.jpg',
    tips: [
      'High-quality product images from multiple angles',
      'Detailed description of materials and size',
      'Clear pricing with bulk order options',
      'Quick response to customer inquiries'
    ]
  },
  {
    id: 2,
    title: 'Crochet Market Bag',
    seller: 'EcoKnits',
    rating: 4.8,
    reviews: 95,
    price: 899,
    image: '/images/samples/market-bag.jpg',
    tips: [
      'Eco-friendly materials highlighted',
      'Shows product in use',
      'Multiple color options',
      'Clear care instructions'
    ]
  },
  {
    id: 3,
    title: 'Winter Scarf Set',
    seller: 'WoolCrafts',
    rating: 5.0,
    reviews: 67,
    price: 1299,
    image: '/images/samples/scarf-set.jpg',
    tips: [
      'Seasonal product timing',
      'Bundle pricing strategy',
      'Size chart included',
      'Gift packaging option'
    ]
  }
];

export default function SampleProducts() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-serif text-gray-900 mb-4">Success Stories</h2>
      <div className="space-y-6">
        {sampleProducts.map((product) => (
          <div key={product.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
            <div className="flex gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{product.title}</h3>
                <p className="text-sm text-gray-600">by {product.seller}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>
                <p className="text-rose-600 font-medium mt-1">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Success Tips:</h4>
              <ul className="space-y-1">
                {product.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-rose-600">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

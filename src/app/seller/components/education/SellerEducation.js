'use client';

import { Camera, DollarSign, HeartHandshake, Package2, Lightbulb } from 'lucide-react';
import Link from 'next/link';

const educationalContent = [
  {
    id: 'photography',
    icon: Camera,
    title: 'Product Photography',
    description: 'Learn how to showcase your crochet items beautifully',
    tips: [
      'Use natural lighting for best results',
      'Show multiple angles of each item',
      'Include size reference in photos',
      'Capture texture details clearly',
      'Maintain consistent background'
    ]
  },
  {
    id: 'pricing',
    icon: DollarSign,
    title: 'Pricing Strategies',
    description: 'Price your items competitively and profitably',
    tips: [
      'Calculate material costs accurately',
      'Factor in your time and effort',
      'Research competitor pricing',
      'Consider seasonal pricing',
      'Offer bundle discounts'
    ]
  },
  {
    id: 'customer-service',
    icon: HeartHandshake,
    title: 'Customer Service',
    description: 'Provide exceptional service to build loyalty',
    tips: [
      'Respond to inquiries promptly',
      'Be clear about processing times',
      'Handle issues professionally',
      'Follow up after delivery',
      'Ask for reviews politely'
    ]
  },
  {
    id: 'shipping',
    icon: Package2,
    title: 'Shipping & Handling',
    description: 'Pack and ship your items securely',
    tips: [
      'Use appropriate packaging materials',
      'Protect delicate items carefully',
      'Include care instructions',
      'Offer tracking information',
      'Consider insurance for valuable items'
    ]
  },
  {
    id: 'crochet-tips',
    icon: Lightbulb,
    title: 'Crochet Success Tips',
    description: 'Platform-specific tips for crochet sellers',
    tips: [
      'Write detailed pattern information',
      'Specify yarn types clearly',
      'Include skill level requirements',
      'Offer customization options',
      'Share care and washing instructions'
    ]
  }
];

export default function SellerEducation() {
  return (
    <div className="space-y-8">
      {educationalContent.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-50 rounded-lg">
                <Icon className="w-6 h-6 text-rose-600" />
              </div>
              <h2 className="text-xl font-serif text-gray-900">{section.title}</h2>
            </div>
            <p className="text-gray-600 mb-4">{section.description}</p>
            <ul className="space-y-2">
              {section.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-rose-600 font-medium">•</span>
                  <span className="text-gray-600">{tip}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                href={`/seller/resources/${section.id}`}
                className="text-rose-600 hover:text-rose-700 font-medium text-sm inline-flex items-center gap-1"
              >
                Learn more
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

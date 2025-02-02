'use client';

import { CheckCircle2, Circle } from 'lucide-react';

const requirements = [
  { 
    id: 1, 
    title: 'Complete Profile',
    items: [
      'Profile picture uploaded',
      'Shop name and description',
      'Contact information verified',
      'Shipping address added'
    ]
  },
  {
    id: 2,
    title: 'Documentation',
    items: [
      'Valid ID proof',
      'Business registration (if applicable)',
      'Bank account details',
      'GST registration (if applicable)'
    ]
  },
  {
    id: 3,
    title: 'Shop Setup',
    items: [
      'Shop policies defined',
      'Return policy created',
      'Shipping rates configured',
      'Payment methods selected'
    ]
  }
];

export default function RequirementsChecklist({ completedItems = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-serif text-gray-900 mb-4">Requirements Checklist</h2>
      <div className="space-y-6">
        {requirements.map((section) => (
          <div key={section.id}>
            <h3 className="font-medium text-gray-900 mb-3">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item, index) => {
                const isCompleted = completedItems.includes(`${section.id}-${index}`);
                return (
                  <li key={index} className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                    <span className={isCompleted ? 'text-green-700' : 'text-gray-600'}>
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

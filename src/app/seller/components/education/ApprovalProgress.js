'use client';

import { CheckCircle2, Circle, Clock } from 'lucide-react';

const steps = [
  { id: 1, name: 'Profile Submission', description: 'Basic information and contact details' },
  { id: 2, name: 'Document Verification', description: 'Identity and business documents' },
  { id: 3, name: 'Review Process', description: 'Manual review by our team' },
  { id: 4, name: 'Account Activation', description: 'Final approval and account setup' },
];

export default function ApprovalProgress({ currentStep = 1 }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-serif text-gray-900 mb-4">Approval Progress</h2>
      <div className="space-y-4">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          
          return (
            <div key={step.id} className="flex items-start gap-3">
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-green-500 mt-0.5" />
              ) : isCurrent ? (
                <Clock className="w-6 h-6 text-rose-600 mt-0.5" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300 mt-0.5" />
              )}
              <div>
                <h3 className={`font-medium ${isCurrent ? 'text-rose-600' : isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                  {step.name}
                </h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createAdminClient } from '@/appwrite/config';
import { ID } from 'node-appwrite';
import AccountStep from './components/AccountStep';
import ShopDetailsStep from './components/ShopDetailsStep';
import VerificationStep from './components/VerificationStep';
import { registerSeller } from './actions';
import { createAccount } from '../signup/actions';

export default function SellerRegistrationForm({ currentUser }) {
  // Initialize to step 1 (Account) by default, but start at step 2 (Shop Details) if user is already logged in
  const [step, setStep] = useState(currentUser ? 2 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});
  const router = useRouter();

  // If the user is already logged in, pre-fill their data
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
    }
  }, [currentUser]);

  const steps = [
    { number: 1, name: 'Account' },
    { number: 2, name: 'Shop Details' },
    { number: 3, name: 'Verification' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const currentFormData = new FormData(e.target);
      const currentStepData = Object.fromEntries(currentFormData);

      // Merge the current step's data with existing form data
      const updatedFormData = { ...formData, ...currentStepData };
      setFormData(updatedFormData);

      // If on account step and user is not logged in, handle signup/login
      if (step === 1 && !currentUser) {
        const { account } = createAdminClient();
        const email = currentStepData.email;
        const password = currentStepData.password;
        const name = currentStepData.name;

        try {
          if (currentStepData.isLogin === 'true') {
            // Handle login
            const session = await account.createEmailPasswordSession(email, password);
            // Store session in cookie using server action
            const response = await fetch('/api/auth/session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ session }),
            });
            if (!response.ok) {
              throw new Error('Failed to store session');
            }
          } else {
            // Handle signup using server action
            const result = await createAccount(currentFormData);
            if (result.error) {
              throw new Error(result.error);
            }
          }
          setStep(2);
        } catch (error) {
          console.error('Account error:', error);
          setError(error.message || 'Authentication failed. Please try again.');
          return;
        }
      }
      // If on final step, handle seller registration
      else if (step === 3) {
        // Create a new FormData with all accumulated data
        const finalFormData = new FormData();
        Object.entries(updatedFormData).forEach(([key, value]) => {
          finalFormData.append(key, value);
        });
        
        const result = await registerSeller(finalFormData);
        if (result.error) {
          setError(result.error);
          return;
        }
        router.push('/seller');
      }
      // Otherwise, just move to next step
      else {
        setStep(step + 1);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      // If user is logged in and at step 2, redirect to home instead of going to account step
      if (currentUser && step === 2) {
        router.push('/');
        return;
      }
      setStep(step - 1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          {steps.map((s, i) => (
            <div key={s.number} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div className="w-full flex items-center">
                  <div className={`flex-1 ${i === 0 ? 'hidden' : ''} h-0.5 bg-gray-200`}></div>
                  <div
                    className={`relative w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                      step >= s.number
                        ? 'bg-rose-600 border-rose-600 text-white'
                        : 'border-gray-300 bg-white text-gray-500'
                    }`}
                  >
                    {s.number}
                  </div>
                  <div className={`flex-1 ${i === steps.length - 1 ? 'hidden' : ''} h-0.5 bg-gray-200`}></div>
                </div>
                <span className="mt-2 text-xs font-medium text-gray-700">
                  {s.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Step Components */}
      {step === 1 && !currentUser && (
        <AccountStep isSubmitting={isSubmitting} error={error} />
      )}

      {step === 2 && (
        <ShopDetailsStep 
          onBack={handleBack} 
          initialData={formData}
        />
      )}

      {step === 3 && (
        <VerificationStep 
          onBack={handleBack} 
          isSubmitting={isSubmitting} 
          initialData={formData}
        />
      )}
    </form>
  );
}
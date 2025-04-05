'use client';

import { useState } from 'react';
import { ArrowRight, AtSign } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function ForgotPasswordFormClient({ requestPasswordRecovery }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  async function onSubmit(data) {
    setIsSubmitting(true);
    setError('');
    
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Pass the FormData object to the server action
      const result = await requestPasswordRecovery(formData);
      
      if (result.success) {
        // Redirect on success
        router.push('/forgot-password/confirmation');
      } else {
        setIsSubmitting(false);
        setError(result.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Something went wrong. Please try again.');
      console.error(err);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern-bg.svg')] opacity-5"></div>
        <div className="relative px-6 sm:px-8 py-8 sm:py-10">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-6 text-center">Reset Password</h1>
          <p className="text-gray-600 text-center mb-6">Enter your email address and we'll send you a link to reset your password.</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative group">
                <input
                  className={`block w-full rounded-lg border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} py-3 pl-11 pr-4 text-gray-600 text-lg sm:text-xl transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 group-focus-within:text-rose-600 transition-colors duration-200" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full rounded-lg bg-rose-600 hover:bg-rose-700 py-3 px-6 text-lg sm:text-xl text-white font-medium shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-70 mt-6"
            >
              <span className="flex items-center justify-center">
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200 ease-in-out" />
              </span>
            </button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md mt-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Remember your password?{' '}
                <Link href="/login" className="text-rose-600 hover:text-rose-700 font-medium transition-colors duration-200">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

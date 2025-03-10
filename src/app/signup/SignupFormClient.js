'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, AtSign, KeyRoundIcon, User } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SignupFormClient({ createAccount, redirectTo }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  async function onSubmit(data) {
    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);

    try {
      // Get cart items from localStorage before signup
      let localCartItems = [];
      if (typeof window !== 'undefined') {
        try {
          const storedCart = localStorage.getItem('cartItems');
          if (storedCart) {
            localCartItems = JSON.parse(storedCart);
            
            // Validate stock for each item before signup
            const invalidItems = localCartItems.filter(item => {
              const stockCount = item.product?.inventory?.stockCount || 0;
              return item.quantity > stockCount;
            });

            if (invalidItems.length > 0) {
              toast.warning('Some items in your cart are no longer available in the requested quantity. They will be adjusted during signup.');
            }
          }
        } catch (e) {
          console.error('Error reading cart from localStorage:', e);
        }
      }

      const result = await createAccount(formData);
      
      if (result?.error) {
        setError(result.error);
        toast.error('Failed to create account', {
          description: result.error
        });
      } else {
        // On successful signup, clear localStorage cart since items are now in the database
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('cartItems');
            toast.success('Account created successfully', {
              description: 'Your cart items have been saved to your account.'
            });
          } catch (e) {
            console.error('Error clearing localStorage cart:', e);
          }
        }
      }
    } catch (err) {
      const errorMessage = 'Something went wrong. Please try again.';
      setError(errorMessage);
      toast.error('Error', {
        description: errorMessage
      });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern-bg.svg')] opacity-5"></div>
        <div className="relative px-6 sm:px-8 py-8 sm:py-10">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-6 text-center leading-10">Sign up with Knitkart</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    className={`block w-full rounded-lg border ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} py-3 pl-11 pr-4 text-gray-600 text-lg sm:text-xl transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    {...register("name", { required: "Full name is required" })}
                  />
                  <User className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 group-focus-within:text-rose-600 transition-colors duration-200" />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              
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

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative group">
                  <input
                    className={`block w-full rounded-lg border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} py-3 pl-11 pr-4 text-gray-600 text-lg sm:text-xl transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    {...register("password", { 
                      required: "Password is required", 
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                  />
                  <KeyRoundIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 group-focus-within:text-rose-600 transition-colors duration-200" />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full rounded-lg bg-rose-600 hover:bg-rose-700 py-3 px-6 text-lg sm:text-xl text-white font-medium shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-70 mt-6"
            >
              <span className="flex items-center justify-center">
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
                Already have an account?{' '}
                <Link href={`/login?from=${redirectTo}`} className="text-rose-600 hover:text-rose-700 font-medium transition-colors duration-200">
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

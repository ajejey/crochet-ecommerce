'use client';

import { useState } from 'react';
import { ArrowRight, KeyRoundIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function ResetPasswordFormClient({ resetPassword }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  const password = watch('password', '');

  async function onSubmit(data) {
    setIsSubmitting(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('password', data.password);
      
      // Pass the FormData object to the server action
      const result = await resetPassword(formData);
      
      if (result.success) {
        // Redirect on success
        router.push('/reset-password/success');
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
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-6 text-center">Create New Password</h1>
          <p className="text-gray-600 text-center mb-6">Enter your new password below.</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="password"
              >
                New Password
              </label>
              <div className="relative group">
                <input
                  className={`block w-full rounded-lg border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} py-3 pl-11 pr-12 text-gray-600 text-lg sm:text-xl transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter new password"
                  {...register("password", { 
                    required: "Password is required", 
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                    }
                  })}
                />
                <KeyRoundIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 group-focus-within:text-rose-600 transition-colors duration-200" />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeOffIcon className="h-5 w-5" /> : 
                    <EyeIcon className="h-5 w-5" />
                  }
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  className={`block w-full rounded-lg border ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} py-3 pl-11 pr-12 text-gray-600 text-lg sm:text-xl transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  {...register("confirmPassword", { 
                    required: "Please confirm your password",
                    validate: value => value === password || "Passwords do not match"
                  })}
                />
                <KeyRoundIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 group-focus-within:text-rose-600 transition-colors duration-200" />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 
                    <EyeOffIcon className="h-5 w-5" /> : 
                    <EyeIcon className="h-5 w-5" />
                  }
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full rounded-lg bg-rose-600 hover:bg-rose-700 py-3 px-6 text-lg sm:text-xl text-white font-medium shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-70 mt-6"
            >
              <span className="flex items-center justify-center">
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200 ease-in-out" />
              </span>
            </button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md mt-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

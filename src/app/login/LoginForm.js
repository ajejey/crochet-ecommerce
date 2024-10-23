'use client';


import { useActionState } from 'react';
// import { authenticate } from '@/app/lib/actions';
import { ArrowBigRight, AtSign, KeyRoundIcon, TriangleAlert } from 'lucide-react';
// import { authenticate } from '../lib/actions';
// import { signIn } from '../../../auth';
 
export default function LoginForm() {
//   const [errorMessage, formAction, isPending] = useActionState(
    // authenticate,
//     // undefined,
//   );

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // await authenticate();
    await signIn('credentials', {
      email: event.target.email.value,
      password: event.target.password.value,
      redirect: false
    })
  };
 
  return (
    <form className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={` mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyRoundIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <button
          className="relative flex w-full justify-center rounded-lg bg-gray-600 px-5 py-3 my-5 text-gray-50 transition-colors hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        //   aria-disabled={isPending}
        >
          Log in
          <ArrowBigRight
            className="ml-auto h-5 w-5 text-gray-50 transition-transform duration-200 ease-in-out group-hover:translate-x-1"
          />
        </button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* {errorMessage && (
            <>
              <TriangleAlert className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )} */}
        </div>
      </div>
    </form>
  );
}
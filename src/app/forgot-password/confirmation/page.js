import Link from "next/link";
import HeaderSection from "../../(header)/HeaderSection";
import { ArrowLeft } from "lucide-react";

export default function ConfirmationPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <HeaderSection />
      <div className="relative mx-auto flex w-full max-w-[500px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="w-full max-w-md mx-auto px-4 sm:px-0">
          <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/pattern-bg.svg')] opacity-5"></div>
            <div className="relative px-6 sm:px-8 py-8 sm:py-10">
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-6 text-center">Check Your Email</h1>

              <div className="text-center">
                <div className="bg-rose-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  You will receive an email from <span className="font-semibold">knottedwithlove0@gmail.com</span>. The link will expire in 1 hour.
                </p>
                <p className="text-sm text-gray-500 mb-8 font-medium">
                  <span className="text-rose-600">Important:</span> Please check your <span className="font-semibold text-rose-600">Spam folder</span> if you don't see the email in your inbox.
                </p>

                <Link href="/login" className="inline-flex items-center text-rose-600 hover:text-rose-700 font-medium transition-colors duration-200">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

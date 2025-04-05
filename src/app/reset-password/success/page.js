import Link from "next/link";
import HeaderSection from "../../(header)/HeaderSection";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <HeaderSection />
      <div className="relative mx-auto flex w-full max-w-[500px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="w-full max-w-md mx-auto px-4 sm:px-0">
          <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/pattern-bg.svg')] opacity-5"></div>
            <div className="relative px-6 sm:px-8 py-8 sm:py-10">
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-6 text-center">Password Reset Complete</h1>
              
              <div className="text-center">
                <div className="bg-green-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg text-gray-600 mb-8">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
                
                <Link 
                  href="/login" 
                  className="group relative inline-flex rounded-lg bg-rose-600 hover:bg-rose-700 py-3 px-6 text-lg text-white font-medium shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                  <span className="flex items-center justify-center">
                    Go to Login
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200 ease-in-out" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

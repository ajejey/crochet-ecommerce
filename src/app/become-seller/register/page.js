import { Container, Heading, Text } from '@/components/ui';
import SellerRegistrationForm from "../SellerRegistrationForm";

export default function SellerRegistrationPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your Seller Journey
          </h1>
          <p className="text-xl text-gray-600">
            We're excited to have you join our creative community
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <SellerRegistrationForm />
        </div>
      </div>
    </main>
  );
}

import SellerRegistrationForm from "./SellerRegistrationForm";

export default function BecomeSellerPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Become a Seller</h1>
          <p className="mt-4 text-lg text-gray-600">
            Join our marketplace and start selling your handcrafted items
          </p>
        </div>
        <SellerRegistrationForm />
      </div>
    </main>
  );
}
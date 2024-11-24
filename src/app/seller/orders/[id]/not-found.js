import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
      <p className="text-gray-600 mb-8">
        The order you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Link
        href="/seller/orders"
        className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>
    </div>
  );
}

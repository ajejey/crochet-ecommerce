import OrderStatusUpdate from "../../OrderStatusUpdate";
import { X } from "lucide-react";
import Link from "next/link";

export default function StatusModal({ params }) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50">
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
          {/* Close Button */}
          <Link 
            href={`/seller/orders/${params.id}`}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </Link>

          {/* Title */}
          <h2 className="text-xl font-semibold mb-6">Update Order Status</h2>

          <OrderStatusUpdate orderId={params.id} />
        </div>
      </div>
    </div>
  );
}

'use server';

import { Suspense } from "react";
import OrderSummary from "./OrderSummary";
import OrderItems from "./OrderItems";
import BuyerDetails from "./BuyerDetails";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import { getOrderBasicDetails } from "../actions";
import { notFound } from "next/navigation";

export default async function OrderDetailsPage({ params }) {
  // Verify order exists and belongs to seller
  const result = await getOrderBasicDetails(params.id);
  
  if (!result.success) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Link
          href="/seller/orders"
          className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <h1 className="text-2xl font-bold">Order #{params.id}</h1>
        <Link href={`/seller/orders/${params.id}/status`}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Update Status
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="space-y-8 p-6">
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg" />}>
          <OrderSummary orderId={params.id} />
        </Suspense>

        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-48 rounded-lg" />}>
          <OrderItems orderId={params.id} />
        </Suspense>

        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg" />}>
          <BuyerDetails orderId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}

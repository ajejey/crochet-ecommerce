'use client';

import { User, Phone, Mail, MapPin } from 'lucide-react';
import { getBuyerDetails } from '../actions';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';

export default function BuyerDetails({ orderId }) {
  const { data: result, error } = useSWR(
    ['buyer-details', orderId],
    () => getBuyerDetails(orderId)
  );

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Buyer Information</h2>
        <p className="text-red-500">Failed to load buyer details</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Buyer Information</h2>
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  const { buyer } = result;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Buyer Information</h2>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{buyer.name}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{buyer.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{buyer.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Shipping Address</p>
            <div className="font-medium">
              <p>{buyer.address.street}</p>
              <p>{buyer.address.city}, {buyer.address.state} {buyer.address.pincode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

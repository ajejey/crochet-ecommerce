'use client';

import { Clock } from 'lucide-react';
import useSWR from 'swr';
import { getOrderTimeline } from '../actions';
import { formatDate } from '@/utils/format';

const swrConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  keepPreviousData: true, // Show previous data while fetching
  dedupingInterval: 0 // Allow immediate refetching
};

const TimelineItem = ({ status, timestamp, isLast }) => {
  const colors = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500'
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${colors[status] || 'bg-gray-500'}`} />
        {!isLast && <div className="w-0.5 h-full bg-gray-200" />}
      </div>
      <div className={`pb-8 ${isLast ? '' : ''}`}>
        <p className="font-medium">
          Order {status.charAt(0).toUpperCase() + status.slice(1)}
        </p>
        <time className="text-sm text-gray-500">{formatDate(timestamp)}</time>
      </div>
    </div>
  );
};

export default function OrderTimeline({ orderId }) {
  // Fetch timeline with SWR
  const { data: result, error, isLoading, isValidating } = useSWR(
    ['timeline', orderId],
    async () => {
      const result = await getOrderTimeline(orderId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    swrConfig
  );

  // Show loading indicator only on first load
  if (isLoading && !result) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
        <div className="flex justify-center py-4">
          <Clock className="w-6 h-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
        <p className="text-red-500 text-center py-4">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow relative">
      {isValidating && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
          <Clock className="w-6 h-6 animate-spin" />
        </div>
      )}
      <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
      <div className="space-y-4">
        {result.timeline.map((entry, index) => (
          <TimelineItem
            key={entry.$id}
            status={entry.status}
            timestamp={entry.created_at}
            isLast={index === result.timeline.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

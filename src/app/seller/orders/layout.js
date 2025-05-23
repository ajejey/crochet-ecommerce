import React from 'react'
import { requireSeller } from '@/lib/auth-context';
import { SuspendedPostHogPageView } from '@/components/PostHogProvider';

export default async function OrdersLayout({ children }) {
  // Ensure only authenticated sellers can access this route
  await requireSeller();

  return (
    <div className="min-h-screen bg-gray-50">
      <SuspendedPostHogPageView />
      {children}
    </div>
  )
}
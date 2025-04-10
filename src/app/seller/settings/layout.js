import React from 'react'
import { requireSeller } from '@/lib/auth-context';
import { SuspendedPostHogPageView } from '@/components/PostHogProvider';

export default async function SettingsLayout({ children }) {
  // Get the authenticated seller data
  const user = await requireSeller();

  console.log("user in settings layout", user)

  return (
    <div className="min-h-screen bg-gray-50">
      <SuspendedPostHogPageView />
      {children}
    </div>
  )
}
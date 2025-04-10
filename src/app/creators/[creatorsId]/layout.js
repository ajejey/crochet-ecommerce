import { SuspendedPostHogPageView } from '@/components/PostHogProvider';
import React from 'react';

export default function CreatorLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <SuspendedPostHogPageView />

      {children}
    </div>
  );
}
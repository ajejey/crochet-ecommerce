// import { requireSeller } from '@/lib/auth';

import { SuspendedPostHogPageView } from "@/components/PostHogProvider";

export default async function ResourcesLayout({ children }) {
  // Get the authenticated seller data
  // const user = await requireSeller();

  return (
    <div className="min-h-screen bg-gray-50">
      <SuspendedPostHogPageView />
      {children}
    </div>
  );
}

export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation';
import { requireSeller } from '@/lib/auth-context';
import SellerNavigation from './components/SellerNavigation';
import { SuspendedPostHogPageView } from '@/components/PostHogProvider';

export default async function SellerLayout({ children }) {
  try {
    // This will throw an error if user is not an active seller
    const user = await requireSeller();

    return (
      <div className="min-h-screen bg-gray-50">
        <SuspendedPostHogPageView />
        <SellerNavigation user={user} />
        
        {/* Main Content */}
        <main className="lg:pl-64 min-h-screen">
          {/* Add top padding on mobile for header, and bottom padding for navigation */}
          <div className="p-4 pb-24 lg:p-8 lg:pb-8">
            {children}
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Seller layout error:', error);
    redirect('/login?from=/seller');
  }
}
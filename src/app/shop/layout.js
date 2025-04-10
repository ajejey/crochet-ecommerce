import { Suspense } from 'react';
import HeaderSection from "../(header)/HeaderSection";
import { SuspendedPostHogPageView } from '@/components/PostHogProvider';

export default function ShopLayout({ children }) {
  return (
    <>
      <SuspendedPostHogPageView />
      <HeaderSection />
      <Suspense>
        {children}
      </Suspense>
    </>
  );
}

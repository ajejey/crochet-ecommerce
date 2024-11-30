import { Suspense } from 'react';
import HeaderSection from "../(header)/HeaderSection";

export default function ShopLayout({ children }) {
  return (
    <>
      <HeaderSection />
        <Suspense>
          {children}
        </Suspense>
    </>
  );
}

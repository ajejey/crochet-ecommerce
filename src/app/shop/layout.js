'use client';

import HeaderSection from '../HeaderSection';

export default function ShopLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSection />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}

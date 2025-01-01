import React from 'react'
import HeaderSection from '../(header)/HeaderSection';

export default function CreatorsLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white">
      <HeaderSection />
      <div className="max-w-[2000px] mx-auto">
        {children}
      </div>
    </div>
  );
}
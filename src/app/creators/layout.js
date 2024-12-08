import React from 'react'

export default function CreatorsLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white">
      <div className="max-w-[2000px] mx-auto">
        {children}
      </div>
    </div>
  );
}
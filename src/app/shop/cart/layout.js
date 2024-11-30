import React, { Suspense } from 'react';

const Layout = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      }>
        {children}
      </Suspense>
    </div>
  );
};

export default Layout;
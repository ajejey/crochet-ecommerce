'use client';

import { Skeleton } from "@/app/components/Skeleton";

const LoadingProducts = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, index) => (
        <Skeleton key={index} className="h-[300px] w-full rounded-lg" />
      ))}
    </div>
  );
};

export default LoadingProducts;

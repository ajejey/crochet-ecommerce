'use client';

import { Skeleton } from "@/app/components/Skeleton";

const LoadingOrder = () => (
  <div className="space-y-6">
    <Skeleton className="h-12 w-1/2" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-6 w-1/2" />
  </div>
);

export default LoadingOrder;

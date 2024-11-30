import { Skeleton } from "@/app/components/Skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="sticky top-8">
          <Skeleton className="w-full h-96 rounded-lg" />
        </div>
        <div>
          <Skeleton className="w-3/4 h-8 mb-4" />
          <Skeleton className="w-1/2 h-6 mb-2" />
          <Skeleton className="w-full h-24 mb-4" />
          <Skeleton className="w-1/3 h-10" />
        </div>
      </div>
      <div className="mt-16">
        <Skeleton className="w-full h-64" />
      </div>
    </div>
  );
}

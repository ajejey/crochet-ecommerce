import { Skeleton } from "@/app/components/Skeleton";

export default function OrderDetailsLoading() {
  return (
    <div className="space-y-8 p-6">
      {/* Order Summary Loading */}
      <div className="rounded-lg border p-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* Order Items Loading */}
      <div className="rounded-lg border p-4">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-20 w-20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buyer Details Loading */}
      <div className="rounded-lg border p-4">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

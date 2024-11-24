export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6, 8].map((n) => (
        <div key={n} className="bg-gray-100 rounded-lg h-80"></div>
      ))}
    </div>
  );
}

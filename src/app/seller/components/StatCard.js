'use client';

export default function StatCard({ title, value, IconComponent, trend, loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {IconComponent && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <IconComponent className="w-6 h-6 text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}

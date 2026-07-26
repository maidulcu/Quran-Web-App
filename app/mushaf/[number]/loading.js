export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 p-6 sm:p-10 min-h-[60vh] animate-pulse">
          {/* Surah header skeleton */}
          <div className="text-center mb-8">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto mb-1" />
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-40 mx-auto" />
          </div>

          {/* Text skeleton */}
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex justify-end gap-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

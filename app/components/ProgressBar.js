'use client';

export default function ProgressBar({ percent, size = 'md', showLabel = true, className = '' }) {
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const height = heights[size] || heights.md;
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out ${
            clamped >= 100
              ? 'bg-green-500'
              : clamped > 0
                ? 'bg-teal-500'
                : ''
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 text-right tabular-nums flex-shrink-0">
          {clamped}%
        </span>
      )}
    </div>
  );
}

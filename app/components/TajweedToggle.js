'use client';

export default function TajweedToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`text-xs px-3 py-1 rounded-full transition-colors ${
        enabled
          ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-200 ring-1 ring-purple-300 dark:ring-purple-700'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
      aria-label={enabled ? 'Disable tajweed coloring' : 'Enable tajweed coloring'}
      title="Tajweed coloring"
    >
      {enabled ? 'Tajweed On' : 'Tajweed'}
    </button>
  );
}

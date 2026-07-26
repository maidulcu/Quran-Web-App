'use client';

export default function AyahMarker({ number, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center w-8 h-8 mx-1 rounded-full border-2 text-xs font-medium transition-all duration-200 align-middle relative -bottom-0.5 ${
        isActive
          ? 'border-teal-600 bg-teal-600 text-white scale-110'
          : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-teal-500 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-400'
      }`}
      aria-label={`Play ayah ${number}`}
    >
      {number}
    </button>
  );
}

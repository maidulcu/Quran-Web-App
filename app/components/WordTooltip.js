'use client';

export default function WordTooltip({ word, position }) {
  if (!word) return null;

  return (
    <div
      className="absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[180px] pointer-events-none"
      style={{ left: position?.x || '50%', top: position?.y || '100%', transform: 'translateX(-50%)' }}
    >
      <div lang="ar" dir="rtl" className="text-lg font-quran text-gray-900 dark:text-white mb-1 text-center">
        {word.text}
      </div>
      {word.transliteration && (
        <div className="text-xs text-gray-400 italic text-center mb-1">
          {word.transliteration}
        </div>
      )}
      <div className="text-sm font-medium text-teal-600 dark:text-teal-400 text-center">
        {word.translation}
      </div>
    </div>
  );
}

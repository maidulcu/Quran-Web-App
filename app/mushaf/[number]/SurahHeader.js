'use client';

export default function SurahHeader({ surah, fontClass, isFirst }) {
  return (
    <div className={`text-center ${isFirst ? 'mb-6' : 'my-8'}`}>
      {/* Top ornament */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-teal-300 dark:to-teal-600" />
        <div className="w-2 h-2 rotate-45 bg-teal-400 dark:bg-teal-500" />
        <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-teal-300 dark:to-teal-600" />
      </div>

      {/* Surah name in Arabic */}
      <div lang="ar" className={`text-teal-800 dark:text-teal-200 mb-1 ${fontClass} quran-header`}>
        {surah.name}
      </div>

      {/* English name + translation */}
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {surah.englishName}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {surah.englishNameTranslation} · {surah.numberOfAyahs} Ayahs
      </div>

      {/* Bottom ornament */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-teal-300 dark:to-teal-600" />
        <div className="w-2 h-2 rotate-45 bg-teal-400 dark:bg-teal-500" />
        <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-teal-300 dark:to-teal-600" />
      </div>
    </div>
  );
}

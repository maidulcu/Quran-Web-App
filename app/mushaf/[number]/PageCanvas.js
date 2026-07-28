'use client';
import { useMemo } from 'react';
import SurahHeader from './SurahHeader';
import AyahMarker from './AyahMarker';

const BISMILLAH = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';
const SKIP_BISMILLAH_SURAH = [9];

export default function PageCanvas({ pageData, fontClass, currentAyah, isPlaying, onPlayAyah }) {
  // Group ayahs by surah
  const groups = useMemo(() => {
    const result = [];
    let current = null;
    for (const ayah of pageData.ayahs) {
      if (!current || current.surah.number !== ayah.surah.number) {
        current = { surah: ayah.surah, ayahs: [] };
        result.push(current);
      }
      current.ayahs.push(ayah);
    }
    return result;
  }, [pageData.ayahs]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 p-6 sm:p-10 lg:p-14">
      {groups.map((group, gi) => (
        <div key={group.surah.number}>
          {/* Surah Header */}
          <SurahHeader surah={group.surah} fontClass={fontClass} isFirst={gi === 0} />

          {/* Bismillah */}
          {gi === 0 && !SKIP_BISMILLAH_SURAH.includes(group.surah.number) && group.surah.number !== 1 && (
            <div className="text-center mb-6">
              <p lang="ar" dir="rtl" className={`text-gray-800 dark:text-gray-100 ${fontClass} quran-text text-center`}>
                {BISMILLAH}
              </p>
            </div>
          )}

          {/* Continuous Arabic text */}
          <div lang="ar" dir="rtl" className={`text-right text-gray-800 dark:text-gray-100 ${fontClass} quran-text`} style={{ lineHeight: '2.3' }}>
            {group.ayahs.map((ayah, i) => {
              const isActive = currentAyah?.surahName === ayah.surah?.englishName && currentAyah?.number === ayah.numberInSurah;
              return (
                <span key={ayah.number} className="inline">
                  <span className="whitespace-normal">{ayah.text}</span>
                  <AyahMarker
                    number={ayah.numberInSurah}
                    isActive={isActive && isPlaying}
                    onClick={() => onPlayAyah(ayah)}
                  />
                  {i < group.ayahs.length - 1 && ' '}
                </span>
              );
            })}
          </div>
        </div>
      ))}

      {/* Page number */}
      <div className="mt-8 text-center">
        <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">{pageData.number}</span>
      </div>
    </div>
  );
}

'use client';
import { useMemo } from 'react';
import SurahHeader from './SurahHeader';
import AyahMarker from './AyahMarker';

const BISMILLAH = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';
const SKIP_BISMILLAH_SURAH = [9];

export default function PageCanvas({ pageData, fontClass, currentAyah, isPlaying, onPlayAyah, theme }) {
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

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-800';
  const pageBg = theme === 'cream' ? 'bg-[#FDFBF7]' : theme === 'sepia' ? 'bg-[#F4ECD8]' : theme === 'dark' ? 'bg-[#121212]' : 'bg-white';

  return (
    <div className={`${pageBg} rounded-2xl shadow-sm ornate-border p-6 sm:p-10 lg:p-14`}>
      {groups.map((group, gi) => (
        <div key={group.surah.number}>
          <SurahHeader surah={group.surah} fontClass={fontClass} isFirst={gi === 0} />

          {gi === 0 && !SKIP_BISMILLAH_SURAH.includes(group.surah.number) && group.surah.number !== 1 && (
            <div className="text-center mb-6">
              <p lang="ar" dir="rtl" className={`${textColor} ${fontClass} quran-text text-center`}>
                {BISMILLAH}
              </p>
            </div>
          )}

          <div lang="ar" dir="rtl" className={`text-right ${textColor} ${fontClass} quran-text`} style={{ lineHeight: '2.3' }}>
            {group.ayahs.map((ayah, i) => {
              const isActive = currentAyah?.surahName === ayah.surah?.englishName && currentAyah?.number === ayah.numberInSurah;
              return (
                <span key={ayah.number} className="inline">
                  <span className="whitespace-normal hover:text-primary transition-colors cursor-pointer">{ayah.text}</span>
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

      <div className="mt-8 text-center">
        <span className="text-sm text-gray-400 dark:text-gray-500 font-medium font-body">{pageData.number}</span>
      </div>
    </div>
  );
}

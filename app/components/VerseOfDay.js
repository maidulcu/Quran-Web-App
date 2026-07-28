'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getVerseOfDay } from '../lib/verseOfDay';
import { getAyahMultipleEditions } from '../lib/api';

export default function VerseOfDay() {
  const [verse, setVerse] = useState(null);
  const [arabic, setArabic] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const vod = getVerseOfDay();
    setVerse(vod);

    getAyahMultipleEditions(vod.surahNumber, vod.ayahNumber, ['ar.alafasy', 'en.sahih'])
      .then(data => {
        if (data.status === 'OK') {
          setArabic(data.data[0].text);
          setTranslation(data.data[1].text);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !verse) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60">
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-medium px-3 py-1 rounded-full">
          Verse of the Day
        </span>
      </div>

      <Link href={`/surah/${verse.surahNumber}/${verse.ayahNumber}`} className="block group">
        <div lang="ar" dir="rtl" className="text-2xl sm:text-3xl font-quran text-gray-800 dark:text-gray-100 leading-loose mb-4 text-center group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
          {arabic}
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed text-center mb-4">
          {translation}
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium">
          <span>Surah {verse.surahName}</span>
          <span className="text-gray-400">•</span>
          <span>Ayah {verse.ayahNumber}</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </Link>
    </div>
  );
}

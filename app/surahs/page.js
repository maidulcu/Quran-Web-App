'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSurahs } from '../lib/api';

export default function SurahList() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchSurahs = async () => {
      try {
        const data = await getSurahs();
        if (!controller.signal.aborted) {
          setSurahs(data.data);
          setLoading(false);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSurahs();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">All Surahs</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg animate-pulse">
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
                <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">All Surahs</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surahs.map((surah) => (
          <Link
            key={surah.number}
            href={`/surah/${surah.number}`}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{surah.englishName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{surah.name}</p>
              </div>
              <span className="text-sm bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-2 py-1 rounded">
                {surah.number}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {surah.numberOfAyahs} Ayahs • {surah.revelationType}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

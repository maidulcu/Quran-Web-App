import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SurahList() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const filterType = params.get('type'); // e.g. Meccan or Medinan

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        const allSurahs = data.data;
        const filtered = filterType
          ? allSurahs.filter(s => s.revelationType === filterType)
          : allSurahs;
        setSurahs(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch Surahs:', err);
        setLoading(false);
      });
  }, [filterType]);

  if (loading) return <div className="text-center py-8">Loading surahs...</div>;

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">📖 Surahs of the Quran</h1>
      <p className="text-center text-gray-600 mb-8">
        Browse all 114 chapters of the Holy Quran
      </p>
      <div className="grid gap-x-6 gap-y-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {surahs.map(surah => (
          <Link
            to={`/surah/${surah.number}`}
            key={surah.number}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 flex justify-between items-center shadow-sm hover:border-teal-600 hover:bg-teal-50 dark:hover:border-teal-500 transition"
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center font-semibold text-sm text-gray-700 dark:text-gray-300">
                {surah.number}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-teal-700 transition">
                  {surah.englishName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-teal-600 transition">
                  {surah.englishNameTranslation}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-arabic leading-tight">{surah.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-teal-600 transition">
                {surah.numberOfAyahs} Ayahs
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

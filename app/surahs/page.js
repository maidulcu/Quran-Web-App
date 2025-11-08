'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSurahs } from '../lib/api';

export default function SurahList() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const data = await getSurahs();
        setSurahs(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surahs:', error);
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;

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
                <h3 className="font-semibold">{surah.englishName}</h3>
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
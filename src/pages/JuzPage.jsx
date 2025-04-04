import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function JuzPage() {
  const [juzData, setJuzData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJuz = async () => {
      const allJuz = [];
      for (let i = 1; i <= 30; i++) {
        const res = await fetch(`https://api.alquran.cloud/v1/juz/${i}/en.sahih`);
        const data = await res.json();
        if (data.code === 200) {
          const firstAyah = data.data.ayahs[0];
          allJuz.push({
            number: i,
            surah: {
              number: firstAyah.surah.number,
              englishName: firstAyah.surah.englishName,
              name: firstAyah.surah.name,
              revelationType: firstAyah.surah.revelationType,
            },
            ayah: firstAyah.numberInSurah,
          });
        }
      }
      setJuzData(allJuz);
      setLoading(false);
    };

    fetchJuz();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        📚 Browse the Quran by Juz
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading Juz data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {juzData.map((juz) => (
            <Link
              key={juz.number}
              to={`/surah/${juz.surah.number}`}
              className="p-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Juz {juz.number}</div>
              <div className="flex justify-between items-baseline flex-wrap gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {juz.surah.englishName}
                </h2>
                <span className="text-xl text-gray-700 dark:text-white font-quran">
                  {juz.surah.name}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-between gap-2">
                <span>Starts at Ayah {juz.ayah}</span>
                <span>{juz.surah.revelationType === 'Meccan' ? '🕋 Meccan' : '🕌 Medinan'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

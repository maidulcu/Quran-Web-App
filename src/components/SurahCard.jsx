import React from 'react';
import { Link } from 'react-router-dom';

export default function SurahCard({ surah }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
        {surah.number}. {surah.englishName}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-300 italic mb-3">{surah.name}</p>
      <p className="text-xs text-gray-400 mb-4">{surah.numberOfAyahs} Ayahs</p>
      <Link
        to={`/surah/${surah.number}`}
        className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
      >
        📖 Read Surah
      </Link>
    </div>
  );
}
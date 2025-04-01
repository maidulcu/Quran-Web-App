import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
          📖 Welcome to the Quran Web App
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/surahs"
            className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            Browse Surahs
          </Link>
          <Link
            to="/search"
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Search Quran
          </Link>
        </div>
      </div>
    </div>
  );
}
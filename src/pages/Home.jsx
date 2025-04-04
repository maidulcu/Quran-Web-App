import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [popularSurahs, setPopularSurahs] = useState([]);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          const popular = data.data.filter((s) =>
            [1, 18, 36, 55, 67, 112, 113, 114].includes(s.number)
          );
          setPopularSurahs(popular);
        }
      });
  }, []);

  return (
    <div className="space-y-20 px-4 py-10 max-w-6xl mx-auto">

      {/* Hero Section */}
      <section className="text-center bg-gradient-to-br from-teal-100 via-white to-teal-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-lg p-10 shadow">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">📖 Welcome to Quran Web App</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <div className="flex justify-center flex-wrap gap-4">
          <Link to="/surahs" className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">Browse Surahs</Link>
          <Link to="/search" className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition">Search Quran</Link>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/surahs" className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-50 dark:hover:bg-gray-700 text-center space-y-2 transform transition duration-200 hover:scale-105">
            <div className="text-3xl">📖</div>
            <div>All Surahs</div>
          </Link>
          <Link to="/juz" className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-50 dark:hover:bg-gray-700 text-center space-y-2 transform transition duration-200 hover:scale-105">
            <div className="text-3xl">📚</div>
            <div>Juz Index</div>
          </Link>
          <Link to="/search" className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-50 dark:hover:bg-gray-700 text-center space-y-2 transform transition duration-200 hover:scale-105">
            <div className="text-3xl">🔍</div>
            <div>Search Quran</div>
          </Link>
          <Link to="/bookmarks" className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-50 dark:hover:bg-gray-700 text-center space-y-2 transform transition duration-200 hover:scale-105">
            <div className="text-3xl">⭐</div>
            <div>Bookmarks</div>
          </Link>
        </div>
      </section>

      {/* Popular Surahs */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Popular Surahs</h2>
        <div className="overflow-x-auto flex space-x-4 pb-2">
          {popularSurahs.map((surah) => (
            <Link
              key={surah.number}
              to={`/surah/${surah.number}`}
              className="min-w-[200px] bg-white dark:bg-gray-800 p-4 rounded shadow text-center transform transition duration-200 hover:scale-105"
            >
              <div className="text-2xl font-bold">{surah.number}</div>
              <div className="text-lg">{surah.englishName}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{surah.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore By Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Explore by Revelation Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/surahs?type=Meccan" className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-50 dark:hover:bg-gray-700 text-center space-y-2 transform transition duration-200 hover:scale-105">
            <div className="text-3xl">🕋</div>
            <div className="font-medium">Meccan Surahs</div>
          </Link>
          <Link to="/surahs?type=Medinan" className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-50 dark:hover:bg-gray-700 text-center space-y-2 transform transition duration-200 hover:scale-105">
            <div className="text-3xl">🕌</div>
            <div className="font-medium">Medinan Surahs</div>
          </Link>
        </div>
      </section>

      {/* App Features Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">App Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-2 transform transition duration-200 hover:scale-105">
            <div className="text-3xl">⚡</div>
            <h3 className="text-lg font-semibold">Fast & Lightweight</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Optimized React + Vite stack for seamless experience across devices.</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-2 transform transition duration-200 hover:scale-105">
            <div className="text-3xl">🌙</div>
            <h3 className="text-lg font-semibold">Dark Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Beautiful dark mode support for late-night reading and focus.</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-2 transform transition duration-200 hover:scale-105">
            <div className="text-3xl">🔊</div>
            <h3 className="text-lg font-semibold">Audio Playback</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Listen to your favorite Surahs with global reciter settings and queue.</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-2 transform transition duration-200 hover:scale-105">
            <div className="text-3xl">📑</div>
            <h3 className="text-lg font-semibold">Bookmarks & Resumable</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Save your progress, resume where you left off, and organize favorites.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
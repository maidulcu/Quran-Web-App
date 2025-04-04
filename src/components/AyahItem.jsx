import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function AyahItem({ ayah, bookmarked, toggleBookmark = () => {}, playAudio }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (!playAudio || typeof playAudio !== 'function') return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
    }

    const audio = playAudio(ayah);
    if (audio instanceof HTMLAudioElement) {
      audioRef.current = audio;
      setIsPlaying(true);

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        audioRef.current = null;
      }, { once: true });
    }
  };

  return (
    <div className={`relative border border-gray-200 dark:border-gray-700 py-4 px-4 rounded-md transition shadow-sm ${
      isPlaying ? 'bg-yellow-50 dark:bg-yellow-900' : 'bg-white dark:bg-gray-900'
    }`}>

      <div className="flex justify-between items-start">
        {/* Ayah reference */}
        <Link to={`/surah/${ayah.surah?.number}`} className="text-sm text-gray-700 dark:text-gray-400 font-semibold hover:underline">
          {ayah.surah ? `${ayah.surah.number}:${ayah.numberInSurah}` : `Ayah ${ayah.number}`}
        </Link>

        {/* Action buttons */}
        <div className="flex items-center space-x-3">
          <button onClick={() => {
            toggleBookmark(ayah);
          }} title="Bookmark">
            <span role="img" aria-label="bookmark">{bookmarked ? '🔖' : '📑'}</span>
          </button>
        </div>
      </div>

      {/* Arabic + Translation Section */}
      <Link to={`/surah/${ayah.surah?.number}`} className="block mt-6 flex flex-col md:flex-row md:justify-between md:items-start gap-6 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md p-2 transition">
        {/* Arabic */}
        <div className="text-base text-gray-800 dark:text-gray-100 text-left">
          {ayah.edition?.englishName && (
            <div className="text-sm text-teal-700 dark:text-teal-400 font-bold mb-1">{ayah.edition.englishName}</div>
          )}
          <div>{ayah.text}</div>
        </div>
        <div className="h-2" />
        {/* Translation */}
        <div className="text-base text-justify text-gray-800 dark:text-gray-300">
          {ayah.translationText}
        </div>
      </Link>
    </div>
  );
}
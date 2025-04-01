import React, { useState, useRef } from 'react';

export default function AyahItem({ ayah, bookmarked, toggleBookmark, playAudio }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
    }

    const audio = playAudio();
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
    <div className={`border-b py-6 px-2 rounded-md shadow-sm transition ${
      isPlaying ? 'bg-yellow-100 dark:bg-yellow-800' : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="text-2xl text-right font-arabic text-gray-900 dark:text-white leading-relaxed">
        {ayah.text}
      </div>
      <div className="text-sm text-left text-gray-700 dark:text-gray-300 mt-3">
        {ayah.translationText}
      </div>
      <div className="mt-4 flex justify-end space-x-4 text-sm">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className={`px-3 py-1 rounded transition ${
            isPlaying
              ? 'bg-blue-200 dark:bg-blue-600 text-blue-800 dark:text-white cursor-not-allowed'
              : 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-700'
          }`}
        >
          {isPlaying ? '🔊 Playing' : '▶ Play'}
        </button>
        <button
          onClick={toggleBookmark}
          className={`px-3 py-1 rounded transition ${
            bookmarked
              ? 'bg-yellow-200 dark:bg-yellow-500 text-yellow-900 dark:text-black'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {bookmarked ? '⭐ Bookmarked' : '☆ Bookmark'}
        </button>
      </div>
    </div>
  );
}
'use client';
import { useState } from 'react';

export default function AudioPlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(null);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          {currentAyah ? (
            <div className="text-sm">
              <p className="font-medium">Surah {currentAyah.surahName}</p>
              <p className="text-gray-600 dark:text-gray-400">Ayah {currentAyah.number}</p>
            </div>
          ) : (
            <p className="text-gray-500">No audio playing</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>
    </div>
  );
}
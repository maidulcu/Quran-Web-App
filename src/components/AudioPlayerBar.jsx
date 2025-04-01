import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

export default function AudioPlayerBar() {
  const {
    currentAyah,
    isPlaying,
    playbackTime,
    duration,
    togglePlayPause,
  } = useAudioPlayer();

  if (!currentAyah) return null;

  const formatTime = (time) =>
    time ? `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}` : '0:00';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow px-4 py-3 flex items-center justify-between z-50">
      <div className="flex flex-col text-sm text-gray-800 dark:text-gray-200">
        <div className="font-medium">Surah {currentAyah?.surahNumber || '–'} • Ayah {currentAyah?.number}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{currentAyah?.text?.slice(0, 100)}...</div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlayPause}
          className="px-4 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <div className="text-xs text-gray-600 dark:text-gray-400 w-24 text-right">
          {formatTime(playbackTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}

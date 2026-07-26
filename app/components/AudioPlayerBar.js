'use client';
import { useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function AudioPlayerBar() {
  const { isPlaying, currentAyah, progress, playbackRate, togglePlayPause, seekTo, setPlaybackRate } = useAudioPlayer();
  const [showSpeeds, setShowSpeeds] = useState(false);

  if (!currentAyah) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t shadow-lg z-50">
      <div
        className="h-2 bg-gray-200 dark:bg-gray-700 cursor-pointer group"
        role="slider"
        aria-label="Audio progress"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          seekTo(fraction);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') seekTo(Math.min(1, progress + 0.05));
          if (e.key === 'ArrowLeft') seekTo(Math.max(0, progress - 0.05));
        }}
      >
        <div className="h-full bg-teal-600 transition-all relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-teal-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="container mx-auto flex items-center justify-between px-4 py-3 gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{currentAyah.surahName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ayah {currentAyah.number}</p>
        </div>

        {/* Speed control */}
        <div className="relative">
          <button
            onClick={() => setShowSpeeds(!showSpeeds)}
            className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Playback speed: ${playbackRate}x`}
          >
            {playbackRate}x
          </button>
          {showSpeeds && (
            <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[60px]">
              {SPEEDS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => { setPlaybackRate(speed); setShowSpeeds(false); }}
                  className={`block w-full text-center px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${speed === playbackRate ? 'text-teal-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={togglePlayPause}
          className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
      </div>
    </div>
  );
}

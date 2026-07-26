'use client';
import { useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function AudioPlayerBar() {
  const { isPlaying, currentAyah, progress, queue, playbackRate, togglePlayPause, seekTo, setPlaybackRate, playAudio, setQueue } = useAudioPlayer();
  const [showSpeeds, setShowSpeeds] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  if (!currentAyah) return null;

  const removeFromQueue = (index) => {
    setQueue(queue.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t shadow-lg z-50">
      {/* Progress bar */}
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

        {/* Queue button */}
        <div className="relative">
          <button
            onClick={() => setShowQueue(!showQueue)}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            aria-label={`Queue${queue.length > 0 ? ` (${queue.length} items)` : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {queue.length > 9 ? '9+' : queue.length}
              </span>
            )}
          </button>

          {/* Queue panel */}
          {showQueue && (
            <div className="absolute bottom-full mb-2 right-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-medium text-sm text-gray-900 dark:text-white">Up Next</h3>
                {queue.length > 0 && (
                  <button
                    onClick={() => { setQueue([]); setShowQueue(false); }}
                    className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto">
                {queue.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    No upcoming ayahs
                  </div>
                ) : (
                  <div className="py-1">
                    {queue.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                      >
                        <button
                          onClick={() => {
                            playAudio(item);
                            setQueue(queue.slice(index + 1));
                          }}
                          className="flex-1 flex items-center gap-3 text-left"
                        >
                          <span className="bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                            {item.number}
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {item.surahName} — Ayah {item.number}
                          </span>
                        </button>
                        <button
                          onClick={() => removeFromQueue(index)}
                          className="p-1 rounded text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          aria-label={`Remove ayah ${item.number} from queue`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
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

        {/* Play/Pause button */}
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

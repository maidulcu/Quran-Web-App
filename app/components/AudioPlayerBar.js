'use client';
import { useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function AudioPlayerBar() {
  const { isPlaying, currentAyah, progress, queue, playbackRate, repeatMode, togglePlayPause, seekTo, setPlaybackRate, playAudio, setQueue, cycleRepeatMode } = useAudioPlayer();
  const [showSpeeds, setShowSpeeds] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  if (!currentAyah) return null;

  const REPEAT_LABELS = { none: 'Off', one: '1x', three: '3x', five: '5x', all: '∞' };

  const removeFromQueue = (index) => {
    setQueue(queue.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-50">
      {/* Progress bar */}
      <div
        className="h-1 bg-gray-200/50 dark:bg-gray-700/50 cursor-pointer group"
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
        <div className="h-full bg-primary transition-all relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-elevation-2" />
        </div>
      </div>

      {/* Player bar */}
      <div className="glass-panel border-t border-outline-variant/20">
        <div className="container mx-auto flex items-center justify-between px-4 py-2.5 gap-3">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate font-body">{currentAyah.surahName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-body">Ayah {currentAyah.number}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            {/* Queue button */}
            <div className="relative">
              <button
                onClick={() => setShowQueue(!showQueue)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                aria-label={`Queue${queue.length > 0 ? ` (${queue.length} items)` : ''}`}
              >
                <span className="material-symbols-outlined text-[20px]">queue_music</span>
                {queue.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {queue.length > 9 ? '9+' : queue.length}
                  </span>
                )}
              </button>

              {showQueue && (
                <div className="absolute bottom-full mb-2 right-0 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-outline-variant/30 dark:border-outline-variant-dark/30 overflow-hidden">
                  <div className="px-4 py-3 border-b border-outline-variant/30 dark:border-outline-variant-dark/30 flex items-center justify-between">
                    <h3 className="font-medium text-sm font-body">Up Next</h3>
                    {queue.length > 0 && (
                      <button
                        onClick={() => { setQueue([]); setShowQueue(false); }}
                        className="text-xs text-gray-500 hover:text-error transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {queue.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400 font-body">
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
                              <span className="bg-primary-container dark:bg-primary-container-dark text-primary text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                                {item.number}
                              </span>
                              <span className="text-sm text-gray-700 dark:text-gray-300 truncate font-body">
                                {item.surahName} — Ayah {item.number}
                              </span>
                            </button>
                            <button
                              onClick={() => removeFromQueue(index)}
                              className="p-1 rounded text-gray-400 hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                              aria-label={`Remove ayah ${item.number} from queue`}
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Previous */}
            <button
              onClick={() => {
                const idx = queue.findIndex(q => q.surahName === currentAyah.surahName && q.number === currentAyah.number);
                if (idx > 0) playAudio(queue[idx - 1]);
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
              aria-label="Previous ayah"
            >
              <span className="material-symbols-outlined text-[20px]">skip_previous</span>
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlayPause}
              className={`bg-primary text-white w-11 h-11 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors flex-shrink-0 shadow-elevation-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isPlaying ? 'animate-pulse-subtle' : ''}`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            {/* Next */}
            <button
              onClick={() => {
                if (queue.length > 0) playAudio(queue[0]);
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
              aria-label="Next ayah"
            >
              <span className="material-symbols-outlined text-[20px]">skip_next</span>
            </button>

            {/* Repeat */}
            <button
              onClick={cycleRepeatMode}
              className={`p-2 rounded-full transition-colors ${
                repeatMode !== 'none'
                  ? 'bg-primary-container dark:bg-primary-container-dark text-primary'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
              aria-label={`Repeat: ${REPEAT_LABELS[repeatMode]}`}
              title={`Repeat: ${REPEAT_LABELS[repeatMode]}`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {repeatMode === 'all' ? 'repeat' : repeatMode === 'none' ? 'repeat' : 'repeat_one'}
              </span>
            </button>

            {/* Speed */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowSpeeds(!showSpeeds)}
                className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-body"
                aria-label={`Playback speed: ${playbackRate}x`}
              >
                {playbackRate}x
              </button>
              {showSpeeds && (
                <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-outline-variant/30 dark:border-outline-variant-dark/30 py-1 min-w-[60px]">
                  {SPEEDS.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => { setPlaybackRate(speed); setShowSpeeds(false); }}
                      className={`block w-full text-center px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-body ${speed === playbackRate ? 'text-primary font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

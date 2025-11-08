'use client';
import { useEffect, useRef } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { logger } from '../lib/logger';

export default function AudioPlayerBar() {
  const { isPlaying, currentAyah, playAudio, pauseAudio, stopAudio } = useAudioPlayer();
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current || !currentAyah?.audio) return;

    if (isPlaying) {
      audioRef.current.play().catch(err => {
        logger.error('Audio playback error:', err);
        pauseAudio();
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentAyah, pauseAudio]);

  // Don't render if no audio is loaded
  if (!currentAyah) {
    return null;
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio(currentAyah);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopAudio();
  };

  const handleEnded = () => {
    stopAudio();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t p-4 shadow-lg z-50">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-sm">
            <p className="font-medium truncate">
              {currentAyah.surahName || `Surah ${currentAyah.surahNumber}`}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Ayah {currentAyah.number}
            </p>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={currentAyah.audio}
          onEnded={handleEnded}
          preload="auto"
        />

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePlayPause}
            className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={handleStop}
            className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
            aria-label="Stop"
          >
            ⏹
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';
import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const AudioPlayerContext = createContext();

const REPEAT_MODES = ['none', 'one', 'three', 'five', 'all'];

export function AudioPlayerProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(null);
  const [queue, setQueue] = useState([]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [repeatMode, setRepeatMode] = useState('none');
  const repeatCountRef = useRef(0);
  const audioRef = useRef(null);
  const playAudioRef = useRef(null);

  const playAudio = useCallback((ayah) => {
    const audio = audioRef.current;
    if (!audio || !ayah?.audio) return;

    setCurrentAyah(ayah);
    repeatCountRef.current = 0;
    audio.src = ayah.audio;
    audio.playbackRate = playbackRate;
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });
  }, [playbackRate]);

  useEffect(() => {
    playAudioRef.current = playAudio;
  }, [playAudio]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onEnded = () => {
      setProgress(0);

      const mode = repeatCountRef.current.mode;
      const count = repeatCountRef.current.count;

      // Handle repeat modes
      if (mode === 'one') {
        // Repeat current ayah indefinitely
        audio.currentTime = 0;
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
        return;
      }

      if (mode === 'three' || mode === 'five') {
        const max = mode === 'three' ? 3 : 5;
        repeatCountRef.current.count++;
        if (repeatCountRef.current.count < max) {
          audio.currentTime = 0;
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
          return;
        }
        // Reset count and advance
        repeatCountRef.current.count = 0;
      }

      // Advance to next in queue
      setQueue(prev => {
        if (prev.length > 0) {
          const next = prev[0];
          const remaining = prev.slice(1);
          repeatCountRef.current = { mode, count: 0 };
          setTimeout(() => playAudioRef.current?.(next), 300);
          return remaining;
        }
        // No queue — stop
        setIsPlaying(false);
        repeatCountRef.current = { mode: 'none', count: 0 };
        return prev;
      });
    };

    const onError = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
    } else if (currentAyah?.audio) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [currentAyah]);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentAyah(null);
    setProgress(0);
  }, []);

  const seekTo = useCallback((fraction) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = fraction * audio.duration;
      setProgress(fraction);
    }
  }, []);

  const setPlaybackRate = useCallback((rate) => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = rate;
    }
    setPlaybackRateState(rate);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode(prev => {
      const currentIndex = REPEAT_MODES.indexOf(prev);
      const nextIndex = (currentIndex + 1) % REPEAT_MODES.length;
      const nextMode = REPEAT_MODES[nextIndex];
      repeatCountRef.current = { mode: nextMode, count: 0 };
      return nextMode;
    });
  }, []);

  return (
    <AudioPlayerContext.Provider value={{
      isPlaying,
      currentAyah,
      queue,
      progress,
      duration,
      playbackRate,
      repeatMode,
      playAudio,
      pauseAudio,
      togglePlayPause,
      stopAudio,
      seekTo,
      setPlaybackRate,
      setQueue,
      cycleRepeatMode
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return context;
};

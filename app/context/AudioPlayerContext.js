'use client';
import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(null);
  const [queue, setQueue] = useState([]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const playAudioRef = useRef(null);

  const playAudio = useCallback((ayah) => {
    const audio = audioRef.current;
    if (!audio || !ayah?.audio) return;

    setCurrentAyah(ayah);
    audio.src = ayah.audio;
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });
  }, []);

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
      setIsPlaying(false);
      setProgress(0);
      setQueue(prev => {
        if (prev.length > 0) {
          const next = prev[0];
          const remaining = prev.slice(1);
          setTimeout(() => playAudioRef.current?.(next), 300);
          return remaining;
        }
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
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else if (currentAyah?.audio) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying, currentAyah]);

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

  return (
    <AudioPlayerContext.Provider value={{
      isPlaying,
      currentAyah,
      queue,
      progress,
      duration,
      playAudio,
      pauseAudio,
      togglePlayPause,
      stopAudio,
      seekTo,
      setQueue
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

'use client';
import { createContext, useContext, useState } from 'react';

const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(null);
  const [queue, setQueue] = useState([]);

  const playAudio = (ayah) => {
    setCurrentAyah(ayah);
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
  };

  const stopAudio = () => {
    setIsPlaying(false);
    setCurrentAyah(null);
  };

  return (
    <AudioPlayerContext.Provider value={{
      isPlaying,
      currentAyah,
      queue,
      playAudio,
      pauseAudio,
      stopAudio,
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
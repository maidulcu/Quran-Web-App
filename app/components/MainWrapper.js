'use client';
import { useAudioPlayer } from '../context/AudioPlayerContext';

export default function MainWrapper({ children }) {
  const { currentAyah } = useAudioPlayer();

  return (
    <main id="main-content" className={`flex-grow transition-all ${currentAyah ? 'pb-20' : ''}`}>
      {children}
    </main>
  );
}

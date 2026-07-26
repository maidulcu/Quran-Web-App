'use client';
import { memo } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const Footer = memo(function Footer() {
  const { currentAyah } = useAudioPlayer();

  return (
    <footer className={`bg-gray-100 dark:bg-gray-800 py-8 transition-all ${currentAyah ? 'pb-24' : ''}`}>
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Quran Web App. Built with Next.js and Tailwind CSS.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Data provided by AlQuran Cloud API
        </p>
      </div>
    </footer>
  );
});

export default Footer;

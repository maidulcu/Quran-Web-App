'use client';
import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const NAV_LINKS = [
  { href: '/surahs', label: 'All Surahs' },
  { href: '/mushaf/1', label: 'Mushaf View' },
  { href: '/juzs', label: 'Juz Index' },
  { href: '/search', label: 'Search' },
  { href: '/bookmarks', label: 'Bookmarks' },
  { href: '/progress', label: 'Reading Progress' },
];

const Footer = memo(function Footer() {
  const { currentAyah } = useAudioPlayer();

  return (
    <footer className={`bg-white dark:bg-gray-900 border-t transition-all ${currentAyah ? 'pb-20' : ''}`}>
      <div className="container mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <Image
                src="/quran-logo.webp"
                alt=""
                width={28}
                height={28}
                className="rounded-full"
              />
              <span className="font-bold text-teal-600">Quran Web App</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Read, listen, and reflect on the Holy Quran with Arabic text, translations, and tafsir.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Navigate</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Data Sources</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="https://alquran.cloud/api" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  AlQuran Cloud API
                </a>
              </li>
              <li>
                <a href="https://quran.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Quran.com API
                </a>
              </li>
              <li>
                <a href="https://github.com/maidulcu" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} Quran Web App. Built with Next.js &amp; Tailwind CSS.</p>
          <p>For personal &amp; educational use only.</p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;

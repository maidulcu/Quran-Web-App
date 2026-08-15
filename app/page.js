'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLastRead } from './hooks/useLastRead';
import VerseOfDay from './components/VerseOfDay';

export default function Home() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const { lastRead } = useLastRead();

  const submit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const pinnedSurahs = [
    { id: 36, name: 'Ya-Sin', type: 'Meccan', ayahs: 83 },
    { id: 18, name: 'Al-Kahf', type: 'Meccan', ayahs: 110 },
    { id: 67, name: 'Al-Mulk', type: 'Meccan', ayahs: 30 },
  ];

  const quickLinks = [
    { href: '/search', title: 'Daily Dhikr', icon: 'spa', color: 'text-primary', bg: 'bg-primary-container dark:bg-primary-container-dark' },
    { href: '/juzs', title: 'Juz Index', icon: 'import_contacts', color: 'text-primary', bg: 'bg-primary-container dark:bg-primary-container-dark' },
    { href: '/surahs', title: 'Browse Surahs', icon: 'explore', color: 'text-secondary', bg: 'bg-secondary-container dark:bg-secondary-container-dark' },
    { href: '/progress', title: 'My Notes', icon: 'edit_note', color: 'text-primary', bg: 'bg-primary-container dark:bg-primary-container-dark' },
  ];

  return (
    <div className="relative">
      {/* Last Read Card */}
      <section className="container mx-auto px-4 pt-4 pb-3">
        {lastRead ? (
          <Link
            href={`/surah/${lastRead.surahNumber}/${lastRead.ayahNumber}`}
            className="block relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-600 p-5 shadow-elevation-2 hover:shadow-lg transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-white/80 text-[18px]">history</span>
                  <span className="text-xs font-medium text-white/80 uppercase tracking-wider font-body">Last Read</span>
                </div>
                <p className="text-white font-display font-semibold text-lg">{lastRead.surahName}</p>
                <p className="text-white/70 text-sm font-body">Ayah {lastRead.ayahNumber}</p>
              </div>
              <span className="bg-white text-primary px-5 py-2.5 rounded-full font-medium text-sm font-body hover:bg-white/90 transition-colors">
                Resume
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href="/surahs"
            className="block relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-600 p-5 shadow-elevation-2 hover:shadow-lg transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-white/80 text-[18px]">menu_book</span>
                  <span className="text-xs font-medium text-white/80 uppercase tracking-wider font-body">Start Reading</span>
                </div>
                <p className="text-white font-display font-semibold text-lg">Begin Your Journey</p>
                <p className="text-white/70 text-sm font-body">Explore all 114 Surahs</p>
              </div>
              <span className="bg-white text-primary px-5 py-2.5 rounded-full font-medium text-sm font-body hover:bg-white/90 transition-colors">
                Start
              </span>
            </div>
          </Link>
        )}
      </section>

      {/* Quick Links Bento Grid */}
      <section className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40 hover:shadow-elevation-2 transition-all duration-200"
            >
              <div className={`${link.bg} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className={`material-symbols-outlined text-[20px] ${link.color}`}>{link.icon}</span>
              </div>
              <span className="font-medium text-sm text-gray-900 dark:text-white font-body">{link.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Verse of the Day */}
      <section className="container mx-auto px-4 py-3">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">wb_sunny</span>
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider font-body">Verse of the Day</span>
            </div>
            <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400" aria-label="Share verse">
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
          </div>
          <VerseOfDay />
        </div>
      </section>

      {/* Pinned Surahs */}
      <section className="container mx-auto px-4 py-3 pb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-headline-lg-mobile font-display font-semibold text-gray-900 dark:text-white">Pinned Surahs</h2>
          <Link href="/surahs" className="text-sm text-primary font-medium font-body hover:text-primary-600 transition-colors">
            View All
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
          {pinnedSurahs.map((surah) => (
            <Link
              key={surah.id}
              href={`/surah/${surah.id}`}
              className="flex-shrink-0 w-40 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40 hover:shadow-elevation-2 hover:ring-primary/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="bg-primary-container dark:bg-primary-container-dark text-primary text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center font-body">
                  {surah.id}
                </span>
                <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-[18px]">bookmark</span>
              </div>
              <p className="font-display font-semibold text-gray-900 dark:text-white mb-0.5">{surah.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-body">{surah.type} • {surah.ayahs} Ayahs</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

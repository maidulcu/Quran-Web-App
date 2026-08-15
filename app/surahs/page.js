'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSurahs } from '../lib/api';

const TABS = ['Surah', 'Juz', 'Bookmark'];

export default function SurahList() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Surah');

  useEffect(() => {
    const controller = new AbortController();
    const fetchSurahs = async () => {
      try {
        const data = await getSurahs();
        if (!controller.signal.aborted) {
          setSurahs(data.data);
          setLoading(false);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSurahs();
    return () => controller.abort();
  }, []);

  const filtered = surahs.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.englishName?.toLowerCase().includes(q) ||
      s.name?.includes(q) ||
      s.englishNameTranslation?.toLowerCase().includes(q) ||
      String(s.number).includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-pattern">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 flex items-center bg-white dark:bg-gray-800 rounded-full ring-1 ring-outline-variant/50 dark:ring-outline-variant-dark/50 px-4 py-2.5 shadow-sm">
            <span className="material-symbols-outlined text-gray-400 text-[20px] mr-2">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 font-body"
              placeholder="Search Surah or Ayah..."
            />
          </div>
          <button className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 ring-1 ring-outline-variant/50 dark:ring-outline-variant-dark/50 flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-[20px]">tune</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-5 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium font-body transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ring-1 ring-outline-variant/30 dark:ring-outline-variant-dark/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Surah List */}
        {activeTab === 'Surah' && (
          <div className="space-y-2.5">
            {filtered.map((surah) => (
              <Link
                key={surah.number}
                href={`/surah/${surah.number}`}
                className="group flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40 hover:shadow-elevation-2 hover:ring-primary/30 transition-all duration-200"
              >
                {/* Hexagonal Number Badge */}
                <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full">
                    <polygon
                      points="24,2 45,14 45,34 24,46 3,34 3,14"
                      fill="currentColor"
                      className="text-primary-container dark:text-primary-container-dark group-hover:text-primary/20 dark:group-hover:text-primary/10 transition-colors"
                    />
                  </svg>
                  <span className="relative text-sm font-bold text-primary font-body">{surah.number}</span>
                </div>

                {/* Surah Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="font-display font-semibold text-gray-900 dark:text-white">{surah.englishName}</p>
                    <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-body hidden sm:inline">
                      {surah.englishNameTranslation}
                    </span>
                  </div>
                  <p className="text-sm font-arabic text-gray-500 dark:text-gray-400 mt-0.5" lang="ar" dir="rtl">
                    {surah.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-body mt-0.5">
                    {surah.numberOfAyahs} Ayahs • {surah.revelationType}
                  </p>
                </div>

                {/* Download button */}
                <button
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400"
                  aria-label={`Download ${surah.englishName}`}
                  onClick={(e) => { e.preventDefault(); }}
                >
                  <span className="material-symbols-outlined text-[20px]">cloud_download</span>
                </button>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'Juz' && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 font-body">
            <span className="material-symbols-outlined text-[48px] mb-3 block">import_contacts</span>
            <p>Browse by Juz from the Juz tab</p>
          </div>
        )}

        {activeTab === 'Bookmark' && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 font-body">
            <span className="material-symbols-outlined text-[48px] mb-3 block">bookmark_border</span>
            <p>Your bookmarks will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

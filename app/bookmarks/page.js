'use client';
import { useState } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import Link from 'next/link';

const SURAH_NAMES = {
  1: 'Al-Fatihah', 2: 'Al-Baqarah', 3: 'Ali Imran', 4: 'An-Nisa', 5: 'Al-Maidah',
  6: 'Al-Anam', 7: 'Al-Araf', 8: 'Al-Anfal', 9: 'At-Tawbah', 10: 'Yunus',
  11: 'Hud', 12: 'Yusuf', 13: 'Ar-Rad', 14: 'Ibrahim', 15: 'Al-Hijr',
  16: 'An-Nahl', 17: 'Al-Isra', 18: 'Al-Kahf', 19: 'Maryam', 20: 'Taha',
  21: 'Al-Anbiya', 22: 'Al-Hajj', 23: 'Al-Muminun', 24: 'An-Nur', 25: 'Al-Furqan',
  26: 'Ash-Shuara', 27: 'An-Naml', 28: 'Al-Qasas', 29: 'Al-Ankabut', 30: 'Ar-Rum',
  31: 'Luqman', 32: 'As-Sajdah', 33: 'Al-Ahzab', 34: 'Saba', 35: 'Fatir',
  36: 'Ya-Sin', 37: 'As-Saffat', 38: 'Sad', 39: 'Az-Zumar', 40: 'Ghafir',
  41: 'Fussilat', 42: 'Ash-Shura', 43: 'Az-Zukhruf', 44: 'Ad-Dukhan', 45: 'Al-Jathiyah',
  46: 'Al-Ahqaf', 47: 'Muhammad', 48: 'Al-Fath', 49: 'Al-Hujurat', 50: 'Qaf',
  51: 'Adh-Dhariyat', 52: 'At-Tur', 53: 'An-Najm', 54: 'Al-Qamar', 55: 'Ar-Rahman',
  56: 'Al-Waqiah', 57: 'Al-Hadid', 58: 'Al-Mujadilah', 59: 'Al-Hashr', 60: 'Al-Mumtahanah',
  61: 'As-Saff', 62: 'Al-Jumuah', 63: 'Al-Munafiqun', 64: 'At-Taghabun', 65: 'At-Talaq',
  66: 'At-Tahrim', 67: 'Al-Mulk', 68: 'Al-Qalam', 69: 'Al-Haqqah', 70: 'Al-Maarij',
  71: 'Nuh', 72: 'Al-Jinn', 73: 'Al-Muzzammil', 74: 'Al-Muddaththir', 75: 'Al-Qiyamah',
  76: 'Al-Insan', 77: 'Al-Mursalat', 78: 'An-Naba', 79: 'An-Naziat', 80: 'Abasa',
  81: 'At-Takwir', 82: 'Al-Infitar', 83: 'Al-Mutaffifin', 84: 'Al-Inshiqaq', 85: 'Al-Buruj',
  86: 'At-Tariq', 87: 'Al-Ala', 88: 'Al-Ghashiyah', 89: 'Al-Fajr', 90: 'Al-Balad',
  91: 'Ash-Shams', 92: 'Al-Layl', 93: 'Ad-Duha', 94: 'Ash-Sharh', 95: 'At-Tin',
  96: 'Al-Alaq', 97: 'Al-Qadr', 98: 'Al-Bayyinah', 99: 'Az-Zalzalah', 100: 'Al-Adiyat',
  101: 'Al-Qariah', 102: 'At-Takathur', 103: 'Al-Asr', 104: 'Al-Humazah', 105: 'Al-Fil',
  106: 'Quraysh', 107: 'Al-Maun', 108: 'Al-Kawthar', 109: 'Al-Kafirun', 110: 'An-Nasr',
  111: 'Al-Masad', 112: 'Al-Ikhlas', 113: 'Al-Falaq', 114: 'An-Nas'
};

const FILTERS = ['All Bookmarks', 'Surahs', 'Ayahs'];

export default function Bookmarks() {
  const { bookmarks, isLoading, removeBookmark } = useBookmarks();
  const [activeFilter, setActiveFilter] = useState('All Bookmarks');
  const [editing, setEditing] = useState(false);

  const filtered = bookmarks.filter(b => {
    if (activeFilter === 'All Bookmarks') return true;
    if (activeFilter === 'Surahs') return !b.number;
    if (activeFilter === 'Ayahs') return b.number;
    return true;
  });

  const surahCount = bookmarks.filter(b => !b.number).length;
  const ayahCount = bookmarks.filter(b => b.number).length;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-headline-lg font-display font-semibold text-gray-900 dark:text-white mb-1">Bookmarks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body">Your saved Surahs and Ayahs</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full ring-1 ring-outline-variant/50 dark:ring-outline-variant-dark/50 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-body">
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Edit
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full ring-1 ring-error/30 text-sm text-error hover:bg-error-container/30 transition-colors font-body">
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            Clear All
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {FILTERS.map((filter) => {
          const count = filter === 'Surahs' ? surahCount : filter === 'Ayahs' ? ayahCount : bookmarks.length;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium font-body whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ring-1 ring-outline-variant/30 dark:ring-outline-variant-dark/30'
              }`}
            >
              {filter} {filter !== 'All Bookmarks' && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Bookmark List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-[64px] text-gray-300 dark:text-gray-600 mb-4 block">bookmark_border</span>
          <h2 className="text-xl font-semibold font-body mb-2">No bookmarks yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 font-body">Start reading and bookmark your favorite verses!</p>
          <Link href="/surahs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full hover:bg-primary-600 transition-colors font-medium font-body">
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            Browse Surahs
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((bookmark) => (
            <div key={`${bookmark.surahNumber}-${bookmark.number}`} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40 hover:shadow-elevation-2 transition-all">
              <div className="flex items-start gap-4">
                {/* Book Icon */}
                <div className="w-10 h-10 rounded-full bg-primary-container dark:bg-primary-container-dark flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[20px]">book</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-semibold text-gray-900 dark:text-white">
                      {bookmark.surahName || SURAH_NAMES[bookmark.surahNumber] || `Surah ${bookmark.surahNumber}`}
                    </h3>
                    <span className="material-symbols-outlined text-primary text-[20px] fill">bookmark</span>
                  </div>

                  {bookmark.number ? (
                    <>
                      <span className="text-xs bg-primary-container dark:bg-primary-container-dark text-primary px-2 py-0.5 rounded-full font-body font-medium">
                        Surah {SURAH_NAMES[bookmark.surahNumber] || bookmark.surahNumber}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-body mt-1">Ayah {bookmark.number}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-body">
                      {bookmark.englishNameTranslation || 'The Opener'} • {bookmark.numberOfAyahs || 7} Ayahs
                    </p>
                  )}

                  {/* Arabic Preview */}
                  {bookmark.text && (
                    <div lang="ar" dir="rtl" className="text-right text-lg font-quran leading-relaxed mt-2 text-gray-800 dark:text-gray-100 line-clamp-2">
                      {bookmark.text}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/30 dark:border-outline-variant-dark/30">
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 font-body">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      Saved {bookmark.savedAt ? new Date(bookmark.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </div>
                    <Link href={`/surah/${bookmark.surahNumber}${bookmark.number ? `/${bookmark.number}` : ''}`} className="text-xs text-primary font-medium font-body hover:text-primary-600 transition-colors flex items-center gap-1">
                      {bookmark.number ? 'Go to Ayah' : 'Read'}
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

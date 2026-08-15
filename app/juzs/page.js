'use client';
import { useState } from 'react';
import Link from 'next/link';

const JUZ_DATA = [
  { juz: 1, startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141, name: 'Alif Lam Mim', progress: 100 },
  { juz: 2, startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252, name: 'Saya\'kallassu', progress: 45 },
  { juz: 3, startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92, name: 'Tilka al-Rusul', progress: 0 },
  { juz: 4, startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23, name: 'Lan Tanaalu', progress: 0 },
  { juz: 5, startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147, name: 'Wal Mohsanat', progress: 0 },
  { juz: 6, startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81, name: 'La Yuhibbullah', progress: 0 },
  { juz: 7, startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110, name: 'Wa Idh Samiu', progress: 0 },
  { juz: 8, startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87, name: 'Wa Law Annana', progress: 0 },
  { juz: 9, startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40, name: 'Qala Al-Malau', progress: 0 },
  { juz: 10, startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92, name: 'Wa\'lamu', progress: 0 },
  { juz: 11, startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5, name: "Ya'tadhirusuna", progress: 0 },
  { juz: 12, startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52, name: 'Wa Ma Min Dabbah', progress: 0 },
  { juz: 13, startSurah: 12, startAyah: 53, endSurah: 15, endAyah: 1, name: 'Wa Ma Ubbarriu', progress: 0 },
  { juz: 14, startSurah: 15, startAyah: 2, endSurah: 16, endAyah: 128, name: 'Subhanallazi', progress: 0 },
  { juz: 15, startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74, name: "Subhana'lladhi", progress: 0 },
  { juz: 16, startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135, name: 'Qala Alam', progress: 0 },
  { juz: 17, startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78, name: 'Iqtaraba', progress: 0 },
  { juz: 18, startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20, name: 'Qadda Allahu', progress: 0 },
  { juz: 19, startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55, name: 'Wa Qala Alladhina', progress: 0 },
  { juz: 20, startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45, name: "Wa'idh Qala", progress: 0 },
  { juz: 21, startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30, name: 'Utlu Ma Uhiya', progress: 0 },
  { juz: 22, startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27, name: 'Wa Man Yaqnut', progress: 0 },
  { juz: 23, startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31, name: "Wa Ma 'Alayna", progress: 0 },
  { juz: 24, startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46, name: 'Fa Man Azlamu', progress: 0 },
  { juz: 25, startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37, name: 'Ila Alladhi', progress: 0 },
  { juz: 26, startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30, name: 'Ha Mim', progress: 0 },
  { juz: 27, startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29, name: "Qala Fama Khatbukum", progress: 0 },
  { juz: 28, startSurah: 58, startAyah: 1, endSurah: 67, endAyah: 30, name: "Qadd Sami'allahu", progress: 0 },
  { juz: 29, startSurah: 67, startAyah: 31, endSurah: 78, endAyah: 1, name: "Tabaraka'lladhi", progress: 0 },
  { juz: 30, startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6, name: "Amma Yatasa'alun", progress: 0 },
];

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

export default function JuzList() {
  const [search, setSearch] = useState('');

  const filtered = JUZ_DATA.filter(j => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      j.name.toLowerCase().includes(q) ||
      String(j.juz).includes(q) ||
      SURAH_NAMES[j.startSurah]?.toLowerCase().includes(q) ||
      SURAH_NAMES[j.endSurah]?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-full ring-1 ring-outline-variant/50 dark:ring-outline-variant-dark/50 px-4 py-2.5 shadow-sm mb-6">
        <span className="material-symbols-outlined text-gray-400 text-[20px] mr-2">search</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 font-body"
          placeholder="Search for a Juz..."
        />
      </div>

      {/* Juz List */}
      <div className="space-y-3">
        {filtered.map((juz) => (
          <Link
            key={juz.juz}
            href={`/surah/${juz.startSurah}/${juz.startAyah}`}
            className="group block relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40 hover:shadow-elevation-2 hover:ring-primary/30 transition-all duration-200"
          >
            {/* Arabic text overlay */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <span lang="ar" className="text-4xl font-arabic text-primary font-bold">الجزء</span>
            </div>

            <div className="relative">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-headline-lg font-display font-bold text-primary">{juz.juz}</span>
                  <p className="text-sm font-medium font-body text-gray-900 dark:text-white mt-0.5">{juz.name}</p>
                </div>
                <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-[20px]">chevron_right</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-body mb-3">
                {SURAH_NAMES[juz.startSurah]} {juz.startAyah} → {SURAH_NAMES[juz.endSurah]} {juz.endAyah}
              </p>

              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${juz.progress}%` }} />
                </div>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 font-body min-w-[32px] text-right">{juz.progress}%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

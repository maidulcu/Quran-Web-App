'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-950" />
        <div className="container mx-auto px-4 pt-14 pb-10 sm:pt-20 sm:pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-5xl sm:text-6xl font-quran leading-snug mb-4 text-gray-800 dark:text-gray-100">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-gray-900 dark:text-white">
              Read and listen to the Holy Quran
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Explore all 114 Surahs with English translation and high‑quality audio recitations.
            </p>

            <form onSubmit={submit} className="max-w-xl mx-auto">
              <div className="flex items-stretch gap-2 bg-white dark:bg-gray-800 rounded-xl shadow ring-1 ring-gray-200 dark:ring-gray-700 p-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="flex-1 bg-transparent outline-none px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Search verses, topics, or Surah names"
                  aria-label="Search the Quran"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 active:bg-teal-800 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              114 Surahs • Arabic + English • Audio Recitation
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/surahs" className="group rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Browse Surahs</h2>
              <span className="text-teal-600 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Navigate all chapters with details and metadata.</p>
          </Link>

          <Link href="/search" className="group rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Search</h2>
              <span className="text-teal-600 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Find verses by keywords and topics.</p>
          </Link>

          <Link href="/bookmarks" className="group rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bookmarks</h2>
              <span className="text-teal-600 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Save and revisit your favorite Ayahs.</p>
          </Link>
        </div>
      </section>

      {/* Popular Surahs */}
      <section className="container mx-auto px-4 pb-16">
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Popular Surahs</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { id: 1, name: 'Al‑Fātiḥah' },
            { id: 2, name: 'Al‑Baqarah' },
            { id: 18, name: 'Al‑Kahf' },
            { id: 36, name: 'Yā‑Sīn' },
            { id: 55, name: 'Ar‑Raḥmān' },
          ].map((s) => (
            <Link
              key={s.id}
              href={`/surah/${s.id}`}
              className="rounded-lg bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 hover:shadow-md hover:ring-teal-200/80 transition"
            >
              <span className="block font-medium">{s.name}</span>
              <span className="text-gray-500 text-xs">Surah {s.id}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

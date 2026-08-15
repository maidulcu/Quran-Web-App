'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { searchQuran } from '../lib/api';

export default function Search() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    setError(null);
    try {
      const data = await searchQuran(searchQuery);
      setResults(data.data?.matches || []);
    } catch (error) {
      setError('Search failed. Please check your connection and try again.');
      setResults([]);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    performSearch(query);
  };

  useEffect(() => {
    if (initialQ.trim()) {
      performSearch(initialQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQ]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-headline-lg font-display font-semibold text-center mb-6">Search Quran</h1>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-full ring-1 ring-outline-variant/50 dark:ring-outline-variant-dark/50 px-4 py-2.5 shadow-sm">
          <span className="material-symbols-outlined text-gray-400 text-[20px] mr-2">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for verses..."
            aria-label="Search the Quran"
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 font-body"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-5 py-2 rounded-full hover:bg-primary-600 disabled:opacity-50 transition-colors text-sm font-medium font-body"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {!searched && !loading && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          <span className="material-symbols-outlined text-[64px] text-gray-300 dark:text-gray-600 mb-4 block">search</span>
          <p className="text-lg font-body">Enter a keyword to search the Quran</p>
          <p className="text-sm mt-1 font-body">Search by verse text, topic, or Surah name</p>
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-2xl animate-pulse">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-center mt-8">
          <div className="bg-error-container/30 dark:bg-error-container-dark/30 border border-error/20 rounded-2xl p-6 max-w-md mx-auto">
            <span className="material-symbols-outlined text-[32px] text-error mb-3 block">error</span>
            <p className="text-error font-body">{error}</p>
            <button onClick={() => performSearch(query)} className="mt-3 text-sm text-primary hover:text-primary-600 font-medium font-body">Try Again</button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {results.map((result, index) => (
            <Link
              key={index}
              href={`/surah/${result.surah.number}/${result.numberInSurah}`}
              className="block bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40 hover:shadow-elevation-2 transition-all"
            >
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-body">
                Surah {result.surah.englishName} ({result.surah.number}:{result.numberInSurah})
              </div>
              <div className="text-gray-700 dark:text-gray-300 font-body">
                {result.text}
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && searched && results.length === 0 && query && (
        <div className="text-center text-gray-500 mt-8">
          <span className="material-symbols-outlined text-[64px] text-gray-300 dark:text-gray-600 mb-4 block">search_off</span>
          <p className="text-lg font-body">No results found for &quot;{query}&quot;</p>
          <p className="text-sm mt-1 font-body">Try a different keyword or <Link href="/surahs" className="text-primary hover:text-primary-600">browse all surahs</Link></p>
        </div>
      )}
    </div>
  );
}

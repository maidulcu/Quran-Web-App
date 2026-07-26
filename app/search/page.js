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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Search Quran</h1>
      
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for verses..."
            aria-label="Search the Quran"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-800 dark:text-gray-100 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {!searched && !loading && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <p className="text-lg">Enter a keyword to search the Quran</p>
          <p className="text-sm mt-1">Search by verse text, topic, or Surah name</p>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg animate-pulse">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-center mt-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <svg className="w-8 h-8 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button onClick={() => performSearch(query)} className="mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium">Try Again</button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <Link
              key={index}
              href={`/surah/${result.surah.number}/${result.numberInSurah}`}
              className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Surah {result.surah.englishName} ({result.surah.number}:{result.numberInSurah})
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                {result.text}
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && searched && results.length === 0 && query && (
        <div className="text-center text-gray-500 mt-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-lg">No results found for &quot;{query}&quot;</p>
          <p className="text-sm mt-1">Try a different keyword or <Link href="/surahs" className="text-teal-600 hover:text-teal-700">browse all surahs</Link></p>
        </div>
      )}
    </div>
  );
}

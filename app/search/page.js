'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuranSearch } from '../hooks/useQuranSearch';

export default function Search() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(initialQ);
  const { results, loading, error, performSearch } = useQuranSearch();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      performSearch(inputValue);
    }
  };

  useEffect(() => {
    if (initialQ.trim()) {
      // Auto-run search when navigated with ?q=
      setInputValue(initialQ);
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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for verses..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && (
          <div className="mt-2 text-red-600 text-sm">
            {error}
          </div>
        )}
      </form>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-2">
              Surah {result.surah.englishName} ({result.surah.number}:{result.numberInSurah})
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              {result.text}
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && inputValue && !loading && (
        <div className="text-center text-gray-500 mt-8">
          No results found for "{inputValue}"
        </div>
      )}
    </div>
  );
}

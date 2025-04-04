import React, { useState, useContext, useEffect } from 'react';
import AyahItem from '../components/AyahItem';
import { SettingsContext } from '../context/SettingsContext';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editionName, setEditionName] = useState('');
  const { translation } = useContext(SettingsContext);
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarkedAyahs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookmarkedAyahs', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (ayah) => {
    setBookmarks((prev) => {
      const exists = prev.find((item) => item.number === ayah.number);
      if (exists) {
        return prev.filter((item) => item.number !== ayah.number);
      } else {
        return [...prev, ayah];
      }
    });
  };

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 1) {
      setLoading(true);
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/search/${val}/all/${translation}`);
        const data = await res.json();
        if (data.data && data.data.matches) {
          const ayahs = data.data.matches.map((match) => ({
            number: match.number,
            text: match.text,
            translation: match.text,
            surah: match.surah,
            numberInSurah: match.numberInSurah
          }));
          setResults(ayahs);
          if (data.data.matches[0]?.edition?.englishName) {
            setEditionName(data.data.matches[0].edition.englishName);
          }
        } else {
          setResults([]);
          setEditionName('');
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      }
      setLoading(false);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">🔍 Search the Quran</h2>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by keyword or phrase..."
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring focus:border-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
      />
      <div className="text-sm text-center text-teal-700 dark:text-teal-400 mt-2 mb-4 uppercase tracking-wider font-semibold">
        {editionName ? `Showing results from: ${editionName}` : ''}
      </div>
      {loading && <p className="text-center text-gray-500">Searching...</p>}
      <hr className="my-6 border-gray-300 dark:border-gray-700" />
      <div className="mt-6 space-y-4">
        {results.map((ayah) => (
          <AyahItem
            key={ayah.number}
            ayah={ayah}
            toggleBookmark={toggleBookmark}
            bookmarked={bookmarks.some((b) => b.number === ayah.number)}
          />
        ))}
        {query && results.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No results found.</p>
        )}
      </div>
    </div>
  );
}

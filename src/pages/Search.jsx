import React, { useState, useContext, useEffect } from 'react';
import AyahItem from '../components/AyahItem';
import { SettingsContext } from '../context/SettingsContext';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { translation } = useContext(SettingsContext);

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
            translation: match.text // Replace if needed
          }));
          setResults(ayahs);
        } else {
          setResults([]);
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">🔍 Search the Quran</h2>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by keyword or phrase..."
        className="w-full px-4 py-2 border rounded shadow"
      />
      {loading && <p className="text-center text-gray-500">Searching...</p>}
      <div className="mt-6 space-y-4">
        {results.map((ayah) => (
          <AyahItem key={ayah.number} ayah={ayah} />
        ))}
        {query && results.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No results found.</p>
        )}
      </div>
    </div>
  );
}

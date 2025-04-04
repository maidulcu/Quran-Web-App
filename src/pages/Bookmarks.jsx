import React, { useEffect, useState, useContext } from 'react';
import AyahItem from '../components/AyahItem';
import { SettingsContext } from '../context/SettingsContext';

export default function Bookmarks() {
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState([]);
  const { translation } = useContext(SettingsContext);

  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedAyahs');
    if (saved) {
      setBookmarkedAyahs(JSON.parse(saved));
    }
  }, []);

  const removeBookmark = (number) => {
    const updated = bookmarkedAyahs.filter(a => a.number !== number);
    setBookmarkedAyahs(updated);
    localStorage.setItem('bookmarkedAyahs', JSON.stringify(updated));
  };

  if (bookmarkedAyahs.length === 0) {
    return <div className="text-center p-6">No bookmarked Ayahs yet.</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">⭐ Your Bookmarked Ayahs</h2>
      <div className="space-y-4">
        {bookmarkedAyahs.map((ayah) => (
          <div key={ayah.number} className="relative">
            <AyahItem
              ayah={{
                ...ayah,
                translation: ayah.translation || `(${translation}) translation unavailable`
              }}
            />
            <button
              onClick={() => removeBookmark(ayah.number)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 bg-white dark:bg-gray-900 rounded-full p-1 shadow"
              title="Remove Bookmark"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">⭐ Your Bookmarked Ayahs</h2>
      <div className="space-y-4">
        {bookmarkedAyahs.map((ayah) => (
          <div key={ayah.number} className="relative">
            <AyahItem ayah={{
              ...ayah,
              translation: ayah.translation || `(${translation}) translation unavailable`
            }} />
            <button
              onClick={() => removeBookmark(ayah.number)}
              className="absolute top-2 right-2 text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

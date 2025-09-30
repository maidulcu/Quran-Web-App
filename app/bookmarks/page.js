'use client';
import { useState, useEffect } from 'react';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedAyahs');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const removeBookmark = (ayahNumber) => {
    const updated = bookmarks.filter(b => b.number !== ayahNumber);
    setBookmarks(updated);
    localStorage.setItem('bookmarkedAyahs', JSON.stringify(updated));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Bookmarked Verses</h1>
      
      {bookmarks.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No bookmarked verses yet.</p>
          <p className="mt-2">Start reading and bookmark your favorite verses!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.number} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="text-sm text-gray-500">
                  Surah {bookmark.surahNumber}:{bookmark.number}
                </div>
                <button
                  onClick={() => removeBookmark(bookmark.number)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="text-right text-2xl font-quran leading-loose mb-4">
                {bookmark.text}
              </div>
              {bookmark.translationText && (
                <div className="text-gray-700 dark:text-gray-300">
                  {bookmark.translationText}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
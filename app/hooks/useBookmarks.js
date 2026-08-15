'use client';
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';

const BOOKMARKS_KEY = 'bookmarkedAyahs';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage.get(BOOKMARKS_KEY).then(saved => {
      if (saved) {
        const parsed = JSON.parse(saved);
        setBookmarks(Array.isArray(parsed) ? parsed : []);
      }
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const saveToStorage = useCallback((newBookmarks) => {
    storage.set(BOOKMARKS_KEY, JSON.stringify(newBookmarks)).catch(() => {});
  }, []);

  const isBookmarked = useCallback((surahNumber, ayahNumber) => {
    return bookmarks.some(b => b.surahNumber === surahNumber && b.number === ayahNumber);
  }, [bookmarks]);

  const addBookmark = useCallback((ayah) => {
    setBookmarks(prev => {
      if (prev.some(b => b.surahNumber === ayah.surahNumber && b.number === ayah.number)) return prev;
      const newBookmarks = [...prev, ayah];
      saveToStorage(newBookmarks);
      return newBookmarks;
    });
  }, [saveToStorage]);

  const removeBookmark = useCallback((surahNumber, ayahNumber) => {
    setBookmarks(prev => {
      const newBookmarks = prev.filter(b => !(b.surahNumber === surahNumber && b.number === ayahNumber));
      saveToStorage(newBookmarks);
      return newBookmarks;
    });
  }, [saveToStorage]);

  const toggleBookmark = useCallback((ayah) => {
    if (isBookmarked(ayah.surahNumber, ayah.number)) {
      removeBookmark(ayah.surahNumber, ayah.number);
      return false;
    } else {
      addBookmark(ayah);
      return true;
    }
  }, [isBookmarked, addBookmark, removeBookmark]);

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
    saveToStorage([]);
  }, [saveToStorage]);

  return { bookmarks, isLoading, isBookmarked, addBookmark, removeBookmark, toggleBookmark, clearBookmarks, count: bookmarks.length };
}

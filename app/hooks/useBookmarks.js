'use client';
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage bookmarked ayahs
 * Provides centralized bookmark state management with localStorage persistence
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bookmarkedAyahs');
      if (saved) {
        const parsed = JSON.parse(saved);
        setBookmarks(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setBookmarks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  const saveToLocalStorage = useCallback((newBookmarks) => {
    try {
      localStorage.setItem('bookmarkedAyahs', JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  }, []);

  // Check if an ayah is bookmarked
  const isBookmarked = useCallback((surahNumber, ayahNumber) => {
    return bookmarks.some(
      (b) => b.surahNumber === surahNumber && b.number === ayahNumber
    );
  }, [bookmarks]);

  // Add a bookmark
  const addBookmark = useCallback((ayah) => {
    setBookmarks((prev) => {
      // Prevent duplicates
      if (prev.some((b) => b.surahNumber === ayah.surahNumber && b.number === ayah.number)) {
        return prev;
      }
      const newBookmarks = [...prev, ayah];
      saveToLocalStorage(newBookmarks);
      return newBookmarks;
    });
  }, [saveToLocalStorage]);

  // Remove a bookmark
  const removeBookmark = useCallback((surahNumber, ayahNumber) => {
    setBookmarks((prev) => {
      const newBookmarks = prev.filter(
        (b) => !(b.surahNumber === surahNumber && b.number === ayahNumber)
      );
      saveToLocalStorage(newBookmarks);
      return newBookmarks;
    });
  }, [saveToLocalStorage]);

  // Toggle bookmark status
  const toggleBookmark = useCallback((ayah) => {
    if (isBookmarked(ayah.surahNumber, ayah.number)) {
      removeBookmark(ayah.surahNumber, ayah.number);
      return false;
    } else {
      addBookmark(ayah);
      return true;
    }
  }, [isBookmarked, addBookmark, removeBookmark]);

  // Clear all bookmarks
  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
    saveToLocalStorage([]);
  }, [saveToLocalStorage]);

  // Get bookmark count
  const count = bookmarks.length;

  return {
    bookmarks,
    isLoading,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearBookmarks,
    count
  };
}

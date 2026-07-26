'use client';
import { useState, useEffect, useCallback } from 'react';

const LAST_READ_PAGE_KEY = 'lastReadPage';

export function useLastReadPage() {
  const [lastReadPage, setLastReadPage] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LAST_READ_PAGE_KEY);
      if (saved) setLastReadPage(JSON.parse(saved));
    } catch {}
  }, []);

  const saveLastReadPage = useCallback((pageNumber) => {
    const data = { pageNumber, timestamp: Date.now() };
    try {
      localStorage.setItem(LAST_READ_PAGE_KEY, JSON.stringify(data));
      setLastReadPage(data);
    } catch {}
  }, []);

  const clearLastReadPage = useCallback(() => {
    try {
      localStorage.removeItem(LAST_READ_PAGE_KEY);
      setLastReadPage(null);
    } catch {}
  }, []);

  return { lastReadPage, saveLastReadPage, clearLastReadPage };
}

'use client';
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';

const LAST_READ_PAGE_KEY = 'lastReadPage';

export function useLastReadPage() {
  const [lastReadPage, setLastReadPage] = useState(null);

  useEffect(() => {
    storage.get(LAST_READ_PAGE_KEY).then(saved => {
      if (saved) setLastReadPage(JSON.parse(saved));
    }).catch(() => {});
  }, []);

  const saveLastReadPage = useCallback((pageNumber) => {
    const data = { pageNumber, timestamp: Date.now() };
    storage.set(LAST_READ_PAGE_KEY, JSON.stringify(data)).then(() => {
      setLastReadPage(data);
    }).catch(() => {});
  }, []);

  const clearLastReadPage = useCallback(() => {
    storage.remove(LAST_READ_PAGE_KEY).then(() => {
      setLastReadPage(null);
    }).catch(() => {});
  }, []);

  return { lastReadPage, saveLastReadPage, clearLastReadPage };
}

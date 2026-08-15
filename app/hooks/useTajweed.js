'use client';
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';

const TAJWEED_KEY = 'tajweedEnabled';

export function useTajweed() {
  const [tajweedEnabled, setTajweedEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage.get(TAJWEED_KEY).then(stored => {
      if (stored === 'true') setTajweedEnabled(true);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const toggleTajweed = useCallback(() => {
    setTajweedEnabled(prev => {
      const next = !prev;
      storage.set(TAJWEED_KEY, next ? 'true' : 'false').catch(() => {});
      return next;
    });
  }, []);

  return { tajweedEnabled, isLoading, toggleTajweed };
}

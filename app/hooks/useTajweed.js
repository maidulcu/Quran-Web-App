'use client';
import { useState, useEffect, useCallback } from 'react';

const TAJWEED_KEY = 'tajweedEnabled';

export function useTajweed() {
  const [tajweedEnabled, setTajweedEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TAJWEED_KEY);
      if (stored === 'true') setTajweedEnabled(true);
    } catch {}
    setIsLoading(false);
  }, []);

  const toggleTajweed = useCallback(() => {
    setTajweedEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem(TAJWEED_KEY, next ? 'true' : 'false');
      } catch {}
      return next;
    });
  }, []);

  return { tajweedEnabled, isLoading, toggleTajweed };
}

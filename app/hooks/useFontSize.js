'use client';
import { useState, useEffect, useCallback } from 'react';

const SIZE_KEY = 'quranFontSize';
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const DEFAULT = 1; // M

export function useFontSize() {
  const [level, setLevel] = useState(DEFAULT);

  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem(SIZE_KEY), 10);
      if (!isNaN(stored) && stored >= 0 && stored < SIZES.length) {
        setLevel(stored);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const cls = `font-size-${SIZES[level].toLowerCase()}`;
    const prev = SIZES.map(s => `font-size-${s.toLowerCase()}`);
    document.documentElement.classList.remove(...prev);
    document.documentElement.classList.add(cls);
    return () => document.documentElement.classList.remove(cls);
  }, [level]);

  const increase = useCallback(() => {
    setLevel(prev => {
      const next = Math.min(prev + 1, SIZES.length - 1);
      localStorage.setItem(SIZE_KEY, next);
      return next;
    });
  }, []);

  const decrease = useCallback(() => {
    setLevel(prev => {
      const next = Math.max(prev - 1, 0);
      localStorage.setItem(SIZE_KEY, next);
      return next;
    });
  }, []);

  return {
    level,
    label: SIZES[level],
    increase,
    decrease,
    canIncrease: level < SIZES.length - 1,
    canDecrease: level > 0,
  };
}

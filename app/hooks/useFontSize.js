'use client';
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';

const SIZE_KEY = 'quranFontSize';
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const DEFAULT = 1;

export function useFontSize() {
  const [level, setLevel] = useState(DEFAULT);

  useEffect(() => {
    storage.get(SIZE_KEY).then(stored => {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < SIZES.length) setLevel(parsed);
    }).catch(() => {});
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
      storage.set(SIZE_KEY, String(next)).catch(() => {});
      return next;
    });
  }, []);

  const decrease = useCallback(() => {
    setLevel(prev => {
      const next = Math.max(prev - 1, 0);
      storage.set(SIZE_KEY, String(next)).catch(() => {});
      return next;
    });
  }, []);

  return { level, label: SIZES[level], increase, decrease, canIncrease: level < SIZES.length - 1, canDecrease: level > 0 };
}

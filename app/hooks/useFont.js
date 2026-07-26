'use client';
import { useState, useEffect, useCallback } from 'react';

const FONT_KEY = 'quranFont';

export function useFont() {
  const [font, setFont] = useState('Uthmanic');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FONT_KEY);
      if (stored === 'IndoPak' || stored === 'Uthmanic') {
        setFont(stored);
      }
    } catch {}
  }, []);

  const toggleFont = useCallback(() => {
    setFont(prev => {
      const next = prev === 'Uthmanic' ? 'IndoPak' : 'Uthmanic';
      localStorage.setItem(FONT_KEY, next);
      return next;
    });
  }, []);

  const fontClass = font === 'IndoPak' ? 'font-indopak' : 'font-quran';

  return { font, fontClass, toggleFont };
}

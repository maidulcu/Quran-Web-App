'use client';
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';

const FONT_KEY = 'quranFont';

export function useFont() {
  const [font, setFont] = useState('Uthmanic');

  useEffect(() => {
    storage.get(FONT_KEY).then(stored => {
      if (stored === 'IndoPak' || stored === 'Uthmanic') setFont(stored);
    }).catch(() => {});
  }, []);

  const toggleFont = useCallback(() => {
    setFont(prev => {
      const next = prev === 'Uthmanic' ? 'IndoPak' : 'Uthmanic';
      storage.set(FONT_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const fontClass = font === 'IndoPak' ? 'font-indopak' : 'font-quran';

  return { font, fontClass, toggleFont };
}

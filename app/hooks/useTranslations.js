'use client';
import { useState, useEffect, useCallback } from 'react';
import { TRANSLATION_EDITIONS, DEFAULT_TRANSLATION } from '../lib/api';

const KEY = 'selectedTranslations';

export function useTranslations() {
  const [selected, setSelected] = useState(() => [DEFAULT_TRANSLATION]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelected(parsed);
        }
      }
    } catch {}
  }, []);

  const setTranslations = useCallback((ids) => {
    const next = ids.length > 0 ? ids : [DEFAULT_TRANSLATION];
    setSelected(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const toggleTranslation = useCallback((id) => {
    setSelected(prev => {
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id];
      if (next.length === 0) next.push(DEFAULT_TRANSLATION);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const available = TRANSLATION_EDITIONS;

  return { selected, setTranslations, toggleTranslation, available };
}

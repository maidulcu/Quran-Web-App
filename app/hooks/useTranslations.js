'use client';
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';
import { TRANSLATION_EDITIONS, DEFAULT_TRANSLATION } from '../lib/api';

const KEY = 'selectedTranslations';

export function useTranslations() {
  const [selected, setSelected] = useState(() => [DEFAULT_TRANSLATION]);

  useEffect(() => {
    storage.get(KEY).then(saved => {
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setSelected(parsed);
      }
    }).catch(() => {});
  }, []);

  const setTranslations = useCallback((ids) => {
    const next = ids.length > 0 ? ids : [DEFAULT_TRANSLATION];
    setSelected(next);
    storage.set(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const toggleTranslation = useCallback((id) => {
    setSelected(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      if (next.length === 0) next.push(DEFAULT_TRANSLATION);
      storage.set(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return { selected, setTranslations, toggleTranslation, available: TRANSLATION_EDITIONS };
}

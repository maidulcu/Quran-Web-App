'use client';
import { useState, useEffect, useCallback } from 'react';

const TASFSIR_KEY = 'tafsirSettings';
const DEFAULT_EDITION = 'ar.jalalayn';

export function useTafsir() {
  const [tafsirEnabled, setTafsirEnabled] = useState(false);
  const [tafsirEdition, setTafsirEdition] = useState(DEFAULT_EDITION);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TASFSIR_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.enabled === 'boolean') setTafsirEnabled(parsed.enabled);
        if (typeof parsed.edition === 'string') setTafsirEdition(parsed.edition);
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const save = useCallback((enabled, edition) => {
    try {
      localStorage.setItem(TASFSIR_KEY, JSON.stringify({ enabled, edition }));
    } catch {}
  }, []);

  const toggleTafsir = useCallback(() => {
    setTafsirEnabled(prev => {
      const next = !prev;
      save(next, tafsirEdition);
      return next;
    });
  }, [tafsirEdition, save]);

  const selectEdition = useCallback((edition) => {
    setTafsirEdition(edition);
    save(tafsirEnabled, edition);
  }, [tafsirEnabled, save]);

  return {
    tafsirEnabled,
    tafsirEdition,
    isLoading,
    toggleTafsir,
    selectEdition,
  };
}

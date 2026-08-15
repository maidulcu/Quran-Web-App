'use client';
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';
import { getWordByWord } from '../lib/api';

const WBW_KEY = 'wordByWordEnabled';

export function useWordByWord() {
  const [enabled, setEnabled] = useState(false);
  const [wordData, setWordData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    storage.get(WBW_KEY).then(stored => {
      if (stored === 'true') setEnabled(true);
    }).catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    setEnabled(prev => {
      const next = !prev;
      storage.set(WBW_KEY, next ? 'true' : 'false').catch(() => {});
      return next;
    });
  }, []);

  const fetchWords = useCallback(async (surahId, ayahNumber) => {
    const key = `${surahId}:${ayahNumber}`;
    if (wordData[key]) return wordData[key];
    try {
      setLoading(true);
      const words = await getWordByWord(surahId, ayahNumber);
      setWordData(prev => ({ ...prev, [key]: words }));
      return words;
    } catch { return []; }
    finally { setLoading(false); }
  }, [wordData]);

  return { enabled, toggle, fetchWords, wordData, loading };
}

'use client';
import { useState, useEffect, useCallback } from 'react';

const PROGRESS_KEY = 'readingProgress';

function loadProgress() {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  } catch {}
}

export function useReadingProgress() {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const markAyahRead = useCallback((surahNumber, ayahNumber, totalAyahs) => {
    const surahKey = String(surahNumber);
    setProgress(prev => {
      const current = prev[surahKey];
      const maxAyahRead = current ? Math.max(current.maxAyahRead, ayahNumber) : ayahNumber;
      const newEntry = { maxAyahRead, totalAyahs, lastRead: Date.now() };

      if (current && current.maxAyahRead === maxAyahRead && current.totalAyahs === totalAyahs) {
        return prev;
      }

      const next = { ...prev, [surahKey]: newEntry };
      saveProgress(next);
      return next;
    });
  }, []);

  const getSurahProgress = useCallback((surahNumber) => {
    const entry = progress[String(surahNumber)];
    if (!entry) return { read: 0, total: 0, percent: 0, completed: false };
    const percent = Math.round((entry.maxAyahRead / entry.totalAyahs) * 100);
    return {
      read: entry.maxAyahRead,
      total: entry.totalAyahs,
      percent,
      completed: entry.maxAyahRead >= entry.totalAyahs,
      lastRead: entry.lastRead,
    };
  }, [progress]);

  const getOverallProgress = useCallback(() => {
    const entries = Object.entries(progress);
    const totalRead = entries.reduce((sum, [, v]) => sum + v.maxAyahRead, 0);
    const totalAyahs = entries.reduce((sum, [, v]) => sum + v.totalAyahs, 0);
    const completedSurahs = entries.filter(([, v]) => v.maxAyahRead >= v.totalAyahs).length;
    return {
      totalRead,
      totalAyahs,
      percent: totalAyahs > 0 ? Math.round((totalRead / totalAyahs) * 100) : 0,
      completedSurahs,
      totalSurahsStarted: entries.length,
    };
  }, [progress]);

  const getRecentlyRead = useCallback((limit = 10) => {
    return Object.entries(progress)
      .filter(([, v]) => v.lastRead)
      .sort(([, a], [, b]) => (b.lastRead || 0) - (a.lastRead || 0))
      .slice(0, limit)
      .map(([surahNumber, v]) => ({
        surahNumber: Number(surahNumber),
        ...v,
      }));
  }, [progress]);

  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(PROGRESS_KEY);
      setProgress({});
    } catch {}
  }, []);

  return {
    progress,
    markAyahRead,
    getSurahProgress,
    getOverallProgress,
    getRecentlyRead,
    clearProgress,
  };
}

'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { storage } from '../lib/storage';
import { cacheAudio, removeAudio, getAllAudioKeys, getAudioBlob } from '../lib/audioCache';

const STORE_KEY = 'offlineAudioSurahs';

export function useOfflineAudio() {
  const [downloaded, setDownloaded] = useState(() => []);
  const [progress, setProgress] = useState({});
  const [busy, setBusy] = useState({});
  const activeRef = useRef({});

  useEffect(() => {
    storage.get(STORE_KEY).then(raw => {
      if (raw) setDownloaded(JSON.parse(raw));
    }).catch(() => {});
  }, []);

  const persist = useCallback((next) => {
    setDownloaded(next);
    storage.set(STORE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const isDownloaded = useCallback((n) => downloaded.includes(n), [downloaded]);

  const audioUrlsForSurah = useCallback(async (surahId) => {
    const res = await fetch(`/data/surah/${surahId}/ar.alafasy.json`);
    if (!res.ok) return [];
    const json = await res.json();
    return (json?.data?.ayahs || []).map(a => a.audio).filter(Boolean);
  }, []);

  const downloadSurah = useCallback(async (surahId, concurrency = 3) => {
    if (activeRef.current[surahId]) return;
    activeRef.current[surahId] = true;
    setBusy(b => ({ ...b, [surahId]: true }));
    setProgress(p => ({ ...p, [surahId]: { done: 0, total: 0 } }));
    try {
      const urls = await audioUrlsForSurah(surahId);
      setProgress(p => ({ ...p, [surahId]: { done: 0, total: urls.length } }));
      let i = 0, done = 0;
      const worker = async () => {
        while (i < urls.length) { const url = urls[i++]; await cacheAudio(url); done++; setProgress(p => ({ ...p, [surahId]: { done, total: urls.length } })); }
      };
      await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, worker));
      persist(Array.from(new Set([...downloaded, surahId])));
    } catch {} finally {
      activeRef.current[surahId] = false;
      setBusy(b => ({ ...b, [surahId]: false }));
    }
  }, [audioUrlsForSurah, downloaded, persist]);

  const removeSurah = useCallback(async (surahId) => {
    const urls = await audioUrlsForSurah(surahId);
    await Promise.all(urls.map(u => removeAudio(u)));
    persist(downloaded.filter(n => n !== surahId));
    setProgress(p => { const next = { ...p }; delete next[surahId]; return next; });
  }, [audioUrlsForSurah, downloaded, persist]);

  const getStats = useCallback(async () => {
    const keys = await getAllAudioKeys();
    let bytes = 0;
    for (const k of keys) { const blob = await getAudioBlob(k); if (blob) bytes += blob.size || 0; }
    return { count: keys.length, bytes };
  }, []);

  return { downloaded, isDownloaded, downloadSurah, removeSurah, progress, busy, getStats };
}

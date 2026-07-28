'use client';
import { useState, useEffect, useCallback } from 'react';

const NOTES_KEY = 'quranNotes';

export function useNotes() {
  const [notes, setNotes] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTES_KEY);
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  const persist = useCallback((next) => {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const getNote = useCallback((surah, ayah) => {
    return notes[`${surah}:${ayah}`] || null;
  }, [notes]);

  const saveNote = useCallback((surah, ayah, text) => {
    const key = `${surah}:${ayah}`;
    const now = Date.now();
    setNotes(prev => {
      const existing = prev[key];
      const next = {
        ...prev,
        [key]: {
          text,
          createdAt: existing?.createdAt || now,
          updatedAt: now,
        },
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const deleteNote = useCallback((surah, ayah) => {
    const key = `${surah}:${ayah}`;
    setNotes(prev => {
      const next = { ...prev };
      delete next[key];
      persist(next);
      return next;
    });
  }, [persist]);

  const allNotes = Object.entries(notes)
    .map(([key, val]) => {
      const [surah, ayah] = key.split(':').map(Number);
      return { surah, ayah, ...val };
    })
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const count = allNotes.length;

  return { notes, loaded, getNote, saveNote, deleteNote, allNotes, count };
}

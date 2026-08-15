'use client';

/**
 * Offline audio cache.
 *
 * Downloads recitation mp3s and stores the blobs in IndexedDB so a surah
 * (or individual ayahs) can be played with no network connection. Once an
 * ayah is played online it is also cached automatically, so anything the
 * user has listened to keeps working offline.
 */

import { getAudioBlob, putAudioBlob, deleteAudioBlob } from './offlineStore';

// Keep object URLs alive for the lifetime of the session.
const objectUrlCache = new Map();

export async function getLocalAudioUrl(url) {
  if (!url || typeof window === 'undefined') return null;
  const blob = await getAudioBlob(url);
  if (!blob) return null;
  if (!objectUrlCache.has(url)) {
    objectUrlCache.set(url, URL.createObjectURL(blob));
  }
  return objectUrlCache.get(url);
}

export async function cacheAudio(url) {
  if (!url || typeof window === 'undefined') return;
  const existing = await getAudioBlob(url);
  if (existing) return; // already cached
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const blob = await res.blob();
    await putAudioBlob(url, blob);
  } catch {
    /* offline or failed — skip */
  }
}

export async function removeAudio(url) {
  if (!url) return;
  objectUrlCache.delete(url);
  await deleteAudioBlob(url);
}

export async function isAudioCached(url) {
  if (!url) return false;
  return !!(await getAudioBlob(url));
}

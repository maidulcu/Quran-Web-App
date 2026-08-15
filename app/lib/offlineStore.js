'use client';

/**
 * Persistent offline store for the Quran app.
 *
 * - Caches network API responses in IndexedDB so once a surah / tafsir /
 *   translation is viewed it stays available offline across app restarts.
 * - Supports reading pre-baked static JSON that ships inside the APK
 *   (see scripts/build-offline-data.mjs) so the core dataset works offline
 *   from the very first launch.
 *
 * SSR-safe: every method is a no-op on the server (returns undefined / false)
 * so it can be imported from client components without breaking `next build`.
 */

const DB_NAME = 'quran-offline';
const STORE = 'cache';
const AUDIO_STORE = 'audio';
const DB_VERSION = 1;

let dbPromise = null;

function getDB() {
  if (typeof window === 'undefined' || !window.indexedDB) return null;
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

// ── Audio blob store (persists downloaded recitation mp3s) ────────────────

export async function getAudioBlob(key) {
  const db = await getDB();
  if (!db) return undefined;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(AUDIO_STORE, 'readonly');
      const req = tx.objectStore(AUDIO_STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(undefined);
    } catch {
      resolve(undefined);
    }
  });
}

export async function putAudioBlob(key, blob) {
  const db = await getDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(AUDIO_STORE, 'readwrite');
      tx.objectStore(AUDIO_STORE).put(blob, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function deleteAudioBlob(key) {
  const db = await getDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(AUDIO_STORE, 'readwrite');
      tx.objectStore(AUDIO_STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function getAllAudioKeys() {
  const db = await getDB();
  if (!db) return [];
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(AUDIO_STORE, 'readonly');
      const req = tx.objectStore(AUDIO_STORE).getAllKeys();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

export async function idbGet(key) {
  const db = await getDB();
  if (!db) return undefined;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(undefined);
    } catch {
      resolve(undefined);
    }
  });
}

export async function idbSet(key, value) {
  const db = await getDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function idbDelete(key) {
  const db = await getDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function idbClear() {
  const db = await getDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Fetch JSON with a local-first strategy:
 *   1. If `bundledPath` is provided, try the pre-baked static asset (ships in APK).
 *   2. Else / on miss, read from the persistent IndexedDB cache.
 *   3. Else fall back to the network and persist the result.
 *
 * @param {string} url           - The remote API URL (also used as the cache key).
 * @param {object} [options]
 * @param {string} [options.bundledPath] - Same-origin path to a baked JSON file.
 * @param {number} [options.ttl]  - Cache lifetime in ms. Use -1 to never expire.
 * @param {boolean} [options.persist] - Persist network responses to IndexedDB.
 * @param {object} [options.fetchOptions] - Extra options forwarded to fetch().
 * @returns {Promise<any>}
 */
export async function fetchJson(url, options = {}) {
  const { bundledPath, ttl = 1000 * 60 * 60 * 24, persist = true, fetchOptions = {} } = options;
  const isBrowser = typeof window !== 'undefined';

  // 1. Pre-baked asset (always fresh, works fully offline from first launch).
  if (bundledPath && isBrowser) {
    try {
      const res = await fetch(bundledPath);
      if (res.ok) {
        const data = await res.json();
        if (persist) idbSet(url, { data, timestamp: Date.now() });
        return data;
      }
    } catch {
      /* fall through to cache / network */
    }
  }

  // 2. Persistent cache.
  if (persist && isBrowser) {
    const cached = await idbGet(url);
    if (cached && (ttl === -1 || Date.now() - cached.timestamp < ttl)) {
      return cached.data;
    }
  }

  // 3. Network.
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    // Serve stale cache if we have it, so the app still works offline.
    if (persist && isBrowser) {
      const cached = await idbGet(url);
      if (cached) return cached.data;
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (persist && isBrowser) idbSet(url, { data, timestamp: Date.now() });
  return data;
}

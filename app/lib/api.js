/**
 * Centralized API service for Quran API calls.
 *
 * Local-first strategy (see app/lib/offlineStore.js):
 *   1. In-memory cache for instant repeat reads within a session.
 *   2. Pre-baked static JSON that ships inside the APK (bundledPath).
 *   3. Persistent IndexedDB cache (survives restarts / works offline).
 *   4. Network fallback that persists the result for next time.
 */

import { fetchJson, idbClear, idbDelete, idbSet } from './offlineStore';

const API_BASE_URL = 'https://api.alquran.cloud/v1';
const EXTERNAL_API_BASE = 'https://api.alquran.cloud/v1';
const QURAN_COM_BASE = 'https://api.quran.com/api/v4';

const CACHE_TTL = 1000 * 60 * 60 * 24; // 24h
const NO_EXPIRE = -1;

// Session-level fast cache (cleared on reload, backed by IndexedDB).
const memoryCache = new Map();

async function apiFetch(url, options = {}) {
  if (memoryCache.has(url)) return memoryCache.get(url);
  const data = await fetchJson(url, { ttl: CACHE_TTL, ...options });
  memoryCache.set(url, data);
  return data;
}

/**
 * Get list of all surahs (pre-baked in the APK).
 */
export async function getSurahs() {
  return apiFetch(`${API_BASE_URL}/surah`, { bundledPath: '/data/surahs.json', ttl: NO_EXPIRE });
}

/**
 * Get a specific surah by ID with translation.
 * @param {number} surahId - The surah number (1-114)
 * @param {string} edition - Edition identifier (default: 'en.asad')
 */
export async function getSurah(surahId, edition = 'en.asad') {
  return apiFetch(`${API_BASE_URL}/surah/${surahId}/${edition}`, {
    bundledPath: `/data/surah/${surahId}/${edition}.json`,
  });
}

/**
 * Get multiple editions of a surah.
 * Each edition is fetched (and cached) independently so offline support is
 * granular: bundled editions work from first launch, others cache on view.
 * @param {number} surahId - The surah number (1-114)
 * @param {string[]} editions - Array of edition identifiers
 */
export async function getSurahMultipleEditions(surahId, editions = ['ar.alafasy', 'en.asad']) {
  const results = await Promise.all(
    editions.map((ed) =>
      apiFetch(`${API_BASE_URL}/surah/${surahId}/${ed}`, {
        bundledPath: `/data/surah/${surahId}/${ed}.json`,
      })
    )
  );
  return { data: results.map((r) => r.data) };
}

/**
 * Get a specific ayah.
 * @param {number} surahId - The surah number (1-114)
 * @param {number} ayahNumber - The ayah number within the surah
 * @param {string} edition - Edition identifier (default: 'en.asad')
 */
export async function getAyah(surahId, ayahNumber, edition = 'en.asad') {
  return apiFetch(`${API_BASE_URL}/ayah/${surahId}:${ayahNumber}/${edition}`);
}

/**
 * Get multiple editions of an ayah.
 * @param {number} surahId - The surah number (1-114)
 * @param {number} ayahNumber - The ayah number within the surah
 * @param {string[]} editions - Array of edition identifiers
 */
export async function getAyahMultipleEditions(surahId, ayahNumber, editions = ['ar.alafasy', 'en.asad']) {
  const results = await Promise.all(
    editions.map((ed) => apiFetch(`${API_BASE_URL}/ayah/${surahId}:${ayahNumber}/${ed}`))
  );
  return { data: results.map((r) => r.data) };
}

/**
 * Search the Quran
 * @param {string} query - Search term
 * @param {string} surah - Optional: limit search to specific surah (default: 'all')
 * @param {string} edition - Edition identifier (default: 'en')
 */
export async function searchQuran(query, surah = 'all', edition = 'en') {
  if (!query || query.trim() === '') {
    return { data: { matches: [] } };
  }
  return apiFetch(`${API_BASE_URL}/search/${encodeURIComponent(query)}/${surah}/${edition}`);
}

/**
 * Get available editions/translations
 */
export async function getEditions() {
  return apiFetch(`${API_BASE_URL}/edition`);
}

/**
 * Get editions by language
 * @param {string} language - Language code (e.g., 'en', 'ar', 'ur')
 */
export async function getEditionsByLanguage(language) {
  return apiFetch(`${API_BASE_URL}/edition/language/${language}`);
}

/**
 * Get editions by format
 * @param {string} format - Format type (e.g., 'text', 'audio')
 */
export async function getEditionsByFormat(format) {
  return apiFetch(`${API_BASE_URL}/edition/format/${format}`);
}

/**
 * Clear the entire cache (memory + persistent IndexedDB).
 */
export async function clearCache() {
  memoryCache.clear();
  await idbClear();
}

/**
 * Clear a specific cache entry.
 * @param {string} key - Cache key (the API URL) to clear.
 */
export async function clearCacheEntry(key) {
  memoryCache.delete(key);
  await idbDelete(key);
}

/**
 * Get cache statistics.
 */
export function getCacheStats() {
  return {
    memorySize: memoryCache.size,
    memoryKeys: Array.from(memoryCache.keys()),
  };
}

// ── Tafsir ──────────────────────────────────────────────────────────────

export const TAFSIR_EDITIONS = [
  { id: 'ar.jalalayn', name: 'Tafsir al-Jalalayn', language: 'ar', source: 'alquran', description: 'Classical concise tafsir by al-Mahalli and al-Suyuti' },
  { id: 'ar.muyassar', name: 'Tafsir al-Muyassar', language: 'ar', source: 'alquran', description: 'Simplified modern Arabic tafsir' },
  { id: 'ar.qurtubi', name: 'Tafsir al-Qurtubi', language: 'ar', source: 'alquran', description: 'Comprehensive classical tafsir' },
  { id: 'en.ibnKathir', name: 'Tafsir Ibn Kathir', language: 'en', source: 'qurancom', tafsirId: 169, description: 'Most popular English tafsir by Ibn Kathir' },
  { id: 'en.maarif', name: "Ma'arif al-Qur'an", language: 'en', source: 'qurancom', tafsirId: 168, description: 'By Mufti Muhammad Shafi' },
];

export function getTafsirEdition(identifier) {
  return TAFSIR_EDITIONS.find((e) => e.id === identifier);
}

/**
 * Fetch tafsir for an entire surah from AlQuran Cloud (Arabic tafsirs).
 * Returns an object keyed by ayah number: { 1: tafsirHtml, 2: tafsirHtml, ... }
 */
export async function getAlQuranCloudTafsir(surahId, editionId) {
  const data = await apiFetch(`${API_BASE_URL}/surah/${surahId}/${editionId}`, {
    bundledPath: `/data/tafsir/${surahId}/${editionId}.json`,
    ttl: NO_EXPIRE,
  });
  const ayahs = data?.data?.ayahs || [];
  const result = {};
  ayahs.forEach((a) => {
    // Wrap plain text in <p> with RTL for proper rendering via dangerouslySetInnerHTML
    const escaped = a.text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    result[a.numberInSurah] = `<p lang="ar" dir="rtl" class="text-right font-quran text-lg leading-loose">${escaped}</p>`;
  });
  return result;
}

/**
 * Fetch tafsir for an entire surah from Quran.com (English tafsirs).
 * Returns an object keyed by ayah number: { 1: tafsirHtml, 2: tafsirHtml, ... }
 */
export async function getQuranComTafsir(surahId, tafsirId) {
  const data = await apiFetch(`${QURAN_COM_BASE}/tafsirs/${tafsirId}/by_chapter/${surahId}`);
  const tafsirs = data?.tafsirs || [];
  const result = {};
  tafsirs.forEach((t) => {
    const verseNum = Number(t.verse_key.split(':')[1]);
    if (t.text && t.text.trim()) {
      result[verseNum] = t.text;
    }
  });
  return result;
}

/**
 * Unified fetch: get tafsir map for any edition
 */
export async function getTafsirForSurah(surahId, editionId) {
  const edition = getTafsirEdition(editionId);
  if (!edition) return {};
  if (edition.source === 'qurancom') {
    return getQuranComTafsir(surahId, edition.tafsirId);
  }
  return getAlQuranCloudTafsir(surahId, editionId);
}

// ── Translations ────────────────────────────────────────────────────────

export const TRANSLATION_EDITIONS = [
  { id: 'en.sahih', name: 'Saheeh International', shortName: 'Sahih Intl.' },
  { id: 'en.yusufali', name: 'Abdullah Yusuf Ali', shortName: 'Yusuf Ali' },
  { id: 'en.asad', name: 'Muhammad Asad', shortName: 'Asad' },
  { id: 'en.pickthall', name: 'Marmaduke Pickthall', shortName: 'Pickthall' },
  { id: 'en.hilali', name: 'Hilali & Khan', shortName: 'Hilali' },
];

export const DEFAULT_TRANSLATION = 'en.sahih';

// ── Word-by-Word Translation ────────────────────────────────────────────

/**
 * Fetch word-by-word translations for an ayah from Quran.com
 * @param {number} surahId - Surah number
 * @param {number} ayahNumber - Ayah number
 * @returns {Promise<Array>} Array of word objects with text, translation, transliteration
 */
export async function getWordByWord(surahId, ayahNumber) {
  const data = await apiFetch(
    `${QURAN_COM_BASE}/verses/by_key/${surahId}:${ayahNumber}?words=true&translation_id=131`
  );
  const words = data?.verse?.words || [];
  return words
    .filter((w) => w.char_type_name === 'word')
    .map((w) => ({
      text: w.text,
      translation: w.translation?.text?.trim() || '',
      transliteration: w.transliteration?.text?.trim() || '',
    }));
}

// ── Tajweed ─────────────────────────────────────────────────────────────

/**
 * Get tajweed-colored Arabic text for a surah
 * @param {number} surahId - The surah number (1-114)
 * @returns {Promise<Object>} Map of ayahNumber -> tajweed text with markup
 */
export async function getSurahTajweed(surahId) {
  const data = await apiFetch(`${API_BASE_URL}/surah/${surahId}/quran-tajweed`, {
    bundledPath: `/data/surah/${surahId}/quran-tajweed.json`,
  });
  const ayahs = data?.data?.ayahs || [];
  const result = {};
  ayahs.forEach((a) => {
    result[a.numberInSurah] = a.text;
  });
  return result;
}

// ── Mushaf Page ─────────────────────────────────────────────────────────

/**
 * Get a specific Mushaf page (1-604) with Arabic text + translation.
 * Offline-first: a pre-baked merged copy ships in the APK at
 * /data/page/{n}.json; otherwise the two endpoints are fetched, merged,
 * and cached in IndexedDB for subsequent offline use.
 * @param {number} pageNumber - The page number (1-604)
 */
export async function getPage(pageNumber) {
  const arabicUrl = `${EXTERNAL_API_BASE}/page/${pageNumber}/ar.alafasy`;
  const translationUrl = `${EXTERNAL_API_BASE}/page/${pageNumber}/en.sahih`;
  const bundledPath = `/data/page/${pageNumber}.json`;

  // 1. Pre-baked merged page (works fully offline from first launch).
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(bundledPath);
      if (res.ok) return await res.json();
    } catch {
      /* fall through to network */
    }
  }

  // 2. Network merge + cache.
  const [arabicRes, translationRes] = await Promise.all([
    fetch(arabicUrl),
    fetch(translationUrl),
  ]);

  if (!arabicRes.ok) throw new Error(`Arabic fetch failed: ${arabicRes.status}`);
  if (!translationRes.ok) throw new Error(`Translation fetch failed: ${translationRes.status}`);

  const arabicData = await arabicRes.json();
  const translationData = await translationRes.json();

  const arabicAyahs = arabicData.data.ayahs;
  const translationAyahs = translationData.data.ayahs;

  const mergedAyahs = arabicAyahs.map((ayah, index) => ({
    ...ayah,
    translationText: translationAyahs[index]?.text || '',
  }));

  const result = {
    data: {
      ...arabicData.data,
      ayahs: mergedAyahs,
      surahs: arabicData.data.surahs,
    },
  };

  if (typeof window !== 'undefined') {
    idbSet(arabicUrl, { data: result, timestamp: Date.now() });
  }
  return result;
}

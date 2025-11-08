/**
 * Centralized API service for Quran API calls
 * Provides caching and error handling for all API requests
 */

const API_BASE_URL = 'https://api.alquran.cloud/v1';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

/**
 * Generic fetch with caching
 */
async function fetchWithCache(url, options = {}) {
  const cacheKey = url;

  // Check cache
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
    cache.delete(cacheKey);
  }

  // Fetch from API
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Cache the response
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}

/**
 * Get list of all surahs
 */
export async function getSurahs() {
  const url = `${API_BASE_URL}/surah`;
  return fetchWithCache(url);
}

/**
 * Get a specific surah by ID with translation
 * @param {number} surahId - The surah number (1-114)
 * @param {string} edition - Edition identifier (default: 'en.asad')
 */
export async function getSurah(surahId, edition = 'en.asad') {
  const url = `${API_BASE_URL}/surah/${surahId}/${edition}`;
  return fetchWithCache(url);
}

/**
 * Get multiple editions of a surah
 * @param {number} surahId - The surah number (1-114)
 * @param {string[]} editions - Array of edition identifiers
 */
export async function getSurahMultipleEditions(surahId, editions = ['ar.alafasy', 'en.asad']) {
  const url = `${API_BASE_URL}/surah/${surahId}/editions/${editions.join(',')}`;
  return fetchWithCache(url);
}

/**
 * Get a specific ayah
 * @param {number} surahId - The surah number (1-114)
 * @param {number} ayahNumber - The ayah number within the surah
 * @param {string} edition - Edition identifier (default: 'en.asad')
 */
export async function getAyah(surahId, ayahNumber, edition = 'en.asad') {
  const url = `${API_BASE_URL}/ayah/${surahId}:${ayahNumber}/${edition}`;
  return fetchWithCache(url);
}

/**
 * Get multiple editions of an ayah
 * @param {number} surahId - The surah number (1-114)
 * @param {number} ayahNumber - The ayah number within the surah
 * @param {string[]} editions - Array of edition identifiers
 */
export async function getAyahMultipleEditions(surahId, ayahNumber, editions = ['ar.alafasy', 'en.asad']) {
  const url = `${API_BASE_URL}/ayah/${surahId}:${ayahNumber}/editions/${editions.join(',')}`;
  return fetchWithCache(url);
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

  const url = `${API_BASE_URL}/search/${encodeURIComponent(query)}/${surah}/${edition}`;
  return fetchWithCache(url);
}

/**
 * Get available editions/translations
 */
export async function getEditions() {
  const url = `${API_BASE_URL}/edition`;
  return fetchWithCache(url);
}

/**
 * Get editions by language
 * @param {string} language - Language code (e.g., 'en', 'ar', 'ur')
 */
export async function getEditionsByLanguage(language) {
  const url = `${API_BASE_URL}/edition/language/${language}`;
  return fetchWithCache(url);
}

/**
 * Get editions by format
 * @param {string} format - Format type (e.g., 'text', 'audio')
 */
export async function getEditionsByFormat(format) {
  const url = `${API_BASE_URL}/edition/format/${format}`;
  return fetchWithCache(url);
}

/**
 * Clear the entire cache
 */
export function clearCache() {
  cache.clear();
}

/**
 * Clear specific cache entry
 * @param {string} key - Cache key to clear
 */
export function clearCacheEntry(key) {
  cache.delete(key);
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
}

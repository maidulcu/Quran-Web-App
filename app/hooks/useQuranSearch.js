'use client';
import { useState, useCallback } from 'react';
import { searchQuran } from '../lib/api';
import { logger } from '../lib/logger';

/**
 * Custom hook to manage Quran search functionality
 * Provides search state management with caching via API service
 */
export function useQuranSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Perform search
  const performSearch = useCallback(async (searchQuery, surah = 'all', edition = 'en') => {
    if (!searchQuery || searchQuery.trim() === '') {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchQuran(searchQuery.trim(), surah, edition);
      setResults(data.data?.matches || []);
      setQuery(searchQuery);
    } catch (err) {
      logger.error('Search error:', err);
      setError(err.message || 'An error occurred while searching');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear search results
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);

  // Update query without searching (for controlled input)
  const updateQuery = useCallback((newQuery) => {
    setQuery(newQuery);
  }, []);

  return {
    query,
    results,
    loading,
    error,
    performSearch,
    clearSearch,
    updateQuery,
    hasResults: results.length > 0
  };
}

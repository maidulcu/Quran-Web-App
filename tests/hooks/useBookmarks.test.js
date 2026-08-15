import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookmarks } from '../../app/hooks/useBookmarks';

describe('useBookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('initializes with empty bookmarks', () => {
    const { result } = renderHook(() => useBookmarks());
    expect(result.current.bookmarks).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.isLoading).toBe(true);
  });

  it('adds a bookmark', async () => {
    const { result } = renderHook(() => useBookmarks());

    await act(async () => {
      result.current.addBookmark({
        surahNumber: 1,
        number: 1,
        text: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
        surahName: 'Al-Fatihah',
      });
    });

    expect(result.current.bookmarks).toHaveLength(1);
    expect(result.current.count).toBe(1);
    expect(result.current.isBookmarked(1, 1)).toBe(true);
  });

  it('removes a bookmark', async () => {
    const { result } = renderHook(() => useBookmarks());

    await act(async () => {
      result.current.addBookmark({
        surahNumber: 1,
        number: 1,
        text: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
        surahName: 'Al-Fatihah',
      });
    });

    await act(async () => {
      result.current.removeBookmark(1, 1);
    });

    expect(result.current.bookmarks).toHaveLength(0);
    expect(result.current.isBookmarked(1, 1)).toBe(false);
  });

  it('toggles bookmark', async () => {
    const { result } = renderHook(() => useBookmarks());

    await act(async () => {
      result.current.toggleBookmark({
        surahNumber: 2,
        number: 255,
        text: 'اللّٰهُ لَآ إِلٰهَ إِلَّا هُوَ',
        surahName: 'Al-Baqarah',
      });
    });

    expect(result.current.isBookmarked(2, 255)).toBe(true);

    await act(async () => {
      result.current.toggleBookmark({
        surahNumber: 2,
        number: 255,
        text: 'اللّٰهُ لَآ إِلٰهَ إِلَّا هُوَ',
        surahName: 'Al-Baqarah',
      });
    });

    expect(result.current.isBookmarked(2, 255)).toBe(false);
  });

  it('prevents duplicate bookmarks', async () => {
    const { result } = renderHook(() => useBookmarks());

    await act(async () => {
      result.current.addBookmark({ surahNumber: 1, number: 1, text: 'test', surahName: 'test' });
    });

    await act(async () => {
      result.current.addBookmark({ surahNumber: 1, number: 1, text: 'test', surahName: 'test' });
    });

    expect(result.current.bookmarks).toHaveLength(1);
  });

  it('clears all bookmarks', async () => {
    const { result } = renderHook(() => useBookmarks());

    await act(async () => {
      result.current.addBookmark({ surahNumber: 1, number: 1, text: 'test1', surahName: 'test' });
      result.current.addBookmark({ surahNumber: 2, number: 1, text: 'test2', surahName: 'test' });
    });

    expect(result.current.bookmarks).toHaveLength(2);

    await act(async () => {
      result.current.clearBookmarks();
    });

    expect(result.current.bookmarks).toHaveLength(0);
    expect(result.current.count).toBe(0);
  });
});

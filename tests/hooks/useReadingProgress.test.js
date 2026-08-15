import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReadingProgress } from '../../app/hooks/useReadingProgress';

describe('useReadingProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('initializes with empty progress', () => {
    const { result } = renderHook(() => useReadingProgress());
    expect(result.current.progress).toEqual({});
  });

  it('marks an ayah as read', async () => {
    const { result } = renderHook(() => useReadingProgress());

    await act(async () => {
      result.current.markAyahRead(1, 5, 7);
    });

    expect(result.current.progress['1']).toBeTruthy();
    expect(result.current.progress['1'].maxAyahRead).toBe(5);
    expect(result.current.progress['1'].totalAyahs).toBe(7);
  });

  it('updates max ayah read', async () => {
    const { result } = renderHook(() => useReadingProgress());

    await act(async () => {
      result.current.markAyahRead(1, 3, 7);
    });

    await act(async () => {
      result.current.markAyahRead(1, 5, 7);
    });

    expect(result.current.progress['1'].maxAyahRead).toBe(5);
  });

  it('does not decrease max ayah read', async () => {
    const { result } = renderHook(() => useReadingProgress());

    await act(async () => {
      result.current.markAyahRead(1, 5, 7);
    });

    await act(async () => {
      result.current.markAyahRead(1, 3, 7);
    });

    expect(result.current.progress['1'].maxAyahRead).toBe(5);
  });

  it('calculates overall progress', async () => {
    const { result } = renderHook(() => useReadingProgress());

    await act(async () => {
      result.current.markAyahRead(1, 7, 7);
      result.current.markAyahRead(2, 100, 286);
    });

    const overall = result.current.getOverallProgress();
    expect(overall.totalRead).toBe(107);
    expect(overall.totalAyahs).toBe(293);
    expect(overall.completedSurahs).toBe(1);
    expect(overall.totalSurahsStarted).toBe(2);
  });

  it('gets surah progress', async () => {
    const { result } = renderHook(() => useReadingProgress());

    await act(async () => {
      result.current.markAyahRead(1, 5, 7);
    });

    const surahProgress = result.current.getSurahProgress(1);
    expect(surahProgress.read).toBe(5);
    expect(surahProgress.total).toBe(7);
    expect(surahProgress.percent).toBe(71);
    expect(surahProgress.completed).toBe(false);
  });

  it('detects completed surah', async () => {
    const { result } = renderHook(() => useReadingProgress());

    await act(async () => {
      result.current.markAyahRead(1, 7, 7);
    });

    const surahProgress = result.current.getSurahProgress(1);
    expect(surahProgress.completed).toBe(true);
    expect(surahProgress.percent).toBe(100);
  });

  it('clears progress', async () => {
    const { result } = renderHook(() => useReadingProgress());

    await act(async () => {
      result.current.markAyahRead(1, 5, 7);
    });

    await act(async () => {
      result.current.clearProgress();
    });

    expect(result.current.progress).toEqual({});
  });

  it('gets recently read surahs', async () => {
    const { result } = renderHook(() => useReadingProgress());

    await act(async () => {
      result.current.markAyahRead(1, 5, 7);
    });
    await act(async () => {
      result.current.markAyahRead(2, 10, 286);
    });
    await act(async () => {
      result.current.markAyahRead(3, 20, 200);
    });

    const recent = result.current.getRecentlyRead(2);
    expect(recent).toHaveLength(2);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLastRead } from '../../app/hooks/useLastRead';

describe('useLastRead', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('initializes with null when no last read', () => {
    const { result } = renderHook(() => useLastRead());
    expect(result.current.lastRead).toBeNull();
  });

  it('saves last read position', async () => {
    const { result } = renderHook(() => useLastRead());

    await act(async () => {
      result.current.saveLastRead(2, 255);
    });

    expect(result.current.lastRead).toBeTruthy();
    expect(result.current.lastRead.surahNumber).toBe(2);
    expect(result.current.lastRead.ayahNumber).toBe(255);
    expect(result.current.lastRead.surahName).toBe('Al-Baqarah');
  });

  it('updates last read position', async () => {
    const { result } = renderHook(() => useLastRead());

    await act(async () => {
      result.current.saveLastRead(1, 1);
    });

    await act(async () => {
      result.current.saveLastRead(1, 5);
    });

    expect(result.current.lastRead.ayahNumber).toBe(5);
  });

  it('clears last read', async () => {
    const { result } = renderHook(() => useLastRead());

    await act(async () => {
      result.current.saveLastRead(1, 1);
    });

    await act(async () => {
      result.current.clearLastRead();
    });

    expect(result.current.lastRead).toBeNull();
  });

  it('includes surah name in saved data', async () => {
    const { result } = renderHook(() => useLastRead());

    await act(async () => {
      result.current.saveLastRead(36, 1);
    });

    expect(result.current.lastRead.surahName).toBe('Ya-Sin');
  });

  it('includes timestamp', async () => {
    const { result } = renderHook(() => useLastRead());
    const before = Date.now();

    await act(async () => {
      result.current.saveLastRead(1, 1);
    });

    expect(result.current.lastRead.timestamp).toBeGreaterThanOrEqual(before);
  });
});

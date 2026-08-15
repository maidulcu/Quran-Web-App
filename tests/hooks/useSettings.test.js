import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFont } from '../../app/hooks/useFont';
import { useFontSize } from '../../app/hooks/useFontSize';
import { useTajweed } from '../../app/hooks/useTajweed';

describe('useFont', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('defaults to Uthmanic font', () => {
    const { result } = renderHook(() => useFont());
    expect(result.current.font).toBe('Uthmanic');
    expect(result.current.fontClass).toBe('font-quran');
  });

  it('toggles between fonts', async () => {
    const { result } = renderHook(() => useFont());

    await act(async () => {
      result.current.toggleFont();
    });

    expect(result.current.font).toBe('IndoPak');
    expect(result.current.fontClass).toBe('font-indopak');

    await act(async () => {
      result.current.toggleFont();
    });

    expect(result.current.font).toBe('Uthmanic');
    expect(result.current.fontClass).toBe('font-quran');
  });
});

describe('useFontSize', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('defaults to M size', () => {
    const { result } = renderHook(() => useFontSize());
    expect(result.current.level).toBe(1);
    expect(result.current.label).toBe('M');
  });

  it('increases font size', async () => {
    const { result } = renderHook(() => useFontSize());

    await act(async () => {
      result.current.increase();
    });

    expect(result.current.level).toBe(2);
    expect(result.current.label).toBe('L');
  });

  it('decreases font size', async () => {
    const { result } = renderHook(() => useFontSize());

    await act(async () => {
      result.current.decrease();
    });

    expect(result.current.level).toBe(0);
    expect(result.current.label).toBe('S');
  });

  it('does not exceed max size', async () => {
    const { result } = renderHook(() => useFontSize());

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        result.current.increase();
      });
    }

    expect(result.current.level).toBe(4);
    expect(result.current.canIncrease).toBe(false);
  });

  it('does not go below min size', async () => {
    const { result } = renderHook(() => useFontSize());

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        result.current.decrease();
      });
    }

    expect(result.current.level).toBe(0);
    expect(result.current.canDecrease).toBe(false);
  });
});

describe('useTajweed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('defaults to disabled', () => {
    const { result } = renderHook(() => useTajweed());
    expect(result.current.tajweedEnabled).toBe(false);
  });

  it('toggles tajweed', async () => {
    const { result } = renderHook(() => useTajweed());

    await act(async () => {
      result.current.toggleTajweed();
    });

    expect(result.current.tajweedEnabled).toBe(true);

    await act(async () => {
      result.current.toggleTajweed();
    });

    expect(result.current.tajweedEnabled).toBe(false);
  });
});

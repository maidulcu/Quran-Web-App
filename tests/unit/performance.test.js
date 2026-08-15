import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useNetwork } from '../../app/hooks/useNetwork';
import { debounce, throttle, createCache } from '../../app/lib/performance';

describe('useNetwork', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns online status', async () => {
    const { result } = renderHook(() => useNetwork());
    await waitFor(() => {
      expect(result.current.isOnline).toBe(true);
    });
  });

  it('returns connection type', async () => {
    const { result } = renderHook(() => useNetwork());
    await waitFor(() => {
      expect(result.current.connectionType).toBe('wifi');
    });
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays function execution', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('cancels previous call', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledOnce();
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('limits function calls', () => {
    const fn = vi.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(fn).toHaveBeenCalledOnce();

    vi.advanceTimersByTime(100);

    throttledFn();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('createCache', () => {
  it('stores and retrieves values', () => {
    const cache = createCache();
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('clears all entries', () => {
    const cache = createCache();
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.clear();
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBeNull();
  });

  it('returns cache size', () => {
    const cache = createCache();
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    expect(cache.size()).toBe(2);
  });
});

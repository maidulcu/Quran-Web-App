import { describe, it, expect, vi, beforeEach } from 'vitest';
import { storage } from '../../app/lib/storage';

describe('storage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('get', () => {
    it('returns null for non-existent key', async () => {
      const result = await storage.get('nonexistent');
      expect(result).toBeNull();
    });

    it('returns stored value', async () => {
      localStorage.setItem('testKey', 'testValue');
      const result = await storage.get('testKey');
      expect(result).toBe('testValue');
    });

    it('handles JSON values', async () => {
      const data = { name: 'test', count: 42 };
      localStorage.setItem('jsonKey', JSON.stringify(data));
      const result = await storage.get('jsonKey');
      expect(JSON.parse(result)).toEqual(data);
    });
  });

  describe('set', () => {
    it('stores a string value', async () => {
      await storage.set('key1', 'value1');
      expect(localStorage.getItem('key1')).toBe('value1');
    });

    it('overwrites existing value', async () => {
      await storage.set('key1', 'first');
      await storage.set('key1', 'second');
      expect(localStorage.getItem('key1')).toBe('second');
    });

    it('stores JSON value', async () => {
      const data = { ayahs: [1, 2, 3] };
      await storage.set('jsonKey', JSON.stringify(data));
      expect(JSON.parse(localStorage.getItem('jsonKey'))).toEqual(data);
    });
  });

  describe('remove', () => {
    it('removes a key', async () => {
      localStorage.setItem('toRemove', 'value');
      await storage.remove('toRemove');
      expect(localStorage.getItem('toRemove')).toBeNull();
    });

    it('does not throw for non-existent key', async () => {
      await expect(storage.remove('nonexistent')).resolves.not.toThrow();
    });
  });

  describe('clear', () => {
    it('clears all storage', async () => {
      localStorage.setItem('x', '1');
      localStorage.setItem('y', '2');
      await storage.clear();
      expect(localStorage.getItem('x')).toBeNull();
      expect(localStorage.getItem('y')).toBeNull();
    });
  });

  describe('getSync', () => {
    it('returns value synchronously', () => {
      localStorage.setItem('syncKey', 'syncValue');
      const result = storage.getSync('syncKey');
      expect(result).toBe('syncValue');
    });

    it('returns null for non-existent key', () => {
      const result = storage.getSync('nonexistent');
      expect(result).toBeNull();
    });
  });
});

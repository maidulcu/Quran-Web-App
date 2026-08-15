import { Preferences } from '@capacitor/preferences';

const isNative = () => {
  return typeof window !== 'undefined' && window.Capacitor?.isNativePlatform();
};

export const storage = {
  async get(key) {
    if (isNative()) {
      const result = await Preferences.get({ key });
      return result.value;
    }
    return localStorage.getItem(key);
  },

  async set(key, value) {
    if (isNative()) {
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  },

  async remove(key) {
    if (isNative()) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  },

  async keys() {
    if (isNative()) {
      const result = await Preferences.keys();
      return result.keys;
    }
    return Object.keys(localStorage);
  },

  async clear() {
    if (isNative()) {
      await Preferences.clear();
    } else {
      localStorage.clear();
    }
  },

  // Synchronous fallback for initial state (web only)
  getSync(key) {
    if (isNative()) {
      console.warn('getSync called on native — use async get() instead');
      return null;
    }
    return localStorage.getItem(key);
  },
};

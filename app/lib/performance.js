/**
 * Performance monitoring utilities for debugging and optimization
 */

// Track render performance
export function measureRender(componentName) {
  const start = performance.now();
  return {
    end: () => {
      const duration = performance.now() - start;
      if (duration > 100) {
        console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms`);
      }
      return duration;
    },
  };
}

// Track API call performance
export function measureApiCall(endpoint) {
  const start = performance.now();
  return {
    end: (success = true) => {
      const duration = performance.now() - start;
      const status = success ? 'success' : 'failed';
      console.log(`[API] ${endpoint} ${status} in ${duration.toFixed(2)}ms`);
      return duration;
    },
  };
}

// Track memory usage
export function getMemoryUsage() {
  if (typeof window === 'undefined' || !window.performance?.memory) {
    return null;
  }
  const memory = window.performance.memory;
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usedMB: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
    totalMB: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
  };
}

// Track FPS
export function trackFPS(callback) {
  let frames = 0;
  let lastTime = performance.now();

  function loop() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      const fps = Math.round((frames * 1000) / (now - lastTime));
      callback(fps);
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

// Debounce utility
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Throttle utility
export function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy load with IntersectionObserver
export function lazyLoad(element, callback, options = {}) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, ...options });

  observer.observe(element);
  return () => observer.disconnect();
}

// Batch state updates
export function batchUpdates(updates) {
  return updates.reduce((acc, update) => ({ ...acc, ...update }), {});
}

// Profile function execution
export function profile(name, fn) {
  console.time(name);
  const result = fn();
  console.timeEnd(name);
  return result;
}

// Async profile
export async function profileAsync(name, fn) {
  console.time(name);
  const result = await fn();
  console.timeEnd(name);
  return result;
}

// Cache with TTL
export function createCache(ttl = 5 * 60 * 1000) {
  const cache = new Map();

  return {
    get: (key) => {
      const item = cache.get(key);
      if (!item) return null;
      if (Date.now() - item.timestamp > ttl) {
        cache.delete(key);
        return null;
      }
      return item.value;
    },
    set: (key, value) => {
      cache.set(key, { value, timestamp: Date.now() });
    },
    clear: () => cache.clear(),
    size: () => cache.size,
  };
}

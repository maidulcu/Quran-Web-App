'use client';
import { useState, useEffect, useCallback } from 'react';
import { Network } from '@capacitor/network';

export function useNetwork() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    // Initial state
    Network.getStatus().then(status => {
      setIsOnline(status.connected);
      setConnectionType(status.connectionType);
    }).catch(() => {
      // Fallback for web
      setIsOnline(navigator.onLine);
    });

    // Listen for changes
    const handleNetworkChange = (status) => {
      setIsOnline(status.connected);
      setConnectionType(status.connectionType);
    };

    Network.addListener('networkStatusChange', handleNetworkChange).catch(() => {});

    // Web fallback
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      Network.removeAllListeners().catch(() => {});
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
}

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quran.webapp',
  appName: 'Quran App',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
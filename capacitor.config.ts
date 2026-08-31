import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anyaman.hms',
  appName: 'Anyaman HMS',
  webDir: 'public',
  server: {
    url: 'https://hms-node.anyaman.id',
    // url: 'https://devhms.anyaman.id/',
    // url: 'https://hms.anyaman.id/',
    cleartext: true,
  },
};

export default config;

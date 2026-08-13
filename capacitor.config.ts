import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anyaman.hms',
  appName: 'Anyaman HMS',
  webDir: 'public',
  server: {
    // url: "http://127.0.0.1:8000",
    url: 'http://192.168.1.6:3000',
    // url: 'https://devhms.anyaman.id/',
    // url: 'https://hms.anyaman.id/',
    cleartext: true,
  },
};

export default config;

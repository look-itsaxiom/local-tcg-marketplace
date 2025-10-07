import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.localtcg.marketplace',
  appName: 'TCG Marketplace',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#2c3e50',
      showSpinner: true,
      spinnerColor: '#ffffff'
    }
  }
};

export default config;

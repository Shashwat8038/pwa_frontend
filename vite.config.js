import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Registers service worker with auto-update
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // Icons & assets for PWA
      manifest: {
        name: 'Your App Name',
        short_name: 'AppName', // Short name for app icon
        description: 'Your app description', // Description shown on install prompt
        theme_color: '#ffffff', // Background color for the app splash screen
        icons: [ // Define app icons in various sizes
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Allows icon to adjust to different shapes
          }
        ]
      }
    })
  ]
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';
import path from "path";
import { VitePWA } from 'vite-plugin-pwa'; // 1. Import plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // 2. Cấu hình PWA
    VitePWA({
      registerType: 'autoUpdate', // Tự động cập nhật khi có nội dung mới
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: ' Library Management System',
        short_name: 'Library Management System',
        description: 'Library Management System',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-logo.png', // Bạn phải chuẩn bị icon này trong thư mục public
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-logo.png', // Bạn phải chuẩn bị icon này trong thư mục public
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // port 3000
  server: {
    port: 3000,
  },
});
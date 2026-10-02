import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, "/");

          if (!normalizedId.includes("node_modules")) {
            return;
          }

          if (/node_modules\/(react|react-dom|scheduler|use-sync-external-store)\//.test(normalizedId)) {
            return "react-core";
          }

          if (normalizedId.includes("node_modules/@radix-ui/")) {
            return "radix-ui";
          }

          if (normalizedId.includes("node_modules/lucide-react/")) {
            return "icons";
          }

          if (
            /node_modules\/(recharts|d3-|victory-vendor|@reduxjs\/toolkit|react-redux)\//.test(normalizedId)
          ) {
            return "charts";
          }

          return "vendor";
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Project Sentinel',
        short_name: 'Sentinel',
        description: 'A private sound and breathing studio',
        theme_color: '#111c18',
        background_color: '#111c18',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  build: {
    // Keep the built bundle apart from public/assets (images and the CV PDF).
    assetsDir: 'static',
    // three.js loads as its own chunk (about 570 kB before gzip), which is expected.
    chunkSizeWarningLimit: 650
  },
  server: { port: 5173 }
});

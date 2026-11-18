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
    // The 3D room loads after first paint as its own chunk: three.js plus the scene, about
    // 650 kB before gzip (165 kB after), which is expected.
    chunkSizeWarningLimit: 720
  },
  server: { port: 5173 }
});

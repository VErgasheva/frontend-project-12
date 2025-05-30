import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

function copyRedirects() {
  return {
    name: 'copy-redirects',
    closeBundle() {
      const src = resolve(__dirname, 'public/_redirects');
      const dest = resolve(__dirname, 'dist/_redirects');
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyRedirects()],
  server: {
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
  build: {
    outDir: 'dist',
  },
});

import { defineConfig } from 'vite';

export default defineConfig({
  base: '/mlsd/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
  },
});

/// <reference types="vitest" />
import { defineConfig } from 'vite';
import swc from 'unplugin-swc';
import path from 'path';

const r = (pathname: string) => path.resolve(__dirname, pathname);

export default defineConfig({
  plugins: [swc.vite()],
  resolve: {
    alias: {
      src: r('src'),
    },
  },
});

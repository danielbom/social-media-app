/// <reference types="vitest" />
import { defineConfig } from 'vite'
import swc from 'unplugin-swc'
import path from 'path'

const r = (pathname: string) => path.resolve(__dirname, '..', pathname)

export default defineConfig({
  test: {
    include: ['test/**/*-spec.ts'],
    exclude: ['src/*'],
  },
  plugins: [swc.vite()],
  resolve: {
    alias: {
      src: r('src'),
      test: r('test'),
    },
  },
})

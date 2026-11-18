import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // GitHub Pages 需要 repo name 當 base；Vercel 需要 '/'
  base:
    mode === 'production' && process.env.VERCEL !== '1'
      ? '/my-works-omamori/'
      : '/',
}))

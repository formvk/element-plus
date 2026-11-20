import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  test: {
    environment: 'happy-dom',
    include: ['packages/*/src/**/__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['packages/components/src/**'],
      exclude: ['packages/components/src/__tests__/**', '**/*.d.ts'],
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: 'coverage',
    },
  },
})

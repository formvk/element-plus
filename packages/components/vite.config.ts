import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const rootDir = import.meta.dirname

const external = (id: string): boolean => {
  if (id === 'vue' || id.startsWith('vue/')) return true
  if (id === '@vue/runtime-core' || id.startsWith('@vue/')) return true
  if (id === 'element-plus' || id.startsWith('element-plus/')) return true
  if (id === '@element-plus/icons-vue' || id.startsWith('@element-plus/icons-vue/')) return true
  if (id.startsWith('@formvk/')) return true
  if (id === 'dayjs' || id.startsWith('dayjs/')) return true
  if (id === 'sortablejs' || id.startsWith('sortablejs/')) return true
  return false
}

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      entryRoot: 'src',
      bundleTypes: true,
    }),
  ],
  build: {
    target: 'es2022',
    sourcemap: true,
    minify: false,
    lib: {
      entry: resolve(rootDir, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    rollupOptions: {
      external,
      output: {
        preserveModules: false,
      },
    },
  },
})

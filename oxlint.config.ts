import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['vue', 'typescript', 'import', 'oxc'],
  categories: {
    correctness: 'error',
    suspicious: 'warn',
    perf: 'warn',
  },
  env: {
    browser: true,
    es2022: true,
  },
  rules: {
    'typescript/no-explicit-any': 'off',
    'typescript/consistent-type-imports': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  ignorePatterns: ['dist/**', 'coverage/**', 'node_modules/**', '**/*.d.ts', 'vendor/**'],
})

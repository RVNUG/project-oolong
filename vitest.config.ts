import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'json', 'json-summary', 'html'],
      include: ['src/**'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.test.{js,jsx,ts,tsx}',
        'src/setupTests.ts',
        // Vitest 4 / Rolldown coverage remaps .ts as JS; skip typed SW glue
        'src/js/registerSW.ts',
      ],
      // Hard 80% gate for Vitest (lines/statements/functions).
      // Branches sit ~70% today; lock that floor so they cannot regress silently.
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 70,
      },
    },
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
    },
  },
}); 
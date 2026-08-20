import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // чтобы не импортировать describe, it, expect в каждом файле
    environment: 'jsdom', // эмулирует браузерное окружение
    setupFiles: './src/test/setup.ts', // файл с настройками (создадим позже)
    coverage: {
      provider: 'v8', // или 'istanbul'
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/main.tsx',
        '**/vite-env.d.ts'
      ]
    }
  }
})

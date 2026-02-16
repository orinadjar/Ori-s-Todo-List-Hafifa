import { loadEnvFile } from 'process';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

loadEnvFile('.env.test');

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});

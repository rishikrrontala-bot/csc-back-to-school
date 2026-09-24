import { defineConfig } from 'vitest/config';

// base './' keeps every asset path relative, so the site keeps working if the repo is renamed.
export default defineConfig({
  base: './',
  build: { target: 'es2022', sourcemap: false },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});

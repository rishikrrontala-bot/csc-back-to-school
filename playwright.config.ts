import { defineConfig, devices } from '@playwright/test';

const port = 4178;

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? `http://127.0.0.1:${port}/`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { ...devices['Pixel 7'], viewport: { width: 375, height: 812 } } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npx vite preview --port ${port} --strictPort --host 127.0.0.1`,
        port,
        reuseExistingServer: !process.env.CI,
      },
});

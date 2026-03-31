import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run build && NODE_ENV=production NITRO_HOST=127.0.0.1 NITRO_PORT=3000 node tests/e2e/server.mjs',
    port: 3000,
    reuseExistingServer: false,
    timeout: 180000
  }
})

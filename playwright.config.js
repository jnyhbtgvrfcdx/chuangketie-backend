// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // 保留localhost，不影响本地测试
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'node src/server.js',
    // 核心修改：用0.0.0.0校验服务就绪，适配新的监听地址
    url: 'http://0.0.0.0:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
});
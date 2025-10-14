/**
 * Playwright Test Configuration
 * Configuration for integration and E2E tests
 *
 * @see https://playwright.dev/docs/test-configuration
 * Created: October 15, 2025
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * Environment detection
 */
const IS_CI = !!process.env.CI;
const IS_VERCEL = !!process.env.VERCEL;
const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.BASE_URL || 'http://localhost:3000';

/**
 * Test configuration
 */
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Test match patterns
  testMatch: '**/*.test.js',

  // Timeout for each test (30s for OpenAI API calls)
  timeout: 30000,

  // Expect timeout (5s for assertions)
  expect: {
    timeout: 5000,
  },

  // Run tests in files in parallel
  fullyParallel: !IS_CI,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: IS_CI,

  // Retry on CI only
  retries: IS_CI ? 2 : 0,

  // Workers (parallel test execution)
  workers: IS_CI ? 1 : undefined,

  // Reporters
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: BASE_URL,

    // Collect trace on failure for debugging
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },

  // Test projects for different browsers (for E2E tests)
  projects: [
    // API Integration Tests (no browser needed)
    {
      name: 'api-integration',
      testMatch: '**/integration/**/*.test.js',
      use: {
        // No browser for API tests
      },
    },

    // Unit Tests (no browser needed)
    {
      name: 'unit',
      testMatch: '**/unit/**/*.test.js',
      use: {
        // No browser for unit tests
      },
    },

    // E2E Tests - Chrome
    {
      name: 'e2e-chromium',
      testMatch: '**/e2e/**/*.test.js',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // E2E Tests - Firefox
    {
      name: 'e2e-firefox',
      testMatch: '**/e2e/**/*.test.js',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    // E2E Tests - Safari
    {
      name: 'e2e-webkit',
      testMatch: '**/e2e/**/*.test.js',
      use: {
        ...devices['Desktop Safari'],
      },
    },

    // E2E Tests - Mobile Chrome
    {
      name: 'e2e-mobile-chrome',
      testMatch: '**/e2e/**/*.test.js',
      use: {
        ...devices['Pixel 5'],
      },
    },

    // E2E Tests - Mobile Safari
    {
      name: 'e2e-mobile-safari',
      testMatch: '**/e2e/**/*.test.js',
      use: {
        ...devices['iPhone 12'],
      },
    },
  ],

  // Web server configuration (for local development)
  webServer: IS_CI || IS_VERCEL
    ? undefined
    : {
        command: 'npm run dev',
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120000,
      },
});

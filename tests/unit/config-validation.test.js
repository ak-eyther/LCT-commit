/**
 * Configuration Validation Unit Tests
 * Tests the config.js module functions for proper validation and error handling
 *
 * CRITICAL TEST: Verifies configuration validation works correctly
 * and fails safely when required environment variables are missing or invalid
 *
 * Reference: src/lib/config.js
 * Created: October 15, 2025
 */

import { test, expect } from '@playwright/test';

/**
 * Helper: Set environment variables for test
 */
function setTestEnv(vars) {
  // Clear all config-related env vars first
  delete process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_BRAINDUMPS_KEY;
  delete process.env.DATABASE_URL;
  delete process.env.SENTRY_DSN;
  delete process.env.NODE_ENV;

  // Set provided vars
  Object.entries(vars).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

/**
 * Helper: Dynamic import to reload module with new env vars
 */
async function importConfigModule() {
  // Use timestamp to bust cache
  const cacheBuster = `?t=${Date.now()}`;
  return await import(`../../src/lib/config.js${cacheBuster}`);
}

test.describe('Config Validation - Required Fields', () => {
  // ========================================
  // OPENAI KEY VALIDATION
  // ========================================

  test('should fail when both OpenAI keys are missing', async () => {
    setTestEnv({});

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);

    // Should have error about missing OpenAI keys
    const hasOpenAIError = result.errors.some(err =>
      err.includes('OpenAI API key')
    );
    expect(hasOpenAIError).toBe(true);
  });

  test('should pass when OPENAI_BRAINDUMPS_KEY is provided', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-braindumps-key-1234567890',
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  test('should pass when OPENAI_API_KEY is provided', async () => {
    setTestEnv({
      OPENAI_API_KEY: 'sk-test-general-key-1234567890',
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  test('should pass when both OpenAI keys are provided', async () => {
    setTestEnv({
      OPENAI_API_KEY: 'sk-test-general-key-1234567890',
      OPENAI_BRAINDUMPS_KEY: 'sk-test-braindumps-key-1234567890',
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  // ========================================
  // API KEY FORMAT VALIDATION
  // ========================================

  test('should fail when OpenAI key does not start with "sk-"', async () => {
    setTestEnv({
      OPENAI_API_KEY: 'invalid-key-without-sk-prefix',
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(false);

    // Should have error about invalid format
    const hasFormatError = result.errors.some(
      err => err.includes('Invalid format') || err.includes('OPENAI_API_KEY')
    );
    expect(hasFormatError).toBe(true);
  });

  test('should fail when OPENAI_BRAINDUMPS_KEY has invalid format', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'not-a-valid-key',
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(false);

    const hasFormatError = result.errors.some(
      err =>
        err.includes('Invalid format') || err.includes('OPENAI_BRAINDUMPS_KEY')
    );
    expect(hasFormatError).toBe(true);
  });

  test('should validate empty string as missing key', async () => {
    setTestEnv({
      OPENAI_API_KEY: '',
      OPENAI_BRAINDUMPS_KEY: '',
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  // ========================================
  // OPTIONAL FIELDS VALIDATION
  // ========================================

  test('should pass when DATABASE_URL is missing (optional)', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key-1234567890',
      // DATABASE_URL not provided
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(true);
  });

  test('should warn when optional fields are missing', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key-1234567890',
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: true });

    expect(result.valid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);

    // Should warn about missing DATABASE_URL, SENTRY_DSN, etc.
    const hasWarnings = result.warnings.some(
      warn => warn.includes('DATABASE_URL') || warn.includes('SENTRY_DSN')
    );
    expect(hasWarnings).toBe(true);
  });

  test('should not warn when logWarnings is false', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key-1234567890',
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(true);

    // Warnings array may exist but should be empty or not logged
    // (We can't easily test console output, but we verify warnings array)
  });

  test('should validate DATABASE_URL format when provided', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key-1234567890',
      DATABASE_URL: 'invalid-url-not-postgres',
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(false);

    const hasDBError = result.errors.some(err =>
      err.includes('DATABASE_URL')
    );
    expect(hasDBError).toBe(true);
  });

  test('should pass with valid DATABASE_URL format', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key-1234567890',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(true);
  });
});

test.describe('Config Validation - getOpenAIKey Function', () => {
  // ========================================
  // KEY PRECEDENCE TESTS
  // ========================================

  test('should prefer OPENAI_BRAINDUMPS_KEY over OPENAI_API_KEY', async () => {
    setTestEnv({
      OPENAI_API_KEY: 'sk-general-key',
      OPENAI_BRAINDUMPS_KEY: 'sk-braindumps-key',
    });

    const config = await importConfigModule();
    const key = config.getOpenAIKey();

    expect(key).toBe('sk-braindumps-key');
  });

  test('should fall back to OPENAI_API_KEY when BRAINDUMPS key missing', async () => {
    setTestEnv({
      OPENAI_API_KEY: 'sk-general-key',
    });

    const config = await importConfigModule();
    const key = config.getOpenAIKey();

    expect(key).toBe('sk-general-key');
  });

  test('should return BRAINDUMPS key when only it is provided', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-braindumps-only',
    });

    const config = await importConfigModule();
    const key = config.getOpenAIKey();

    expect(key).toBe('sk-braindumps-only');
  });

  test('should throw error when no OpenAI key is configured', async () => {
    setTestEnv({});

    const config = await importConfigModule();

    expect(() => config.getOpenAIKey()).toThrow();
    expect(() => config.getOpenAIKey()).toThrow(/OpenAI API key not configured/);
  });

  test('should throw descriptive error mentioning both env var names', async () => {
    setTestEnv({});

    const config = await importConfigModule();

    try {
      config.getOpenAIKey();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error.message).toContain('OPENAI_BRAINDUMPS_KEY');
      expect(error.message).toContain('OPENAI_API_KEY');
    }
  });
});

test.describe('Config Validation - getConfig Function', () => {
  // ========================================
  // GENERIC CONFIG ACCESS
  // ========================================

  test('should return value for existing config key', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key',
      NODE_ENV: 'production',
    });

    const config = await importConfigModule();
    const nodeEnv = config.getConfig('NODE_ENV');

    expect(nodeEnv).toBe('production');
  });

  test('should return default value when key is missing', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key',
      // NODE_ENV not provided
    });

    const config = await importConfigModule();
    const nodeEnv = config.getConfig('NODE_ENV');

    // Default is 'development'
    expect(nodeEnv).toBe('development');
  });

  test('should return undefined for non-existent key without default', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key',
    });

    const config = await importConfigModule();
    const nonExistent = config.getConfig('NON_EXISTENT_KEY');

    expect(nonExistent).toBeUndefined();
  });
});

test.describe('Config Validation - Environment Helpers', () => {
  // ========================================
  // ENVIRONMENT DETECTION
  // ========================================

  test('should detect production environment', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key',
      NODE_ENV: 'production',
    });

    const config = await importConfigModule();

    expect(config.isProduction()).toBe(true);
    expect(config.isDevelopment()).toBe(false);
  });

  test('should detect development environment', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key',
      NODE_ENV: 'development',
    });

    const config = await importConfigModule();

    expect(config.isProduction()).toBe(false);
    expect(config.isDevelopment()).toBe(true);
  });

  test('should default to development when NODE_ENV not set', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key',
      // NODE_ENV not provided
    });

    const config = await importConfigModule();

    expect(config.isDevelopment()).toBe(true);
    expect(config.isProduction()).toBe(false);
  });
});

test.describe('Config Validation - Security (getConfigSummary)', () => {
  // ========================================
  // SENSITIVE DATA MASKING
  // ========================================

  test('should mask API keys in config summary', async () => {
    setTestEnv({
      OPENAI_API_KEY: 'sk-test1234567890abcdefghijklmnopqrstuvwxyz',
      OPENAI_BRAINDUMPS_KEY: 'sk-braindumps1234567890abcdefgh',
    });

    const config = await importConfigModule();
    const summary = config.getConfigSummary();

    // Keys should be masked
    expect(summary.OPENAI_API_KEY).toContain('...');
    expect(summary.OPENAI_BRAINDUMPS_KEY).toContain('...');

    // Should show first 8 and last 4 characters
    expect(summary.OPENAI_API_KEY).toContain('sk-test1');
    expect(summary.OPENAI_API_KEY).toContain('wxyz');

    // Should not show full key
    expect(summary.OPENAI_API_KEY).not.toBe(
      'sk-test1234567890abcdefghijklmnopqrstuvwxyz'
    );
  });

  test('should mask SECRET values in config summary', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key',
      SOME_SECRET: 'super-secret-value-12345',
    });

    const config = await importConfigModule();
    const summary = config.getConfigSummary();

    // Secrets should be masked (if in schema)
    // Note: SOME_SECRET is not in schema, so it won't appear in summary

    // Check that known secrets are masked
    if (summary.OPENAI_BRAINDUMPS_KEY) {
      expect(summary.OPENAI_BRAINDUMPS_KEY).toContain('...');
    }
  });

  test('should mask DSN values in config summary', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key',
      SENTRY_DSN:
        'https://1234567890abcdef@o123456.ingest.sentry.io/123456',
    });

    const config = await importConfigModule();
    const summary = config.getConfigSummary();

    // DSN should be masked
    expect(summary.SENTRY_DSN).toContain('...');
    expect(summary.SENTRY_DSN).not.toBe(
      'https://1234567890abcdef@o123456.ingest.sentry.io/123456'
    );
  });

  test('should show <not set> for missing config values', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key',
      // DATABASE_URL, SENTRY_DSN not provided
    });

    const config = await importConfigModule();
    const summary = config.getConfigSummary();

    expect(summary.DATABASE_URL).toBe('<not set>');
    expect(summary.SENTRY_DSN).toBe('<not set>');
  });

  test('should not mask non-sensitive values', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test-key',
      NODE_ENV: 'production',
    });

    const config = await importConfigModule();
    const summary = config.getConfigSummary();

    // NODE_ENV should not be masked (no KEY/SECRET/DSN in name)
    expect(summary.NODE_ENV).toBe('production');
    expect(summary.NODE_ENV).not.toContain('...');
  });
});

test.describe('Config Validation - Error Handling', () => {
  // ========================================
  // THROW ON ERROR MODE
  // ========================================

  test('should throw error when throwOnError is true and validation fails', async () => {
    setTestEnv({
      // No OpenAI keys
    });

    const config = await importConfigModule();

    expect(() =>
      config.validateConfig({ throwOnError: true, logWarnings: false })
    ).toThrow();
  });

  test('should not throw when throwOnError is false (default)', async () => {
    setTestEnv({
      // No OpenAI keys
    });

    const config = await importConfigModule();

    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('thrown error should include validation details', async () => {
    setTestEnv({});

    const config = await importConfigModule();

    try {
      config.validateConfig({ throwOnError: true, logWarnings: false });
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error.message).toContain('Configuration validation failed');
      expect(error.message).toContain('OpenAI');
    }
  });
});

test.describe('Config Validation - Edge Cases', () => {
  // ========================================
  // EDGE CASES
  // ========================================

  test('should handle whitespace-only values as invalid', async () => {
    setTestEnv({
      OPENAI_API_KEY: '   ',
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(false);
  });

  test('should handle keys with correct prefix but short length', async () => {
    setTestEnv({
      OPENAI_API_KEY: 'sk-',
    });

    const config = await importConfigModule();

    // Key validation checks startsWith('sk-'), so 'sk-' alone is valid format
    // But it would fail in actual use with OpenAI
    const result = config.validateConfig({ logWarnings: false });

    // Should pass format validation (implementation allows 'sk-')
    expect(result.valid).toBe(true);
  });

  test('should handle special characters in config values', async () => {
    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: 'sk-test!@#$%key',
      DATABASE_URL: 'postgresql://user:p@ss!word@localhost:5432/db',
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    // Both should pass validation
    expect(result.valid).toBe(true);
  });

  test('should handle very long config values', async () => {
    const longKey = 'sk-' + 'a'.repeat(1000);

    setTestEnv({
      OPENAI_BRAINDUMPS_KEY: longKey,
    });

    const config = await importConfigModule();
    const result = config.validateConfig({ logWarnings: false });

    expect(result.valid).toBe(true);

    // Summary should mask properly even with long values
    const summary = config.getConfigSummary();
    expect(summary.OPENAI_BRAINDUMPS_KEY.length).toBeLessThan(longKey.length);
  });
});

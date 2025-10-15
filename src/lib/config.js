/**
 * Configuration and Environment Validation
 * Validates required environment variables and provides typed config access
 *
 * @module lib/config
 * @created October 14, 2025
 */

/**
 * Configuration schema defining required and optional environment variables
 */
const CONFIG_SCHEMA = {
  // OpenAI Configuration
  OPENAI_API_KEY: {
    required: false,
    description: 'OpenAI API key for general AI features',
    validate: value => value && value.startsWith('sk-'),
  },
  OPENAI_BRAINDUMPS_KEY: {
    required: false,
    description: 'Dedicated OpenAI API key for Brain Dumps feature',
    validate: value => value && value.startsWith('sk-'),
  },

  // Database Configuration (optional for Brain Dumps MVP)
  DATABASE_URL: {
    required: false,
    description: 'PostgreSQL database connection string',
    validate: value =>
      value &&
      (value.startsWith('postgres://') || value.startsWith('postgresql://')),
  },

  // Monitoring (optional)
  SENTRY_DSN: {
    required: false,
    description: 'Sentry DSN for error tracking',
  },

  // Environment
  NODE_ENV: {
    required: false,
    description: 'Node environment (development|production)',
    default: 'development',
  },
};

/**
 * Validates environment configuration
 *
 * @param {Object} options - Validation options
 * @param {boolean} options.throwOnError - Throw error if validation fails (default: false)
 * @param {boolean} options.logWarnings - Log warnings for missing optional vars (default: true)
 * @returns {Object} Validation result { valid: boolean, errors: [], warnings: [] }
 */
function validateConfig(options = {}) {
  const { throwOnError = false, logWarnings = true } = options;

  const errors = [];
  const warnings = [];

  for (const [key, schema] of Object.entries(CONFIG_SCHEMA)) {
    const value = process.env[key];

    if (schema.required && !value) {
      errors.push(
        `Missing required environment variable: ${key} (${schema.description})`
      );
      continue;
    }

    if (value && schema.validate && !schema.validate(value)) {
      errors.push(`Invalid format for ${key}: ${schema.description}`);
    }

    if (!schema.required && !value && logWarnings) {
      warnings.push(
        `Optional environment variable not set: ${key} (${schema.description})`
      );
    }
  }

  const hasOpenAIKey =
    process.env.OPENAI_API_KEY || process.env.OPENAI_BRAINDUMPS_KEY;
  if (!hasOpenAIKey) {
    errors.push(
      'At least one OpenAI API key must be configured: OPENAI_API_KEY or OPENAI_BRAINDUMPS_KEY'
    );
  }

  if (errors.length > 0) {
    console.error('❌ Configuration validation failed:');
    errors.forEach(err => console.error(`  - ${err}`));

    if (throwOnError) {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }
  }

  if (warnings.length > 0 && logWarnings && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  Configuration warnings:');
    warnings.forEach(warn => console.warn(`  - ${warn}`));
  }

  if (errors.length === 0 && process.env.NODE_ENV !== 'production') {
    console.log('✅ Configuration validation passed');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Gets configuration value with fallback to default
 *
 * @param {string} key - Config key
 * @returns {string|undefined} Config value or default
 */
function getConfig(key) {
  const value = process.env[key];
  const schema = CONFIG_SCHEMA[key];

  if (!value && schema?.default) {
    return schema.default;
  }

  return value;
}

/**
 * Gets OpenAI API key with fallback logic
 * Prefers dedicated Brain Dumps key, falls back to general key
 *
 * @returns {string} OpenAI API key
 * @throws {Error} If no key is configured
 */
function getOpenAIKey() {
  const braindumpsKey = process.env.OPENAI_BRAINDUMPS_KEY;
  const generalKey = process.env.OPENAI_API_KEY;

  const key = braindumpsKey || generalKey;

  if (!key) {
    throw new Error(
      'OpenAI API key not configured. Set OPENAI_BRAINDUMPS_KEY or OPENAI_API_KEY environment variable.'
    );
  }

  return key;
}

/**
 * Checks if running in production environment
 *
 * @returns {boolean} True if production
 */
function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Checks if running in development environment
 *
 * @returns {boolean} True if development
 */
function isDevelopment() {
  return !isProduction();
}

/**
 * Safely masks sensitive configuration values for logging
 *
 * @param {string} value
 * @returns {string}
 */
function maskSensitiveValue(value) {
  if (!value) {
    return '<not set>';
  }
  if (value.length <= 8) {
    return '*'.repeat(value.length);
  }
  if (value.length <= 12) {
    return `${value.substring(0, 3)}***${value.substring(value.length - 2)}`;
  }
  return `${value.substring(0, 6)}...${value.substring(value.length - 4)}`;
}

/**
 * Gets safe config summary for logging (masks sensitive values)
 *
 * @returns {Object} Safe config summary
 */
function getConfigSummary() {
  const summary = {};

  for (const key of Object.keys(CONFIG_SCHEMA)) {
    const value = process.env[key];

    if (value) {
      if (
        key.includes('KEY') ||
        key.includes('SECRET') ||
        key.includes('DSN')
      ) {
        summary[key] = maskSensitiveValue(value);
      } else {
        summary[key] = value;
      }
    } else {
      summary[key] = '<not set>';
    }
  }

  return summary;
}

if (process.env.RUN_CONFIG_VALIDATION === 'true') {
  validateConfig({ throwOnError: true, logWarnings: false });
}

module.exports = {
  CONFIG_SCHEMA,
  getConfig,
  getConfigSummary,
  getOpenAIKey,
  isDevelopment,
  isProduction,
  maskSensitiveValue,
  validateConfig,
};

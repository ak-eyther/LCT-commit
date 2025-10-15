const { randomBytes } = require('crypto');

/**
 * Generates a unique 8-character error ID for tracking
 * Format: lowercase alphanumeric (e.g., "a3f2b1c4")
 *
 * @returns {string} Unique error ID
 */
function generateErrorId() {
  return randomBytes(4).toString('hex');
}

/**
 * Base class for all application errors
 * Automatically generates tracking IDs and structures error responses
 */
class AppError extends Error {
  /**
   * @param {string} message - User-friendly error message
   * @param {number} statusCode - HTTP status code
   * @param {Object} options - Additional error options
   * @param {string} options.errorId - Custom error ID (generated if not provided)
   * @param {string} options.code - Error code for programmatic handling
   * @param {Object} options.metadata - Additional error context
   */
  constructor(message, statusCode, options = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorId = options.errorId || generateErrorId();
    this.code = options.code;
    this.metadata = options.metadata || {};
    this.isOperational = true; // Distinguishes from programming errors

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Converts error to JSON response format
   * @returns {Object} JSON-serializable error object
   */
  toJSON() {
    return {
      success: false,
      error: this.message,
      errorId: this.errorId,
      code: this.code,
      ...(Object.keys(this.metadata).length > 0 && { metadata: this.metadata }),
    };
  }
}

/**
 * Validation Error (400 Bad Request)
 * Used for invalid user input
 */
class ValidationError extends AppError {
  constructor(message, options = {}) {
    super(message, 400, { ...options, code: 'VALIDATION_ERROR' });
  }
}

/**
 * Authentication Error (401 Unauthorized)
 * Used for missing or invalid authentication
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication required', options = {}) {
    super(message, 401, { ...options, code: 'AUTH_ERROR' });
  }
}

/**
 * Authorization Error (403 Forbidden)
 * Used when user lacks permission
 */
class AuthorizationError extends AppError {
  constructor(message = 'Permission denied', options = {}) {
    super(message, 403, { ...options, code: 'FORBIDDEN' });
  }
}

/**
 * Not Found Error (404)
 * Used when resource doesn't exist
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found', options = {}) {
    super(message, 404, { ...options, code: 'NOT_FOUND' });
  }
}

/**
 * Rate Limit Error (429)
 * Used when API rate limits are exceeded
 */
class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded', options = {}) {
    super(message, 429, { ...options, code: 'RATE_LIMIT' });
  }
}

/**
 * External API Error (502 Bad Gateway)
 * Used when external services (OpenAI, etc.) fail
 */
class ExternalAPIError extends AppError {
  constructor(message, options = {}) {
    super(message, 502, { ...options, code: 'EXTERNAL_API_ERROR' });
  }
}

/**
 * Service Unavailable Error (503)
 * Used for temporary service outages
 */
class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable', options = {}) {
    super(message, 503, { ...options, code: 'SERVICE_UNAVAILABLE' });
  }
}

/**
 * Internal Server Error (500)
 * Used for unexpected server errors
 */
class InternalServerError extends AppError {
  constructor(message = 'Internal server error', options = {}) {
    super(message, 500, { ...options, code: 'INTERNAL_ERROR' });
  }
}

/**
 * Extracts a header value from various header representations
 *
 * @param {Headers|Object|undefined} headers
 * @param {string} name
 * @returns {string|undefined}
 */
function getHeader(headers, name) {
  if (!headers) {
    return undefined;
  }
  if (typeof headers.get === 'function') {
    return headers.get(name) || headers.get(name.toLowerCase());
  }
  return headers[name] || headers[name.toLowerCase()];
}

/**
 * Wraps OpenAI API errors into appropriate AppError types
 *
 * @param {Error} error - OpenAI error object
 * @returns {AppError} Appropriate error type
 */
function handleOpenAIError(error) {
  const errorId = generateErrorId();

  const status = error?.status ?? error?.statusCode;
  const errObj = error?.error || {};
  const code = error?.code || errObj?.code || errObj?.type;
  const headers = error?.headers;
  const retryAfter =
    getHeader(headers, 'Retry-After') || getHeader(headers, 'retry-after');

  // Rate limit errors
  if (status === 429 || code === 'rate_limit_exceeded') {
    return new RateLimitError(
      'AI service rate limit exceeded. Please wait a moment and try again.',
      {
        errorId,
        metadata: {
          retryAfter,
          originalError: code,
        },
      }
    );
  }

  // Quota errors
  if (code === 'insufficient_quota') {
    return new ExternalAPIError(
      'AI service quota exceeded. Please try again later or contact support.',
      {
        errorId,
        metadata: { originalError: code },
      }
    );
  }

  // Authentication errors
  if (
    status === 401 ||
    code === 'invalid_api_key' ||
    code === 'authentication_error'
  ) {
    return new InternalServerError(
      'Server configuration error. Please contact support.',
      {
        errorId,
        metadata: { hint: 'API key invalid or missing' },
      }
    );
  }

  // Invalid request errors
  if (status === 400 || code === 'invalid_request_error') {
    return new ValidationError(
      'Invalid request to AI service. Please check your input.',
      {
        errorId,
      }
    );
  }

  // Service unavailable
  if (status === 503 || code === 'service_unavailable') {
    return new ServiceUnavailableError(
      'AI service temporarily unavailable. Please try again shortly.',
      {
        errorId,
        metadata: { originalError: code },
      }
    );
  }

  // Generic external API error
  return new ExternalAPIError(
    'AI service error. Please try again or contact support.',
    {
      errorId,
      metadata: {
        status,
        code,
        ...(retryAfter ? { retryAfter } : {}),
      },
    }
  );
}

module.exports = {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ExternalAPIError,
  InternalServerError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  ValidationError,
  generateErrorId,
  handleOpenAIError,
};

/**
 * Error Handling Infrastructure
 * Provides structured error classes with automatic ID generation for tracking
 *
 * @module lib/errors
 * @created October 14, 2025
 */

import { randomBytes } from 'crypto';

/**
 * Generates a unique 8-character error ID for tracking
 * Format: lowercase alphanumeric (e.g., "a3f2b1c4")
 *
 * @returns {string} Unique error ID
 */
export function generateErrorId() {
  return randomBytes(4).toString('hex');
}

/**
 * Base class for all application errors
 * Automatically generates tracking IDs and structures error responses
 */
export class AppError extends Error {
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

    // Capture stack trace
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
      ...(Object.keys(this.metadata).length > 0 && { metadata: this.metadata })
    };
  }
}

/**
 * Validation Error (400 Bad Request)
 * Used for invalid user input
 */
export class ValidationError extends AppError {
  constructor(message, options = {}) {
    super(message, 400, { code: 'VALIDATION_ERROR', ...options });
  }
}

/**
 * Authentication Error (401 Unauthorized)
 * Used for missing or invalid authentication
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required', options = {}) {
    super(message, 401, { code: 'AUTH_ERROR', ...options });
  }
}

/**
 * Authorization Error (403 Forbidden)
 * Used when user lacks permission
 */
export class AuthorizationError extends AppError {
  constructor(message = 'Permission denied', options = {}) {
    super(message, 403, { code: 'FORBIDDEN', ...options });
  }
}

/**
 * Not Found Error (404)
 * Used when resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', options = {}) {
    super(message, 404, { code: 'NOT_FOUND', ...options });
  }
}

/**
 * Rate Limit Error (429)
 * Used when API rate limits are exceeded
 */
export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded', options = {}) {
    super(message, 429, { code: 'RATE_LIMIT', ...options });
  }
}

/**
 * External API Error (502 Bad Gateway)
 * Used when external services (OpenAI, etc.) fail
 */
export class ExternalAPIError extends AppError {
  constructor(message, options = {}) {
    super(message, 502, { code: 'EXTERNAL_API_ERROR', ...options });
  }
}

/**
 * Service Unavailable Error (503)
 * Used for temporary service outages
 */
export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable', options = {}) {
    super(message, 503, { code: 'SERVICE_UNAVAILABLE', ...options });
  }
}

/**
 * Internal Server Error (500)
 * Used for unexpected server errors
 */
export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', options = {}) {
    super(message, 500, { code: 'INTERNAL_ERROR', ...options });
  }
}

/**
 * Wraps OpenAI API errors into appropriate AppError types
 *
 * @param {Error} error - OpenAI error object
 * @returns {AppError} Appropriate error type
 */
export function handleOpenAIError(error) {
  const errorId = generateErrorId();

  // Rate limit errors
  if (error.status === 429 || error.code === 'rate_limit_exceeded') {
    return new RateLimitError(
      'AI service rate limit exceeded. Please wait a moment and try again.',
      {
        errorId,
        metadata: {
          retryAfter: error.headers?.['retry-after'],
          originalError: error.code
        }
      }
    );
  }

  // Quota errors
  if (error.code === 'insufficient_quota') {
    return new ExternalAPIError(
      'AI service quota exceeded. Please try again later or contact support.',
      {
        errorId,
        metadata: { originalError: error.code }
      }
    );
  }

  // Authentication errors
  if (error.status === 401 || error.code === 'invalid_api_key') {
    return new InternalServerError(
      'Server configuration error. Please contact support.',
      {
        errorId,
        metadata: { hint: 'API key invalid or missing' }
      }
    );
  }

  // Invalid request errors
  if (error.status === 400 || error.code === 'invalid_request_error') {
    return new ValidationError(
      'Invalid request to AI service. Please check your input.',
      {
        errorId,
        metadata: { originalError: error.message }
      }
    );
  }

  // Service unavailable
  if (error.status === 503) {
    return new ServiceUnavailableError(
      'AI service temporarily unavailable. Please try again shortly.',
      {
        errorId,
        metadata: { originalError: error.code }
      }
    );
  }

  // Generic external API error
  return new ExternalAPIError(
    'AI service error. Please try again or contact support.',
    {
      errorId,
      metadata: {
        status: error.status,
        code: error.code,
        message: error.message
      }
    }
  );
}

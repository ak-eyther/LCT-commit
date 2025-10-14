/**
 * Error Handler Utilities for Vercel Serverless Functions
 * Provides consistent error response formatting and logging
 *
 * @module lib/error-handler
 * @created October 14, 2025
 */

import { AppError, InternalServerError, generateErrorId } from './errors.js';

/**
 * Sends error response with consistent format
 *
 * @param {Object} res - Vercel response object
 * @param {Error} error - Error object (AppError or native Error)
 * @param {Object} options - Additional options
 * @param {boolean} options.logToConsole - Whether to log error (default: true)
 * @param {boolean} options.includeStack - Whether to include stack trace in dev mode (default: false)
 */
export function sendErrorResponse(res, error, options = {}) {
  const { logToConsole = true, includeStack = false } = options;

  // Handle AppError instances
  if (error instanceof AppError) {
    if (logToConsole) {
      console.error(`[${error.errorId}] ${error.name}:`, error.message, {
        statusCode: error.statusCode,
        code: error.code,
        metadata: error.metadata,
        stack: error.stack
      });
    }

    return res.status(error.statusCode).json(error.toJSON());
  }

  // Handle native Error objects (unexpected errors)
  const errorId = generateErrorId();
  const statusCode = error.statusCode || 500;
  const message = error.isOperational
    ? error.message
    : 'An unexpected error occurred. Please try again or contact support.';

  if (logToConsole) {
    console.error(`[${errorId}] Unexpected Error:`, error.message, {
      name: error.name,
      stack: error.stack
    });
  }

  const response = {
    success: false,
    error: message,
    errorId
  };

  // Include stack trace in development mode if requested
  if (includeStack && process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
}

/**
 * Sends success response with consistent format
 *
 * @param {Object} res - Vercel response object
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export function sendSuccessResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    ...data
  });
}

/**
 * Wraps async handler functions with error handling
 * Catches errors and sends appropriate error responses
 *
 * Usage:
 * ```javascript
 * export default asyncHandler(async (req, res) => {
 *   // Your handler code
 *   throw new ValidationError('Invalid input');
 * });
 * ```
 *
 * @param {Function} handler - Async handler function
 * @returns {Function} Wrapped handler with error handling
 */
export function asyncHandler(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
}

/**
 * Logs error with structured format for easier debugging and monitoring
 *
 * @param {Error} error - Error object
 * @param {Object} context - Additional context (request ID, user ID, etc.)
 */
export function logError(error, context = {}) {
  const errorId = error.errorId || generateErrorId();

  const logData = {
    errorId,
    timestamp: new Date().toISOString(),
    name: error.name,
    message: error.message,
    statusCode: error.statusCode,
    code: error.code,
    ...context
  };

  // Log to console (in production, this would go to a logging service)
  console.error('Error occurred:', JSON.stringify(logData, null, 2));

  // In production, send to Sentry/Datadog/etc.
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    // Example: Sentry.captureException(error, { tags: { errorId } });
  }

  return errorId;
}

/**
 * Validates request method and sends 405 if not allowed
 *
 * @param {Object} req - Vercel request object
 * @param {Object} res - Vercel response object
 * @param {string[]} allowedMethods - Array of allowed HTTP methods
 * @returns {boolean} True if method is allowed, false otherwise
 */
export function validateMethod(req, res, allowedMethods) {
  if (allowedMethods.includes(req.method)) {
    return true;
  }

  res.status(405).json({
    success: false,
    error: `Method not allowed. Use ${allowedMethods.join(', ')}.`,
    errorId: generateErrorId()
  });

  return false;
}

/**
 * Sets CORS headers for API endpoints
 *
 * @param {Object} res - Vercel response object
 * @param {Object} options - CORS options
 * @param {string} options.origin - Allowed origin (default: '*')
 * @param {string[]} options.methods - Allowed methods (default: ['POST', 'GET', 'OPTIONS'])
 * @param {string[]} options.headers - Allowed headers (default: ['Content-Type'])
 */
export function setCORSHeaders(res, options = {}) {
  const {
    origin = '*',
    methods = ['POST', 'GET', 'OPTIONS'],
    headers = ['Content-Type']
  } = options;

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', headers.join(', '));
}

/**
 * Handles OPTIONS preflight requests
 *
 * @param {Object} req - Vercel request object
 * @param {Object} res - Vercel response object
 * @returns {boolean} True if request was OPTIONS and was handled
 */
export function handlePreflightRequest(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

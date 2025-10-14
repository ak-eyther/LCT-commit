/**
 * Error Handler Utilities for Vercel Serverless Functions
 * Provides consistent error response formatting and logging
 *
 * @module lib/error-handler
 * @created October 14, 2025
 */

const {
  AppError,
  InternalServerError,
  generateErrorId,
} = require('./errors');

/**
 * Sends error response with consistent format
 *
 * @param {Object} res - Vercel response object
 * @param {Error} error - Error object (AppError or native Error)
 * @param {Object} options - Additional options
 * @param {boolean} options.logToConsole - Whether to log error (default: true)
 * @param {boolean} options.includeStack - Whether to include stack trace in dev mode (default: false)
 */
function sendErrorResponse(res, error, options = {}) {
  const { logToConsole = true, includeStack = false } = options;

  if (error instanceof AppError) {
    if (logToConsole) {
      console.error(`[${error.errorId}] ${error.name}:`, error.message, {
        statusCode: error.statusCode,
        code: error.code,
        metadata: error.metadata,
        stack: error.stack,
      });
    }

    return res.status(error.statusCode).json(error.toJSON());
  }

  const errorId = generateErrorId();
  const statusCode = error.statusCode || 500;
  const message = error.isOperational
    ? error.message
    : 'Unexpected error occurred. Please try again.';

  const formattedError = new InternalServerError(message, { errorId });

  if (logToConsole) {
    console.error(`[${errorId}] Unexpected error:`, {
      originalError: error,
      stack: error.stack,
    });
  }

  return res.status(statusCode).json({
    ...formattedError.toJSON(),
    ...(includeStack && process.env.NODE_ENV !== 'production'
      ? { stack: error.stack }
      : {}),
  });
}

/**
 * Sends success response with consistent format
 *
 * @param {Object} res - Vercel response object
 * @param {Object} data - Response payload
 * @param {number} [statusCode=200] - HTTP status code
 */
function sendSuccessResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

/**
 * Generates CORS headers for API responses
 *
 * @returns {Object} CORS headers
 */
function getCORSHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

/**
 * Sets CORS headers on response
 *
 * @param {Object} res - Response object
 * @param {Object} options - Override defaults
 */
function setCORSHeaders(res, options = {}) {
  const headers = {
    ...getCORSHeaders(),
    ...(options.origin ? { 'Access-Control-Allow-Origin': options.origin } : {}),
    ...(options.methods
      ? { 'Access-Control-Allow-Methods': options.methods.join(', ') }
      : {}),
    ...(options.headers
      ? { 'Access-Control-Allow-Headers': options.headers.join(', ') }
      : {}),
  };

  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
}

/**
 * Handles CORS preflight requests
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {boolean} True if request was handled as OPTIONS
 */
function handlePreflightRequest(req, res) {
  if (req.method === 'OPTIONS') {
    setCORSHeaders(res);
    res.status(204).end();
    return true;
  }
  return false;
}

/**
 * Validates request method
 *
 * @param {Object} req - Request object
 * @param {string|string[]} allowedMethods - Allowed HTTP methods
 * @throws {AppError} If method is not allowed
 */
function validateMethod(req, allowedMethods) {
  const methods = Array.isArray(allowedMethods)
    ? allowedMethods
    : [allowedMethods];

  if (!methods.includes(req.method)) {
    throw new AppError(
      `Method not allowed. Use ${methods.join(', ')}.`,
      405,
      {
        code: 'METHOD_NOT_ALLOWED',
      }
    );
  }
}

/**
 * Wraps async route handlers with consistent error handling
 *
 * @param {Function} handler - Async route handler
 * @returns {Function} Wrapped handler
 */
function withErrorHandling(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
}

module.exports = {
  getCORSHeaders,
  handlePreflightRequest,
  sendErrorResponse,
  sendSuccessResponse,
  setCORSHeaders,
  validateMethod,
  withErrorHandling,
};

/**
 * LCT Authentication - Shared Script
 *
 * This script provides authentication functions for all pages.
 * Include this script in all protected pages.
 */

// Authentication configuration constants
const AUTH_RETRY_DELAY_MS = 2000;
const AUTH_MAX_RETRIES = 1;

// Production-safe logging utility (client-side)
const logger = {
  error: (msg, data) => {
    // In development, log to console
    if (
      typeof process !== 'undefined' &&
      process.env?.NODE_ENV === 'production'
    ) {
      // In production, could send to error tracking service
      // e.g., Sentry, LogRocket, etc.
      return;
    }
    console.error(msg, data);
  },
  log: (msg, data) => {
    // In development, log to console
    if (
      typeof process !== 'undefined' &&
      process.env?.NODE_ENV === 'production'
    ) {
      return;
    }
    console.log(msg, data);
  },
  warn: (msg, data) => {
    // In development, log to console
    if (
      typeof process !== 'undefined' &&
      process.env?.NODE_ENV === 'production'
    ) {
      return;
    }
    console.warn(msg, data);
  },
};

/**
 * Verifies user authentication status
 * @async
 * @description Checks if user has valid JWT token and verifies it with backend
 * Includes network retry logic for transient failures
 * @returns {Promise<void>} Redirects to login if unauthorized
 */
async function checkAuth() {
  const token = localStorage.getItem('lctAuthToken');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  // Verify token with backend
  try {
    const response = await fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      localStorage.removeItem('lctAuthToken');
      localStorage.removeItem('lctUser');
      localStorage.removeItem('lctRememberMe');
      window.location.href = '/login.html';
    }
  } catch (error) {
    logger.error('Auth verification failed:', {
      message: error.message,
      type: error.name,
      timestamp: new Date().toISOString(),
    });

    // Check if it's a network error (TypeError for fetch failures)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Network error - retry once after brief delay
      logger.log('Network error detected, retrying authentication...');
      try {
        await new Promise(resolve => setTimeout(resolve, AUTH_RETRY_DELAY_MS));
        const retryResponse = await fetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (retryResponse.ok) {
          logger.log('Authentication retry successful');
          return; // Success, don't log out
        }
      } catch (retryError) {
        logger.error('Retry failed:', retryError);
      }
    }

    // Clear auth data and redirect
    localStorage.removeItem('lctAuthToken');
    localStorage.removeItem('lctUser');
    localStorage.removeItem('lctRememberMe');
    window.location.href = '/login.html';
  }
}

/**
 * Logs out the current user
 * @async
 * @description Calls logout API and clears local storage
 * @returns {Promise<void>} Redirects to login page
 */
async function logout() {
  const token = localStorage.getItem('lctAuthToken');

  // Call logout API (optional)
  if (token) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      logger.error('Logout API call failed:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      });
      // Continue with client-side logout even if API fails
    }
  }

  // Clear local storage
  localStorage.removeItem('lctAuthToken');
  localStorage.removeItem('lctUser');
  localStorage.removeItem('lctRememberMe');

  // Redirect to login
  window.location.href = '/login.html';
}

/**
 * Gets current user information from localStorage
 * @description Safely parses and validates user data
 * @returns {Object|null} User object with id and email, or null if not found/invalid
 */
function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('lctUser');
    if (!userStr) return null;

    const user = JSON.parse(userStr);

    // Validate structure
    if (!user || !user.email || !user.id) {
      logger.warn('Corrupted user data in localStorage');
      localStorage.removeItem('lctUser');
      return null;
    }

    return user;
  } catch (error) {
    logger.error('Failed to parse user data:', error);
    // Clear corrupted data
    localStorage.removeItem('lctUser');
    return null;
  }
}

/**
 * Quick check if user is logged in
 * @description Checks localStorage for auth token (no API call)
 * @returns {boolean} True if token exists, false otherwise
 */
function isLoggedIn() {
  return !!localStorage.getItem('lctAuthToken');
}

// Auto-run auth check when script loads
if (typeof window !== 'undefined') {
  // Only run auth check if not on login page
  if (!window.location.pathname.includes('login.html')) {
    checkAuth();
  }
}

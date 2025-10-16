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
      return;
    }

    const data = await response.json().catch(() => null);
    const user = data?.user;

    if (user) {
      const normalizedRole = user.role || 'user';
      user.role = normalizedRole;
      localStorage.setItem('lctUser', JSON.stringify(user));
      document.documentElement.setAttribute('data-user-role', normalizedRole);

      const requiredRole = window?.lctAuthConfig?.requiredRole;
      if (requiredRole && normalizedRole !== requiredRole) {
        alert('You do not have permission to access this page.');
        window.location.href = '/';
        return;
      }

      window.dispatchEvent(
        new CustomEvent('lct-auth-ready', { detail: user })
      );
    }

    bindLogoutLink();
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
          const data = await retryResponse.json().catch(() => null);
          const user = data?.user;
          if (user) {
            const normalizedRole = user.role || 'user';
            user.role = normalizedRole;
            localStorage.setItem('lctUser', JSON.stringify(user));
            document.documentElement.setAttribute(
              'data-user-role',
              normalizedRole
            );
            window.dispatchEvent(
              new CustomEvent('lct-auth-ready', { detail: user })
            );
          }
          bindLogoutLink();
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

    if (!user.role) {
      user.role = 'user';
      localStorage.setItem('lctUser', JSON.stringify(user));
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

function bindLogoutLink() {
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink && !logoutLink.dataset.boundLogout) {
    logoutLink.addEventListener('click', event => {
      event.preventDefault();
      logout();
    });
    logoutLink.dataset.boundLogout = 'true';
  }
}

// Auto-run auth check when script loads
if (typeof window !== 'undefined') {
  // Only run auth check if not on login page
  const { pathname } = window.location;
  if (!pathname.includes('login.html')) {
    checkAuth();
  }

  document.addEventListener('DOMContentLoaded', bindLogoutLink);
}

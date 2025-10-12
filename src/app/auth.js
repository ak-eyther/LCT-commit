/**
 * LCT Commit - Authentication Module
 * Handles user authentication and session management
 */

/**
 * Gets the current user from localStorage
 * @returns {Object|null} User object or null if not logged in or data is malformed
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('lctUser');
    if (!userStr) return null;
    
    try {
        return JSON.parse(userStr);
    } catch (error) {
        // Log warning for debugging
        console.warn('Failed to parse stored user data. Removing corrupted entry.', error);
        // Remove corrupted data to prevent repeated errors
        localStorage.removeItem('lctUser');
        return null;
    }
}

/**
 * Logs in a user and stores credentials in localStorage
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Object} Result object with success status and user data or error message
 */
function login(username, password) {
    // TODO: Replace with actual API call to backend authentication service
    // This is a placeholder implementation for development
    
    if (!username || !password) {
        return {
            success: false,
            error: 'Username and password are required'
        };
    }
    
    // Placeholder validation - replace with actual authentication
    const user = {
        username: username,
        role: 'user',
        loginTime: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('lctUser', JSON.stringify(user));
        return {
            success: true,
            user: user
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to store user session'
        };
    }
}

/**
 * Logs out the current user
 */
function logout() {
    localStorage.removeItem('lctUser');
}

/**
 * Checks if a user is currently logged in
 * @returns {boolean} True if user is logged in, false otherwise
 */
function isLoggedIn() {
    return getCurrentUser() !== null;
}

/**
 * Gets the current user's role
 * @returns {string|null} User role or null if not logged in
 */
function getUserRole() {
    const user = getCurrentUser();
    return user ? user.role : null;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentUser,
        login,
        logout,
        isLoggedIn,
        getUserRole
    };
}

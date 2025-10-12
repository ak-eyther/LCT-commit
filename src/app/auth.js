/**
 * LCT Authentication - Shared Script
 * 
 * This script provides authentication functions for all pages.
 * Include this script in all protected pages.
 */

// Authentication check - must be called on page load
async function checkAuth() {
    const token = localStorage.getItem('lctAuthToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    
    // Verify token with backend
    try {
        const response = await fetch('/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            localStorage.removeItem('lctAuthToken');
            localStorage.removeItem('lctUser');
            localStorage.removeItem('lctRememberMe');
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Auth verification failed:', error);
        localStorage.removeItem('lctAuthToken');
        localStorage.removeItem('lctUser');
        localStorage.removeItem('lctRememberMe');
        window.location.href = '/login.html';
    }
}

// Logout function
async function logout() {
    const token = localStorage.getItem('lctAuthToken');
    
    // Call logout API (optional)
    if (token) {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Logout API call failed:', error);
        }
    }
    
    // Clear local storage
    localStorage.removeItem('lctAuthToken');
    localStorage.removeItem('lctUser');
    localStorage.removeItem('lctRememberMe');
    
    // Redirect to login
    window.location.href = '/login.html';
}

// Get current user info
function getCurrentUser() {
    const userStr = localStorage.getItem('lctUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Check if user is logged in (without API call)
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

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
        console.error('Auth verification failed:', {
            message: error.message,
            type: error.name,
            timestamp: new Date().toISOString()
        });

        // Check if it's a network error (TypeError for fetch failures)
        if (error instanceof TypeError && error.message.includes('fetch')) {
            // Network error - retry once after brief delay
            console.log('Network error detected, retrying authentication...');
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                const retryResponse = await fetch('/api/auth/verify', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (retryResponse.ok) {
                    console.log('Authentication retry successful');
                    return; // Success, don't log out
                }
            } catch (retryError) {
                console.error('Retry failed:', retryError);
            }
        }

        // Clear auth data and redirect
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
            console.error('Logout API call failed:', {
                message: error.message,
                timestamp: new Date().toISOString()
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

// Get current user info
function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('lctUser');
        if (!userStr) return null;

        const user = JSON.parse(userStr);

        // Validate structure
        if (!user || !user.email || !user.id) {
            console.warn('Corrupted user data in localStorage');
            localStorage.removeItem('lctUser');
            return null;
        }

        return user;
    } catch (error) {
        console.error('Failed to parse user data:', error);
        // Clear corrupted data
        localStorage.removeItem('lctUser');
        return null;
    }
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

# LCT Healthcare Claims System - Authentication Documentation

**Last Updated:** October 12, 2025  
**Version:** 1.0.0  
**Status:** Implemented

---

## Overview

This document describes the authentication system for the LCT Healthcare Claims Adjudication System. The implementation includes a secure login flow with proper "Remember Me" functionality that extends session duration.

## Features

### ✅ Implemented Features

1. **JWT Token-Based Authentication**
   - Industry-standard JSON Web Tokens
   - Secure token generation and verification
   - Automatic expiration handling

2. **Extended Session Support ("Remember Me")**
   - **Default (unchecked):** Session expires in 1 hour
   - **Remember Me (checked):** Session lasts 7 days
   - Clear user communication about session duration

3. **Security Best Practices**
   - Password hashing (ready for bcrypt integration)
   - Input validation and sanitization
   - Secure error messages (no information leakage)
   - Token expiration tracking
   - HTTPS recommended for production

4. **Accessibility**
   - WCAG 2.2 compliant
   - Proper ARIA labels
   - Keyboard navigation support
   - Screen reader friendly

## File Structure

```
LCT-commit/
├── src/app/
│   └── login.html          # Login page with Remember Me feature
├── api/
│   └── auth/
│       └── login.js        # Login API endpoint with JWT generation
└── docs/
    └── AUTHENTICATION.md   # This file
```

## How It Works

### 1. Login Flow

```
User enters credentials
    ↓
Clicks "Keep me logged in" (optional)
    ↓
Submits form
    ↓
API validates credentials
    ↓
API generates JWT token:
  - If Remember Me checked: 7-day expiration
  - If Remember Me unchecked: 1-hour expiration
    ↓
Client stores token and expiration time
    ↓
Client redirects to dashboard
```

### 2. Token Structure

The JWT token includes:

```json
{
  "userId": "1",
  "username": "admin",
  "role": "admin",
  "iat": 1697097600,  // Issued at timestamp
  "exp": 1697184000   // Expiration timestamp
}
```

### 3. Token Storage

The client stores the following in localStorage:

- `lctAuthToken`: The JWT token
- `lctRememberMe`: Boolean flag ('true' or 'false')
- `lctTokenExpiry`: ISO timestamp of when token expires
- `lctUser`: User information (JSON)

### 4. Session Validation

On every page load:
1. Check if token exists in localStorage
2. Check if token expiration time has passed
3. If expired: Clear storage, redirect to login
4. If valid: Continue to protected page

## API Endpoints

### POST /api/auth/login

Authenticates user and returns JWT token with appropriate expiration.

**Request Body:**
```json
{
  "username": "admin",
  "password": "secure_password",
  "rememberMe": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2025-10-19T12:00:00.000Z",
  "expiresIn": "7d",
  "user": {
    "id": "1",
    "username": "admin",
    "email": "admin@lct.co.ke",
    "role": "admin",
    "name": "System Administrator"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Username and password are required"
}
```

## Security Considerations

### ⚠️ Important Security Notes

1. **JWT Secret**
   - Change `JWT_SECRET` in production
   - Use environment variables (`.env` file)
   - Never commit secrets to version control

2. **Password Security**
   - Demo uses simplified authentication
   - Production MUST use bcrypt for password hashing
   - Minimum password length: 8 characters (recommended)

3. **HTTPS Required**
   - Always use HTTPS in production
   - Prevents token interception
   - Protects user credentials

4. **Token Storage**
   - localStorage is used for simplicity
   - Consider httpOnly cookies for enhanced security
   - Implement token refresh mechanism

5. **Rate Limiting**
   - Add rate limiting to prevent brute force attacks
   - Recommended: 5 attempts per 15 minutes

### 🔐 Production Checklist

Before deploying to production:

- [ ] Replace JWT secret with environment variable
- [ ] Implement bcrypt password hashing
- [ ] Add rate limiting middleware
- [ ] Enable HTTPS
- [ ] Add token refresh endpoint
- [ ] Implement password reset flow
- [ ] Add multi-factor authentication (MFA)
- [ ] Set up security monitoring
- [ ] Conduct security audit
- [ ] Test with real user database

## User Experience

### Login Page Features

1. **Clear Instructions**
   - Checkbox label: "Keep me logged in"
   - Helper text: "Unchecked: Session expires in 1 hour | Checked: Session lasts 7 days"

2. **Visual Feedback**
   - Loading spinner during authentication
   - Success/error messages
   - Disabled button during submission

3. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - High contrast mode compatible
   - Touch-friendly on mobile

4. **Error Handling**
   - Clear error messages
   - No sensitive information leakage
   - Helpful guidance for users

## Demo Users

For testing purposes (REMOVE IN PRODUCTION):

| Username | Email | Role | Password |
|----------|-------|------|----------|
| admin | admin@lct.co.ke | admin | Any 6+ chars |
| reviewer | reviewer@lct.co.ke | reviewer | Any 6+ chars |
| auditor | auditor@lct.co.ke | auditor | Any 6+ chars |

## Integration with Other Pages

### Protected Routes

To protect a page, add this check at the top of your HTML:

```html
<script>
// Check authentication
const token = localStorage.getItem('lctAuthToken');
const expiry = localStorage.getItem('lctTokenExpiry');

if (!token || !expiry) {
    window.location.href = '/src/app/login.html';
} else {
    const now = new Date().getTime();
    const expiryTime = new Date(expiry).getTime();
    
    if (expiryTime <= now) {
        // Token expired
        localStorage.clear();
        window.location.href = '/src/app/login.html';
    }
}
</script>
```

### Logout Function

Add this to your navigation:

```javascript
function logout() {
    // Clear all auth data
    localStorage.removeItem('lctAuthToken');
    localStorage.removeItem('lctRememberMe');
    localStorage.removeItem('lctTokenExpiry');
    localStorage.removeItem('lctUser');
    
    // Redirect to login
    window.location.href = '/src/app/login.html';
}
```

### Get Current User

```javascript
function getCurrentUser() {
    const userJson = localStorage.getItem('lctUser');
    if (userJson) {
        try {
            return JSON.parse(userJson);
        } catch (e) {
            console.error('Failed to parse user data');
            return null;
        }
    }
    return null;
}
```

## Testing

### Manual Testing Steps

1. **Test Default Login (1-hour session)**
   - Open `src/app/login.html`
   - Enter username: `admin`
   - Enter password: `test123`
   - Leave "Keep me logged in" unchecked
   - Click Login
   - Verify redirect to dashboard
   - Check localStorage: `lctRememberMe` should be 'false'
   - Check token expiration is ~1 hour from now

2. **Test Remember Me (7-day session)**
   - Clear localStorage
   - Return to login page
   - Enter credentials
   - Check "Keep me logged in"
   - Click Login
   - Verify redirect to dashboard
   - Check localStorage: `lctRememberMe` should be 'true'
   - Check token expiration is ~7 days from now

3. **Test Token Expiration**
   - Login with 1-hour session
   - Manually change `lctTokenExpiry` to a past date
   - Refresh page or navigate
   - Verify redirect to login page
   - Verify localStorage is cleared

4. **Test Error Handling**
   - Try empty username/password
   - Try invalid credentials
   - Verify error messages display correctly
   - Verify no sensitive information is exposed

## Troubleshooting

### Common Issues

**Issue:** Login button stays disabled  
**Solution:** Check browser console for errors. Ensure API endpoint is accessible.

**Issue:** Token expires immediately  
**Solution:** Check system time. Ensure server and client clocks are synchronized.

**Issue:** Redirect loop to login page  
**Solution:** Check token expiration format. Verify localStorage is not blocked.

**Issue:** "Remember Me" not working  
**Solution:** Verify `rememberMe` parameter is being sent to API correctly.

## Future Enhancements

Planned improvements:

1. **Token Refresh**
   - Automatic token refresh before expiration
   - Refresh token rotation

2. **Multi-Factor Authentication (MFA)**
   - SMS verification
   - Authenticator app support

3. **Password Reset**
   - Email-based password reset
   - Security questions

4. **Session Management**
   - View active sessions
   - Revoke sessions remotely

5. **Audit Logging**
   - Track login attempts
   - Monitor suspicious activity

## Related Documents

- [Security Best Practices](./SECURITY_BEST_PRACTICES.md)
- [Sentinel Code Review](./SENTINEL_README.md)
- [Project Context](../CLAUDE.md)

## Support

For questions or issues:

1. Check this documentation
2. Review code comments in `login.html` and `api/auth/login.js`
3. Contact: LCT-Vitraya Development Team

---

**Remember:** This authentication system resolves the "misleading Remember Me" issue identified in Linear issue VIT-33. The feature now works as users expect, with clear communication about session duration.

**Security Note:** Always prioritize security over convenience. When in doubt, consult security best practices and conduct regular security audits.

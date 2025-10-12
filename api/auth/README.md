# Authentication API

## Overview
This directory contains authentication endpoints for the LCT-Vitraya Healthcare Claims system.

## Endpoints

### POST /api/auth/verify
Verifies JWT tokens and returns user information.

#### Request
```http
POST /api/auth/verify
Authorization: Bearer <jwt-token>
```

#### Response - Success (200)
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

#### Response - Missing Token (401)
```json
{
  "success": false,
  "error": "No token provided"
}
```

#### Response - Invalid Token (401)
```json
{
  "success": false,
  "error": "Invalid token"
}
```

#### Response - Token Expired (401)
```json
{
  "success": false,
  "error": "Token expired"
}
```

#### Response - Server Misconfiguration (500)
```json
{
  "success": false,
  "error": "Server configuration error"
}
```

## Security Features

### JWT_SECRET Validation
The authentication system validates that `JWT_SECRET` is configured before attempting token verification. This prevents cryptic errors and provides clear feedback when the server is misconfigured.

**Implementation:**
```javascript
if (!process.env.JWT_SECRET) {
  return res.status(500).json({
    success: false,
    error: 'Server configuration error'
  });
}
```

This security feature was added to resolve **VIT-27** (HIGH priority issue from AI code review).

## Configuration

### Environment Variables
Required environment variables:
- `JWT_SECRET`: Secret key for JWT token signing and verification

Add to your `.env` file:
```bash
# Generate a secure secret:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Security Best Practices
1. **Never commit** JWT_SECRET to version control
2. Use a **strong, random secret** (minimum 32 characters)
3. **Rotate secrets** regularly in production
4. Use different secrets for **development and production**
5. Store secrets in **environment variables** or secure vaults

## Testing

### Unit Tests
Run authentication tests:
```bash
node tests/unit/test-auth-verify.js
```

Test coverage:
- Missing Authorization header
- Invalid Authorization format
- JWT_SECRET not configured (VIT-27 fix)
- Invalid JWT token
- Token expiration
- Valid token verification

## Error Handling
All errors are handled gracefully with appropriate HTTP status codes:
- `401 Unauthorized`: Authentication issues (missing/invalid token)
- `500 Internal Server Error`: Server configuration issues

## Related Issues
- **VIT-27**: Add JWT_SECRET check to auth verification (HIGH priority)
- **PR #31**: feat: Implement authentication system

## Changelog
- **2025-10-12**: Added JWT_SECRET validation check (VIT-27)
- **2025-10-12**: Initial authentication verification endpoint

## Support
For questions or issues, contact the LCT-Vitraya development team.

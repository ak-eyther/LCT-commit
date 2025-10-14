# Error Handling Architecture

**Version:** 1.0.0
**Last Updated:** October 14, 2025
**Status:** Implemented in Brain Dumps feature, ready for project-wide adoption

---

## Overview

This document describes the error handling architecture implemented across the LCT-Vitraya project, focusing on trackability, specificity, and production-readiness.

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  (Displays error message + error ID for support)        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│               API Endpoint Handler                       │
│  - Validates input                                       │
│  - Catches errors                                        │
│  - Calls sendErrorResponse()                            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│             Error Handler Utility                        │
│  (src/lib/error-handler.js)                             │
│  - Formats error response                                │
│  - Adds error ID if missing                              │
│  - Logs error with context                               │
│  - Returns JSON response                                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Error Classes                               │
│  (src/lib/errors.js)                                     │
│  - ValidationError (400)                                 │
│  - RateLimitError (429)                                  │
│  - InternalServerError (500)                             │
│  - ExternalAPIError (502)                                │
│  - ServiceUnavailableError (503)                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│            Logging & Monitoring                          │
│  - Console logs with error ID                            │
│  - Sentry (production)                                   │
│  - Linear issue creation (optional)                      │
└─────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Error Classes (`src/lib/errors.js`)

**Purpose:** Define error types with automatic tracking IDs

**Key Classes:**
- `AppError` - Base class for all errors
- `ValidationError` - User input errors (400)
- `AuthenticationError` - Login required (401)
- `AuthorizationError` - Permission denied (403)
- `NotFoundError` - Resource not found (404)
- `RateLimitError` - Too many requests (429)
- `InternalServerError` - Unexpected errors (500)
- `ExternalAPIError` - Third-party service failures (502)
- `ServiceUnavailableError` - Temporary outages (503)

**Key Functions:**
- `generateErrorId()` - Creates unique 8-char tracking ID
- `handleOpenAIError()` - Maps OpenAI errors to our error types

**Features:**
- Automatic error ID generation
- Correct HTTP status codes
- JSON serialization with `toJSON()`
- Optional metadata for additional context

---

### 2. Error Handler Utilities (`src/lib/error-handler.js`)

**Purpose:** Consistent error response formatting

**Key Functions:**

**`sendErrorResponse(res, error)`**
- Handles both AppError and native Error objects
- Logs error with context
- Returns standardized JSON response
- Masks sensitive data from users

**`sendSuccessResponse(res, data)`**
- Consistent success response format
- Always includes `success: true`

**`validateMethod(req, res, allowedMethods)`**
- Checks if HTTP method is allowed
- Returns 405 if method not allowed

**`setCORSHeaders(res)`**
- Sets CORS headers for API endpoints

**`handlePreflightRequest(req, res)`**
- Handles OPTIONS preflight requests

---

### 3. Config Validation (`src/lib/config.js`)

**Purpose:** Fail fast if environment is misconfigured

**Key Functions:**

**`validateConfig()`**
- Checks all required environment variables
- Validates format (e.g., API keys start with "sk-")
- Logs warnings for missing optional vars
- Can throw error or return validation result

**`getOpenAIKey()`**
- Returns OpenAI API key with fallback logic
- Prefers OPENAI_BRAINDUMPS_KEY over OPENAI_API_KEY
- Throws clear error if no key configured

**`getConfigSummary()`**
- Returns safe config summary for logging
- Masks sensitive values (shows first 8 + last 4 chars)

---

## Error Flow

### Happy Path (No Errors)

```javascript
Request → Validation → Business Logic → Success Response
```

### Error Path (Validation Error)

```javascript
Request → Validation ✗
  → ValidationError thrown
  → sendErrorResponse()
  → { success: false, error: "...", errorId: "a3f2b1c4" }
  → HTTP 400
```

### Error Path (External API Error)

```javascript
Request → Validation ✓ → OpenAI API call ✗
  → OpenAI error caught
  → handleOpenAIError()
  → RateLimitError thrown
  → sendErrorResponse()
  → { success: false, error: "Rate limit exceeded", errorId: "b4c3a2d1", metadata: { retryAfter: 60 } }
  → HTTP 429
```

---

## Error Response Format

### Standard Error Response

```json
{
  "success": false,
  "error": "User-friendly error message",
  "errorId": "a3f2b1c4",
  "code": "VALIDATION_ERROR",
  "metadata": {
    "hint": "Additional context for debugging"
  }
}
```

**Fields:**
- `success` (boolean) - Always `false` for errors
- `error` (string) - User-friendly message
- `errorId` (string) - 8-char tracking ID (always present)
- `code` (string) - Error code for programmatic handling (optional)
- `metadata` (object) - Additional context (optional)

### Standard Success Response

```json
{
  "success": true,
  "...data": "..."
}
```

---

## Error ID Generation

**Format:** 8 lowercase alphanumeric characters
**Example:** `a3f2b1c4`
**Method:** `crypto.randomBytes(4).toString('hex')`

**Why crypto random?**
- Collision-resistant (very low probability of duplicates)
- Unpredictable (security benefit)
- Standard across all platforms

**Why 8 characters?**
- Easy to communicate verbally
- Short enough for screenshots
- Long enough to be unique (16^8 = 4.3 billion combinations)

---

## Logging Strategy

### Development

```javascript
console.error(`[${errorId}] ${error.name}:`, error.message, {
  statusCode: error.statusCode,
  code: error.code,
  metadata: error.metadata,
  stack: error.stack
});
```

### Production

**Console logs** (captured by Vercel):
```javascript
console.error(`[${errorId}] ${error.name}:`, {
  message: error.message,
  statusCode: error.statusCode,
  code: error.code,
  timestamp: new Date().toISOString(),
  // NO stack traces, NO sensitive data
});
```

**Sentry integration** (future):
```javascript
Sentry.captureException(error, {
  tags: { errorId },
  level: error.statusCode >= 500 ? 'error' : 'warning'
});
```

---

## Configuration Validation Strategy

### Module-Level Validation (Serverless)

Vercel serverless functions validate on each cold start:

```javascript
// api/brain-dumps/process.js
import { validateConfig, getOpenAIKey } from '../../src/lib/config.js';

// Validate on cold start
const configValidation = validateConfig({ logWarnings: false });
if (!configValidation.valid) {
  console.error('Config errors:', configValidation.errors);
}

// Initialize with validated config
const apiKey = getOpenAIKey(); // Throws if missing
const openai = new OpenAI({ apiKey });
```

### Server-Level Validation (Express/Next.js)

For traditional servers, validate once at startup:

```javascript
// server.js
import { validateConfig } from './src/lib/config.js';

const validation = validateConfig({ throwOnError: true });
if (!validation.valid) {
  process.exit(1); // Don't start server if misconfigured
}

app.listen(3000);
```

---

## Integration Points

### Frontend Integration

```javascript
async function callAPI(data) {
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      // Show error message + error ID
      showError(`${result.error}\n\nError ID: ${result.errorId}`);
      return null;
    }

    return result;

  } catch (networkError) {
    showError('Network error. Please check your connection.');
    return null;
  }
}
```

### Support Team Integration

**User reports:** "I got error ID a3f2b1c4"

**Support searches:**
```bash
# Vercel logs
vercel logs | grep "a3f2b1c4"

# Local logs
grep "a3f2b1c4" /var/log/app.log

# Sentry (future)
# Search by tag: errorId:a3f2b1c4
```

---

## Security Considerations

### What Gets Logged

✅ **Safe to log:**
- Error IDs
- Error types and codes
- HTTP status codes
- Request method and path
- Timestamps
- Generic error messages

❌ **Never log:**
- API keys or secrets
- Passwords or tokens
- Patient data (PHI)
- Financial information
- Stack traces (production only)

### What Gets Sent to Users

✅ **Safe to send:**
- User-friendly error messages
- Error IDs
- Error codes
- Retry suggestions

❌ **Never send:**
- Stack traces
- File paths
- API keys
- Database connection strings
- Internal error details

---

## Performance Considerations

### Error ID Generation

- **Time:** <1ms per ID
- **Memory:** Negligible (8 bytes per ID)
- **Collisions:** Extremely rare (1 in 4.3 billion)

### Error Handling Overhead

- **Validation:** <5ms
- **Error formatting:** <1ms
- **Logging:** <10ms
- **Total:** <20ms per error

**Negligible compared to API calls (2-10 seconds)**

---

## Future Enhancements

### Phase 3 (Next Sprint)
- [ ] Sentry integration for error tracking
- [ ] Automatic Linear issue creation from critical errors
- [ ] Error rate monitoring dashboard
- [ ] Alert rules for error spikes

### Phase 4 (Q1 2026)
- [ ] Error pattern analysis (ML-based)
- [ ] Automatic retry logic for transient errors
- [ ] User-facing error recovery suggestions
- [ ] Error categorization and prioritization

---

## Migration Guide

### For Existing Endpoints

**Before:**
```javascript
export default async function handler(req, res) {
  try {
    // Everything in one try-catch
    if (!req.body.field) {
      return res.status(400).json({ error: 'Field required' });
    }

    const result = await callAPI();
    return res.status(200).json({ result });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
```

**After:**
```javascript
import { ValidationError, handleOpenAIError } from '../../src/lib/errors.js';
import { sendErrorResponse, sendSuccessResponse } from '../../src/lib/error-handler.js';

function validateInput(data) {
  if (!data.field) throw new ValidationError('Field required');
}

export default async function handler(req, res) {
  try {
    validateInput(req.body);

    let result;
    try {
      result = await callAPI();
    } catch (apiError) {
      throw handleOpenAIError(apiError);
    }

    return sendSuccessResponse(res, { result });

  } catch (error) {
    return sendErrorResponse(res, error);
  }
}
```

---

## Testing Strategy

See: `tests/integration/brain-dumps-api-contract.test.js`

**Test coverage:**
- ✅ All error types return correct status codes
- ✅ All errors include tracking IDs
- ✅ Error IDs are unique
- ✅ Validation errors are user-friendly
- ✅ Secrets are never exposed
- ✅ CORS headers are set

---

## Related Documentation

- **Developer Guide:** `docs/development/ERROR_HANDLING_GUIDE.md`
- **Sentinel Checklist:** `.claude/checklists/error-handling-checklist.md`
- **API Contract Example:** `docs/features/brain-dumps/api-response-spec.md`
- **Source Code:**
  - `src/lib/errors.js`
  - `src/lib/error-handler.js`
  - `src/lib/config.js`

---

**Architecture Status:** ✅ Production-Ready
**Adoption Status:** Implemented in Brain Dumps, ready for project-wide rollout

# Error Handling Guide

**Version:** 1.0.0
**Last Updated:** October 14, 2025
**Audience:** Developers working on LCT-Vitraya project

---

## 📖 Table of Contents

1. [Quick Start](#quick-start)
2. [Core Principles](#core-principles)
3. [Error Infrastructure](#error-infrastructure)
4. [Common Scenarios](#common-scenarios)
5. [Best Practices](#best-practices)
6. [Anti-Patterns](#anti-patterns)
7. [Testing Errors](#testing-errors)

---

## Quick Start

### New to the project? Start here:

```javascript
// 1. Import error utilities
import { ValidationError, handleOpenAIError } from '../../src/lib/errors.js';
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '../../src/lib/error-handler.js';
import { getOpenAIKey } from '../../src/lib/config.js';

// 2. Validate config at startup
const apiKey = getOpenAIKey(); // Throws if not configured

// 3. Validate input outside try-catch
function validateInput(data) {
  if (!data.email) throw new ValidationError('Email is required');
}

// 4. Handle errors in your endpoint
export default async function handler(req, res) {
  try {
    validateInput(req.body);

    const result = await doSomething();

    return sendSuccessResponse(res, { result });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
}
```

That's it! The infrastructure handles:

- ✅ Automatic error IDs
- ✅ Correct HTTP status codes
- ✅ Structured logging
- ✅ User-friendly messages

---

## Core Principles

### 1. **Every Error Needs an ID**

Users will report: "I got an error"
Support needs to find it in logs.

**Solution:** Every error gets a unique 8-character ID

```javascript
// Automatic with our infrastructure
throw new ValidationError('Email required');
// Returns: { success: false, error: "Email required", errorId: "a3f2b1c4" }
```

### 2. **Be Specific, Not Generic**

Different errors need different handling:

- User typo → 400 Bad Request
- API rate limit → 429 Too Many Requests
- Database down → 503 Service Unavailable

**Don't use:**

```javascript
catch (error) {
  return res.status(500).json({ error: 'Something went wrong' });
}
```

**Use:**

```javascript
import {
  ValidationError,
  ExternalAPIError,
  ServiceUnavailableError,
} from './errors.js';

// Throw specific types
throw new ValidationError('Invalid email format');
throw new ExternalAPIError('OpenAI API unavailable');
throw new ServiceUnavailableError('Database connection failed');
```

### 3. **User-Friendly Messages**

Users don't care about stack traces. They want to know:

- What went wrong?
- How to fix it?

**Bad:**

```
Error: ECONNREFUSED 127.0.0.1:5432
```

**Good:**

```
Unable to connect to database. Please try again in a few moments.
Error ID: c3d2e1f0 (Report this to support if issue persists)
```

### 4. **Log Everything (Securely)**

Logs are your time machine for debugging.

**What to log:**

- ✅ Error ID
- ✅ Timestamp (ISO 8601)
- ✅ Error type and message
- ✅ Request context (method, path)
- ✅ Stack trace

**What NOT to log:**

- ❌ API keys
- ❌ Passwords
- ❌ Patient data (PHI)
- ❌ Financial details

---

## Error Infrastructure

### Available Error Classes

Located in `src/lib/errors.js`:

```javascript
import {
  ValidationError, // 400 - Bad user input
  AuthenticationError, // 401 - Not logged in
  AuthorizationError, // 403 - No permission
  NotFoundError, // 404 - Resource doesn't exist
  RateLimitError, // 429 - Too many requests
  InternalServerError, // 500 - Unexpected error
  ExternalAPIError, // 502 - External service failed
  ServiceUnavailableError, // 503 - Service down
} from '../../src/lib/errors.js';
```

### Error Utilities

Located in `src/lib/error-handler.js`:

```javascript
import {
  sendErrorResponse, // Sends error with consistent format
  sendSuccessResponse, // Sends success with consistent format
  validateMethod, // Checks HTTP method
  setCORSHeaders, // Sets CORS headers
  handlePreflightRequest, // Handles OPTIONS requests
} from '../../src/lib/error-handler.js';
```

### Config Validation

Located in `src/lib/config.js`:

```javascript
import {
  validateConfig, // Validates all environment variables
  getOpenAIKey, // Gets OpenAI key with fallback
  isProduction, // Checks if production environment
  isDevelopment, // Checks if development environment
} from '../../src/lib/config.js';
```

---

## Common Scenarios

### Scenario 1: API Endpoint with Validation

```javascript
import { ValidationError } from '../../src/lib/errors.js';
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '../../src/lib/error-handler.js';

function validateMeetingData(data) {
  if (!data.title) {
    throw new ValidationError('Meeting title is required');
  }

  if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    throw new ValidationError('Date must be in YYYY-MM-DD format');
  }

  if (data.notes && data.notes.length > 100000) {
    throw new ValidationError('Notes must not exceed 100,000 characters');
  }
}

export default async function handler(req, res) {
  try {
    // Validate first (throws ValidationError if invalid)
    validateMeetingData(req.body);

    // Process request
    const result = await processMeeting(req.body);

    return sendSuccessResponse(res, { result });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
}
```

### Scenario 2: OpenAI API Calls

```javascript
import { handleOpenAIError } from '../../src/lib/errors.js';
import { sendErrorResponse } from '../../src/lib/error-handler.js';
import { getOpenAIKey } from '../../src/lib/config.js';
import OpenAI from 'openai';

// Validate config at module load
const apiKey = getOpenAIKey();
const openai = new OpenAI({ apiKey });

export default async function handler(req, res) {
  try {
    // Validate input first
    validateInput(req.body);

    // Call OpenAI
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: req.body.prompt }],
      });
    } catch (openaiError) {
      // Convert OpenAI errors to our error types
      throw handleOpenAIError(openaiError);
    }

    return sendSuccessResponse(res, { result: completion });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
}
```

**What handleOpenAIError does:**

- Rate limit (429) → RateLimitError with retry-after
- Quota exceeded → ExternalAPIError with support message
- Invalid key (401) → InternalServerError (masked from user)
- Bad request (400) → ValidationError with details
- All errors include tracking IDs

### Scenario 3: Database Operations

```javascript
import { ServiceUnavailableError } from '../../src/lib/errors.js';
import { sendErrorResponse } from '../../src/lib/error-handler.js';

export default async function handler(req, res) {
  try {
    validateInput(req.body);

    // Database operation
    let user;
    try {
      user = await db.user.create({ data: req.body });
    } catch (dbError) {
      // Database-specific error handling
      if (dbError.code === 'P2002') {
        // Unique constraint violation
        throw new ValidationError('Email already exists');
      }

      // Generic database error
      throw new ServiceUnavailableError(
        'Database temporarily unavailable. Please try again.',
        { metadata: { hint: 'Database connection failed' } }
      );
    }

    return sendSuccessResponse(res, { user });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
}
```

### Scenario 4: Multiple Async Operations

```javascript
import { InternalServerError } from '../../src/lib/errors.js';

export default async function handler(req, res) {
  try {
    validateInput(req.body);

    // Validate OpenAI response
    let aiResult;
    try {
      aiResult = await callOpenAI(req.body);
      validateAIResponse(aiResult);
    } catch (aiError) {
      throw handleOpenAIError(aiError);
    }

    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(aiResult.content);
    } catch (parseError) {
      throw new InternalServerError(
        'Failed to parse AI response. Please try again.',
        { metadata: { hint: 'JSON parsing failed' } }
      );
    }

    // Save to database
    try {
      await db.result.create({ data: parsed });
    } catch (dbError) {
      throw new ServiceUnavailableError('Failed to save result');
    }

    return sendSuccessResponse(res, { result: parsed });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
}
```

---

## Best Practices

### 1. Validate Config at Startup, Not Per-Request

**❌ Bad:** Check every request

```javascript
export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Not configured' });
  }
  // ...
}
```

**✅ Good:** Check once at module load

```javascript
import { getOpenAIKey } from '../../src/lib/config.js';

const apiKey = getOpenAIKey(); // Throws if missing
const openai = new OpenAI({ apiKey });

export default async function handler(req, res) {
  // apiKey is guaranteed to exist
}
```

### 2. Validate Input Before Expensive Operations

**❌ Bad:** API call before validation

```javascript
const result = await expensiveAPICall(data);
if (!data.field) throw new Error('Field required');
```

**✅ Good:** Validate first

```javascript
if (!data.field) throw new ValidationError('Field required');
const result = await expensiveAPICall(data);
```

### 3. Log Errors with Context

**❌ Bad:** Generic logging

```javascript
console.error('Error:', error);
```

**✅ Good:** Structured logging

```javascript
console.error(`[${error.errorId}] ${error.name}:`, error.message, {
  statusCode: error.statusCode,
  code: error.code,
  timestamp: new Date().toISOString(),
  method: req.method,
  path: req.url,
  stack: error.stack,
});
```

### 4. Test Error Scenarios

```javascript
// Test validation errors
test('returns 400 for missing email', async () => {
  const response = await request.post('/api/endpoint', { data: {} });
  expect(response.status).toBe(400);
  expect(response.body.error).toContain('email');
  expect(response.body.errorId).toHaveLength(8);
});

// Test OpenAI errors
test('handles rate limit errors', async () => {
  // Mock OpenAI to throw rate limit error
  const response = await request.post('/api/endpoint', { data: validData });
  expect(response.status).toBe(429);
  expect(response.body).toHaveProperty('errorId');
});
```

---

## Anti-Patterns

### ❌ Silent Failures

```javascript
try {
  await criticalOperation();
} catch (error) {
  // Empty catch - error is swallowed!
}
```

**Fix:** Always handle or rethrow

```javascript
try {
  await criticalOperation();
} catch (error) {
  logError(error);
  throw error;
}
```

### ❌ Generic Error Messages

```javascript
catch (error) {
  return res.status(500).json({ error: 'Something went wrong' });
}
```

**Fix:** Be specific

```javascript
catch (error) {
  return sendErrorResponse(res, error); // Automatically determines message
}
```

### ❌ Exposing Secrets

```javascript
return res.status(500).json({
  error: `API key ${process.env.API_KEY} is invalid`,
});
```

**Fix:** Mask sensitive data

```javascript
return res.status(500).json({
  error: 'Server configuration error. Please contact support.',
  errorId: generateErrorId(),
});
```

### ❌ Missing Error IDs

```javascript
return res.status(400).json({ error: 'Invalid input' });
```

**Fix:** Always include error ID

```javascript
throw new ValidationError('Invalid input'); // Automatically includes errorId
```

---

## Testing Errors

### Unit Tests

```javascript
import { ValidationError, generateErrorId } from '../../src/lib/errors.js';

test('ValidationError includes errorId', () => {
  const error = new ValidationError('Test error');
  expect(error.errorId).toHaveLength(8);
  expect(error.statusCode).toBe(400);
});

test('generateErrorId returns unique IDs', () => {
  const id1 = generateErrorId();
  const id2 = generateErrorId();
  expect(id1).not.toBe(id2);
});
```

### Integration Tests

See: `tests/integration/brain-dumps-api-contract.test.js`

```javascript
test('API returns error with tracking ID', async ({ request }) => {
  const response = await request.post('/api/endpoint', { data: {} });
  const data = await response.json();

  expect(response.status()).toBe(400);
  expect(data.success).toBe(false);
  expect(data).toHaveProperty('errorId');
  expect(data.errorId).toMatch(/^[a-z0-9]{8}$/);
});
```

---

## Quick Reference

**Import this:**

```javascript
import {
  ValidationError,
  ExternalAPIError,
  handleOpenAIError,
} from '../../src/lib/errors.js';

import {
  sendErrorResponse,
  sendSuccessResponse,
} from '../../src/lib/error-handler.js';

import { getOpenAIKey } from '../../src/lib/config.js';
```

**Template:**

```javascript
// Config validation
const apiKey = getOpenAIKey();

// Validation function
function validateInput(data) {
  if (!data.field) throw new ValidationError('Field required');
}

// Handler
export default async function handler(req, res) {
  try {
    validateInput(req.body);

    try {
      const result = await externalAPI();
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

## Related Documentation

- **Error Classes:** `src/lib/errors.js`
- **Error Handlers:** `src/lib/error-handler.js`
- **Config Validation:** `src/lib/config.js`
- **API Spec:** `docs/features/brain-dumps/api-response-spec.md`
- **Sentinel Checklist:** `.claude/checklists/error-handling-checklist.md`

---

## Questions?

- Check examples in `api/brain-dumps/process.js`
- Review API contract tests in `tests/integration/`
- Ask in #lct-development Slack channel

**Happy error handling! 🎯**

# Error Handling Review Checklist

**Version:** 1.0.0
**Created:** October 14, 2025
**Purpose:** Prevent error handling issues that lead to debugging nightmares in production

This checklist is used by Sentinel and other review agents to ensure consistent, trackable, production-ready error handling across the codebase.

---

## 🎯 Core Principles

All error handling must:
1. **Include tracking IDs** - Every error needs a unique ID for support
2. **Be specific** - Different error types require different handling
3. **Be user-friendly** - Error messages must help users, not confuse them
4. **Be secure** - Never expose sensitive data in errors
5. **Be logged** - Structured logging with context for debugging

---

## ✅ Checklist

### 1. Error Tracking IDs

**Rule:** All error responses MUST include a unique tracking ID

**Check:**
- [ ] Every error response includes `errorId` field
- [ ] Error ID format is consistent (8-char lowercase alphanumeric recommended)
- [ ] Error ID is generated using crypto random, not timestamps
- [ ] Error ID is logged alongside error details
- [ ] Error ID is displayed to users for support reference

**Example:**
```javascript
// ✅ GOOD
throw new ValidationError('Invalid input', {
  errorId: generateErrorId() // e.g., "a3f2b1c4"
});

// ❌ BAD
throw new Error('Invalid input'); // No tracking ID
```

**Sentinel Action:**
- 🔴 CRITICAL if any error response lacks errorId
- Report: "Missing error tracking ID in [file:line]"

---

### 2. Specific Error Types

**Rule:** Use specific error types instead of generic catch-all handlers

**Check:**
- [ ] Try-catch blocks handle specific error types
- [ ] Validation errors return 400 status
- [ ] Authentication errors return 401 status
- [ ] Authorization errors return 403 status
- [ ] Rate limit errors return 429 status
- [ ] External API errors return 502 status
- [ ] Internal errors return 500 status
- [ ] Each error type has appropriate handling

**Anti-pattern:**
```javascript
// ❌ BAD - Broad catch-all
try {
  validateInput();
  await callOpenAI();
  await saveToDatabase();
} catch (error) {
  return res.status(500).json({ error: 'Something went wrong' });
}
```

**Best Practice:**
```javascript
// ✅ GOOD - Specific error handling
try {
  validateInput(); // Throws ValidationError (400)
} catch (validationError) {
  return sendErrorResponse(res, validationError);
}

try {
  const result = await callOpenAI(); // Throws ExternalAPIError (502)
} catch (apiError) {
  return sendErrorResponse(res, handleOpenAIError(apiError));
}

try {
  await saveToDatabase(); // Throws DatabaseError (503)
} catch (dbError) {
  return sendErrorResponse(res, dbError);
}
```

**Sentinel Action:**
- 🟠 HIGH if try-catch spans multiple operation types without specific handling
- Report: "Broad error handler may mask different error types in [file:line]"

---

### 3. Validation Outside Try-Catch

**Rule:** Input validation should happen before entering try-catch blocks

**Check:**
- [ ] Input validation is extracted into separate functions
- [ ] Validation errors are thrown as ValidationError (not caught generically)
- [ ] Validation happens before expensive operations
- [ ] Validation functions have clear names (e.g., `validateInput()`)

**Example:**
```javascript
// ✅ GOOD - Validation first, then try-catch
function validateInput(data) {
  if (!data.email) throw new ValidationError('Email required');
  if (!data.password) throw new ValidationError('Password required');
}

export default async function handler(req, res) {
  validateInput(req.body); // Throws ValidationError if invalid

  try {
    // Only business logic in try-catch
    await processRequest(req.body);
  } catch (error) {
    return sendErrorResponse(res, error);
  }
}
```

**Sentinel Action:**
- 🟡 MEDIUM if validation is done inside broad try-catch
- Report: "Move validation outside try-catch for better error specificity in [file:line]"

---

### 4. Configuration Validation at Startup

**Rule:** Required environment variables must be validated before processing requests

**Check:**
- [ ] API keys validated before initialization
- [ ] Database connections tested before accepting requests
- [ ] Required config values checked at startup
- [ ] Clear error messages if configuration is invalid
- [ ] Fail fast - don't start if misconfigured

**Example:**
```javascript
// ✅ GOOD - Config validation at module load
import { validateConfig, getOpenAIKey } from './config.js';

const configValidation = validateConfig();
if (!configValidation.valid) {
  console.error('Configuration errors:', configValidation.errors);
}

let openai;
try {
  const apiKey = getOpenAIKey();
  openai = new OpenAI({ apiKey });
} catch (error) {
  console.error('Failed to initialize OpenAI:', error.message);
  openai = null; // Will fail requests with clear error
}
```

**Sentinel Action:**
- 🔴 CRITICAL if API keys are accessed without validation
- Report: "API key used without startup validation in [file:line]"

---

### 5. User-Friendly Error Messages

**Rule:** Error messages must help users understand what went wrong and how to fix it

**Check:**
- [ ] Error messages are actionable
- [ ] Technical jargon is minimized
- [ ] Error messages don't expose internal details
- [ ] Validation errors explain what's wrong and what's expected
- [ ] Error messages are consistent in tone

**Example:**
```javascript
// ❌ BAD
'Invalid input'
'Error occurred'
'Failed to process'

// ✅ GOOD
'Email address is required. Please enter your email.'
'Date must be in YYYY-MM-DD format (e.g., 2025-10-14)'
'Meeting notes must be at least 50 characters for meaningful extraction'
'AI service rate limit exceeded. Please wait 60 seconds and try again.'
```

**Sentinel Action:**
- 🟡 MEDIUM if error messages are generic or unclear
- Report: "Improve error message clarity in [file:line]"

---

### 6. Error Logging with Context

**Rule:** Errors must be logged with sufficient context for debugging

**Check:**
- [ ] Error ID is logged
- [ ] Timestamp is logged (ISO 8601)
- [ ] Request context is logged (method, path, user ID if available)
- [ ] Error stack trace is logged
- [ ] Sensitive data is NOT logged
- [ ] Structured logging format (JSON) is used

**Example:**
```javascript
// ✅ GOOD
console.error(`[${errorId}] ${error.name}:`, error.message, {
  statusCode: error.statusCode,
  code: error.code,
  metadata: error.metadata,
  timestamp: new Date().toISOString(),
  method: req.method,
  path: req.url,
  stack: error.stack
});
```

**Sentinel Action:**
- 🟡 MEDIUM if errors are logged without context
- Report: "Add error ID and context to logging in [file:line]"

---

### 7. OpenAI-Specific Error Handling

**Rule:** OpenAI errors must be handled with specific status codes and retry logic

**Check:**
- [ ] Rate limit errors (429) include retry-after header
- [ ] Quota errors (402) direct users to contact support
- [ ] Invalid request errors (400) provide actionable feedback
- [ ] Authentication errors (401) are masked from users
- [ ] Service errors (503) suggest retry later
- [ ] All OpenAI errors include tracking IDs

**Example:**
```javascript
// ✅ GOOD - Using handleOpenAIError utility
import { handleOpenAIError } from './errors.js';

try {
  const completion = await openai.chat.completions.create(/*...*/);
} catch (openaiError) {
  throw handleOpenAIError(openaiError); // Returns appropriate AppError type
}
```

**Sentinel Action:**
- 🟠 HIGH if OpenAI errors are not handled specifically
- Report: "Use handleOpenAIError() for OpenAI-specific error mapping in [file:line]"

---

### 8. No Secrets in Error Messages

**Rule:** Error messages must never expose API keys, passwords, tokens, or internal paths

**Check:**
- [ ] API keys are not included in error messages
- [ ] Database connection strings are not exposed
- [ ] File paths are not exposed
- [ ] Stack traces are not sent to frontend (except dev mode)
- [ ] Environment variables are not logged in plain text
- [ ] Configuration errors mask sensitive values

**Example:**
```javascript
// ❌ BAD
return res.status(500).json({
  error: `API key ${process.env.OPENAI_API_KEY} is invalid`
});

// ✅ GOOD
return res.status(500).json({
  error: 'AI service not configured. Please contact support.',
  errorId: generateErrorId()
});
```

**Sentinel Action:**
- 🔴 CRITICAL if secrets or paths are exposed in errors
- Report: "Security risk: sensitive data exposed in error message at [file:line]"

---

### 9. Async Error Handling

**Rule:** Async functions must have proper error handling

**Check:**
- [ ] All async functions are wrapped in try-catch or use .catch()
- [ ] Unhandled promise rejections are caught
- [ ] Async errors include tracking IDs
- [ ] Multiple async operations use Promise.all() with error handling
- [ ] Timeouts are implemented for external API calls

**Example:**
```javascript
// ✅ GOOD
export const handler = asyncHandler(async (req, res) => {
  // Automatic error handling via asyncHandler wrapper
  const result = await riskyOperation();
  return sendSuccessResponse(res, result);
});
```

**Sentinel Action:**
- 🟠 HIGH if async functions lack try-catch
- Report: "Async function missing error handling in [file:line]"

---

### 10. Error Response Format Consistency

**Rule:** All error responses must follow the same structure

**Check:**
- [ ] All errors return `{ success: false, error: string, errorId: string }`
- [ ] Optional fields (code, metadata) are used consistently
- [ ] Success responses return `{ success: true, ...data }`
- [ ] HTTP status codes match error types
- [ ] Content-Type is application/json

**Example:**
```javascript
// ✅ GOOD - Consistent format
{
  "success": false,
  "error": "Notes must be at least 50 characters",
  "errorId": "a3f2b1c4",
  "code": "VALIDATION_ERROR"
}

// ❌ BAD - Inconsistent
{
  "message": "Error", // Should be "error"
  "id": "123"          // Should be "errorId"
}
```

**Sentinel Action:**
- 🟡 MEDIUM if error response format is inconsistent
- Report: "Use standard error response format in [file:line]"

---

## 🔍 Common Anti-Patterns to Flag

### 1. Silent Failures
```javascript
// ❌ CRITICAL
try {
  await importantOperation();
} catch (error) {
  // Empty catch - error is swallowed
}
```

### 2. Generic Error Messages
```javascript
// ❌ BAD
catch (error) {
  return res.status(500).json({ error: 'Something went wrong' });
}
```

### 3. Missing Error IDs
```javascript
// ❌ CRITICAL
return res.status(500).json({
  error: 'Failed to process request'
  // No errorId field
});
```

### 4. Exposing Stack Traces
```javascript
// ❌ CRITICAL SECURITY RISK
return res.status(500).json({
  error: error.message,
  stack: error.stack // Never send to frontend!
});
```

### 5. No Validation Before Expensive Operations
```javascript
// ❌ BAD - Calls API before validating input
try {
  const result = await expensiveAPICall(data);
  if (!data.field) throw new Error('Field required');
} catch (error) {
  // Wasted API call
}
```

---

## 🚀 Quick Reference

**For New API Endpoints:**
1. ✅ Validate config at startup
2. ✅ Validate input outside try-catch
3. ✅ Use specific error types in try-catch
4. ✅ Include error IDs in all errors
5. ✅ Log errors with context
6. ✅ Use sendErrorResponse() utility
7. ✅ Test all error scenarios

**For Existing Code Review:**
1. Search for `catch (error)` - check if it's generic
2. Search for `res.status(500)` - check if error ID is included
3. Search for `throw new Error` - check if specific error type is used
4. Search for `process.env` - check if validated at startup
5. Search for `console.error` - check if context is logged

---

## 📚 Related Documentation

- `src/lib/errors.js` - Error classes and utilities
- `src/lib/error-handler.js` - Response formatting utilities
- `src/lib/config.js` - Configuration validation
- `docs/development/ERROR_HANDLING_GUIDE.md` - Comprehensive developer guide
- `docs/features/brain-dumps/api-response-spec.md` - API contract example

---

**Document Status:** ✅ Complete and Enforceable
**Review Frequency:** Before every PR merge
**Enforcement Level:** Critical - blocking for 🔴, recommended for 🟠🟡

# CRITICAL TEST GAPS - PR #104

**Status:** 🔴 BLOCKING MERGE
**Last Updated:** October 14, 2025
**PR:** #104 - Brain Dumps Feature

---

## Overview

This document tracks the 5 CRITICAL test gaps identified during PR review that **must be addressed before merge**. These tests were identified by the pr-test-analyzer agent as blocking issues.

---

## 🔴 CRITICAL GAP #1: OpenAI Timeout/Network Failure Tests

**Priority:** CRITICAL (10/10)
**File:** `tests/integration/brain-dumps-api-timeout.test.js` (TO BE CREATED)
**Issue:** No tests for OpenAI API timeouts or network failures

### Required Tests:

```javascript
// 1. Test OpenAI API timeout (>30s)
test('should return 502 when OpenAI API times out', async ({ request }) => {
  // Mock OpenAI to delay > 30 seconds
  // Verify: 502 response with user-friendly error
  // Verify: Error ID included for support tracking
});

// 2. Test network failure (DNS/connection refused)
test('should return 502 when OpenAI API is unreachable', async ({
  request,
}) => {
  // Mock network failure
  // Verify: ExternalAPIError with proper error ID
});

// 3. Test connection reset during API call
test('should handle ECONNRESET gracefully', async ({ request }) => {
  // Mock connection reset mid-request
  // Verify: Proper error response, not silent failure
});
```

**Impact:** Users will experience cryptic errors when OpenAI is slow/down
**Estimated Time:** 2 hours

---

## 🔴 CRITICAL GAP #2: Frontend localStorage Persistence Tests

**Priority:** CRITICAL (9/10)
**File:** `tests/e2e/brain-dumps-localStorage.spec.js` (TO BE CREATED)
**Issue:** No tests for auto-save/recovery functionality

### Required Tests:

```javascript
// 1. Auto-save draft recovers after page refresh
test('auto-save draft recovers after page refresh', async ({ page }) => {
  await page.goto('/brain-dumps.html');
  await page.fill('#meetingNotes', 'Important meeting notes...');
  await page.waitForTimeout(31000); // Wait for auto-save (30s interval)
  await page.reload();

  // Verify notes are restored from localStorage
  const notes = await page.locator('#meetingNotes').inputValue();
  expect(notes).toContain('Important');
});

// 2. Saved meetings persist after browser close
test('saved meetings persist after browser close', async ({
  page,
  context,
}) => {
  // Save meeting, close context, reopen, verify data exists
});

// 3. localStorage cleared correctly on "Clear History"
test('clear history removes all localStorage entries', async ({ page }) => {
  // Verify brainDumps_meetings key is removed
});
```

**Impact:** Data loss = user trust erosion
**Estimated Time:** 3 hours

---

## 🔴 CRITICAL GAP #3: PHI Detection False Positives

**Priority:** CRITICAL (9/10)
**File:** `tests/integration/brain-dumps-phi-detection.test.js` (TO BE CREATED)
**Issue:** Current keyword detection blocks legitimate business meetings

### Required Tests:

```javascript
// 1. Non-medical use of medical keywords should pass
test('should allow non-medical use of medical keywords', async ({
  request,
}) => {
  const response = await request.post(ENDPOINT, {
    data: {
      ...VALID_REQUEST,
      notes:
        'We need to be patient while waiting for the product launch. The treatment of our customers should be excellent.',
    },
  });

  // Currently FAILS - detecting false positive
  expect(response.status()).toBe(200);
});

// 2. Edge case: medical terms in business context
test('should allow "diagnosis showed our strategy needs improvement"', async ({
  request,
}) => {
  // Business use of "diagnosis" should be allowed
});

// 3. Should block actual PHI data
test('should block actual patient medical data', async ({ request }) => {
  const response = await request.post(ENDPOINT, {
    data: {
      ...VALID_REQUEST,
      notes:
        'Patient John Doe was diagnosed with diabetes. Prescription: Metformin 500mg.',
    },
  });

  expect(response.status()).toBe(400);
  expect(data.error).toContain('Medical/healthcare data detected');
});
```

**Impact:** Users frustrated by false rejections
**Estimated Time:** 2 hours
**Alternative:** Improve PHI detection algorithm (4-6 hours)

---

## 🔴 CRITICAL GAP #4: Frontend Error Display Tests

**Priority:** CRITICAL (9/10)
**File:** `tests/e2e/brain-dumps-error-display.spec.js` (TO BE CREATED)
**Issue:** No validation that error IDs are shown to users

### Required Tests:

```javascript
// 1. API error displays error ID to user
test('displays error ID when API returns 500', async ({ page }) => {
  // Mock API to return 500 with errorId
  await page.route('/api/brain-dumps/process', route =>
    route.fulfill({
      status: 500,
      body: JSON.stringify({
        success: false,
        error: 'Service error',
        errorId: 'abc12345',
      }),
    })
  );

  await page.click('button:has-text("Process with AI")');

  // Verify error message shows errorId
  const dialogMessage = await page.waitForEvent('dialog').message();
  expect(dialogMessage).toContain('abc12345');
  expect(dialogMessage).toContain('contact support');
});

// 2. Network error displays user-friendly message
test('displays network error message', async ({ page }) => {
  // Mock network failure
  await page.route('/api/brain-dumps/process', route => route.abort());

  // Verify: "Network error" not "TypeError: Failed to fetch"
});
```

**Impact:** Support team can't debug issues without error IDs
**Estimated Time:** 2 hours

---

## 🔴 CRITICAL GAP #5: Config Validation Tests

**Priority:** CRITICAL (8/10)
**File:** `tests/unit/config.test.js` (TO BE CREATED)
**Issue:** Config validation runs on cold start but no tests

### Required Tests:

```javascript
// 1. Throws when both OpenAI keys are missing
test('validateConfig throws when both OpenAI keys missing', () => {
  delete process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_BRAINDUMPS_KEY;

  expect(() => validateConfig({ throwOnError: true })).toThrow(
    'At least one OpenAI API key must be configured'
  );
});

// 2. Prefers BRAINDUMPS key over general key
test('getOpenAIKey prefers BRAINDUMPS key', () => {
  process.env.OPENAI_API_KEY = 'sk-general';
  process.env.OPENAI_BRAINDUMPS_KEY = 'sk-braindumps';

  expect(getOpenAIKey()).toBe('sk-braindumps');
});

// 3. Falls back to OPENAI_API_KEY correctly
test('getOpenAIKey falls back to OPENAI_API_KEY', () => {
  process.env.OPENAI_API_KEY = 'sk-general';
  delete process.env.OPENAI_BRAINDUMPS_KEY;

  expect(getOpenAIKey()).toBe('sk-general');
});
```

**Impact:** Complete feature outage if keys misconfigured
**Estimated Time:** 1 hour

---

## 📊 Summary

| Gap                    | Priority | Estimated Time | Blocking?      |
| ---------------------- | -------- | -------------- | -------------- |
| #1 - OpenAI Timeout    | 10       | 2 hours        | ✅ YES         |
| #2 - localStorage      | 9        | 3 hours        | ✅ YES         |
| #3 - PHI Detection     | 9        | 2 hours        | ✅ YES         |
| #4 - Error Display     | 9        | 2 hours        | ✅ YES         |
| #5 - Config Validation | 8        | 1 hour         | ✅ YES         |
| **TOTAL**              |          | **10 hours**   | **5 blocking** |

---

## 🎯 Recommended Approach

### Phase 1 (Immediate - 4 hours):

1. Config Validation Tests (Gap #5) - 1 hour
2. Frontend Error Display Tests (Gap #4) - 2 hours
3. OpenAI Timeout Tests (Gap #1) - 1 hour partial

### Phase 2 (Before Merge - 6 hours):

4. OpenAI Timeout Tests (Gap #1 complete) - 1 hour
5. PHI Detection Tests (Gap #3) - 2 hours
6. localStorage Tests (Gap #2) - 3 hours

---

## 📝 Notes

- All tests should use existing test framework (Playwright)
- Follow patterns in `tests/integration/brain-dumps-api-contract.test.js`
- Each test file should include setup/teardown
- Mock external services appropriately
- Include detailed failure messages

---

## 🔗 Related Files

- Existing tests: `tests/integration/brain-dumps-api-contract.test.js`
- API implementation: `api/brain-dumps/process.js`
- Frontend: `src/app/brain-dumps.html`
- Config module: `src/lib/config.js`
- Error classes: `src/lib/errors.js`

---

**Generated during PR #104 review by pr-test-analyzer agent**
**Review ID:** PR104-20251014

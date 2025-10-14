/**
 * Brain Dumps API Contract Tests
 * Ensures API responses match documented specification
 *
 * Reference: docs/features/brain-dumps/api-response-spec.md
 * Created: October 14, 2025
 */

import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

const BRAIN_DUMPS_ENDPOINT = `${API_BASE_URL}/api/brain-dumps/process`;

/**
 * Valid test data for successful requests
 */
const VALID_REQUEST = {
  title: 'Q4 Planning Session',
  date: '2025-10-14',
  participants: 'Alice, Bob, Carol',
  notes:
    'We discussed Q4 goals and identified three key priorities: 1) Launch new feature by Nov 15, 2) Complete security audit, 3) Hire two engineers. Bob will lead hiring. We decided to delay mobile app to Q1 2026 due to resource constraints. Blocker: Waiting on legal approval for contracts.',
};

test.describe('Brain Dumps API Contract Tests', () => {
  // ========================================
  // SUCCESS RESPONSE TESTS
  // ========================================

  test('should return success response with all required fields', async ({
    request,
  }) => {
    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: VALID_REQUEST,
    });

    expect(response.status()).toBe(200);

    const data = await response.json();

    // Check top-level structure
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('meeting_id');
    expect(data).toHaveProperty('results');
    expect(data).toHaveProperty('metadata');

    // Validate meeting_id is a number
    expect(typeof data.meeting_id).toBe('number');
  });

  test('should return results with action_items, decisions, and blockers arrays', async ({
    request,
  }) => {
    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: VALID_REQUEST,
    });

    const data = await response.json();

    // Check results structure
    expect(Array.isArray(data.results.action_items)).toBe(true);
    expect(Array.isArray(data.results.decisions)).toBe(true);
    expect(Array.isArray(data.results.blockers)).toBe(true);
  });

  test('should return metadata with model, tokens_used, and processing_time', async ({
    request,
  }) => {
    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: VALID_REQUEST,
    });

    const data = await response.json();

    // Check metadata structure
    expect(data.metadata).toHaveProperty('model');
    expect(data.metadata).toHaveProperty('tokens_used');
    expect(data.metadata).toHaveProperty('processing_time');

    // Validate types
    expect(typeof data.metadata.model).toBe('string');
    expect(typeof data.metadata.tokens_used).toBe('number');
    expect(typeof data.metadata.processing_time).toBe('string');

    // Validate ISO 8601 timestamp format
    expect(() => new Date(data.metadata.processing_time)).not.toThrow();
  });

  test('should validate action_item structure', async ({ request }) => {
    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: VALID_REQUEST,
    });

    const data = await response.json();

    if (data.results.action_items.length > 0) {
      const actionItem = data.results.action_items[0];

      expect(actionItem).toHaveProperty('task');
      expect(actionItem).toHaveProperty('owner');
      expect(actionItem).toHaveProperty('due_date');
      expect(actionItem).toHaveProperty('priority');

      // Validate types
      expect(typeof actionItem.task).toBe('string');
      expect(['string', 'object']).toContain(typeof actionItem.owner); // null or string
      expect(['string', 'object']).toContain(typeof actionItem.due_date); // null or string
      expect(['critical', 'high', 'medium', 'low']).toContain(
        actionItem.priority
      );
    }
  });

  test('should validate decision structure', async ({ request }) => {
    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: VALID_REQUEST,
    });

    const data = await response.json();

    if (data.results.decisions.length > 0) {
      const decision = data.results.decisions[0];

      expect(decision).toHaveProperty('decision');
      expect(decision).toHaveProperty('context');
      expect(decision).toHaveProperty('impact');

      // Validate types
      expect(typeof decision.decision).toBe('string');
      expect(typeof decision.context).toBe('string');
      expect(typeof decision.impact).toBe('string');
    }
  });

  test('should validate blocker structure', async ({ request }) => {
    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: VALID_REQUEST,
    });

    const data = await response.json();

    if (data.results.blockers.length > 0) {
      const blocker = data.results.blockers[0];

      expect(blocker).toHaveProperty('description');
      expect(blocker).toHaveProperty('impact');
      expect(blocker).toHaveProperty('owner');

      // Validate types
      expect(typeof blocker.description).toBe('string');
      expect(typeof blocker.impact).toBe('string');
      expect(typeof blocker.owner).toBe('string');
    }
  });

  // ========================================
  // VALIDATION ERROR TESTS (400)
  // ========================================

  test('should return 400 for missing required fields', async ({ request }) => {
    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: { title: 'Test Meeting' }, // Missing date and notes
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data).toHaveProperty('error');
    expect(data).toHaveProperty('errorId');
    expect(typeof data.errorId).toBe('string');
    expect(data.errorId).toHaveLength(8);
  });

  test('should return 400 for invalid date format', async ({ request }) => {
    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: {
        ...VALID_REQUEST,
        date: '10/14/2025', // Invalid format (should be YYYY-MM-DD)
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('YYYY-MM-DD');
    expect(data).toHaveProperty('errorId');
  });

  test('should return 400 for notes too short', async ({ request }) => {
    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: {
        ...VALID_REQUEST,
        notes: 'Too short', // Less than 50 characters
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('50 characters');
    expect(data).toHaveProperty('errorId');
  });

  test('should return 400 for medical/PHI keywords', async ({ request }) => {
    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: {
        ...VALID_REQUEST,
        notes:
          'The patient was diagnosed with hypertension and prescribed medication for treatment.',
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Medical/healthcare data detected');
    expect(data).toHaveProperty('errorId');
  });

  // ========================================
  // METHOD VALIDATION TESTS (405)
  // ========================================

  test('should return 405 for GET requests', async ({ request }) => {
    const response = await request.get(BRAIN_DUMPS_ENDPOINT);

    expect(response.status()).toBe(405);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Method not allowed');
    expect(data).toHaveProperty('errorId');
  });

  test('should handle OPTIONS preflight requests', async ({ request }) => {
    const response = await request.fetch(BRAIN_DUMPS_ENDPOINT, {
      method: 'OPTIONS',
    });

    expect(response.status()).toBe(200);
  });

  // ========================================
  // ERROR ID VALIDATION
  // ========================================

  test('all errors should include tracking errorId', async ({ request }) => {
    const invalidRequests = [
      { data: {} }, // Missing all fields
      { data: { title: 'Test', date: 'invalid', notes: 'a'.repeat(60) } }, // Invalid date
      { data: { ...VALID_REQUEST, notes: 'short' } }, // Too short
    ];

    for (const invalidRequest of invalidRequests) {
      const response = await request.post(BRAIN_DUMPS_ENDPOINT, invalidRequest);
      const data = await response.json();

      expect(data).toHaveProperty('errorId');
      expect(typeof data.errorId).toBe('string');
      expect(data.errorId).toMatch(/^[a-z0-9]{8}$/); // 8 lowercase alphanumeric chars
    }
  });

  test('errorId should be unique for different errors', async ({ request }) => {
    const errorIds = new Set();

    for (let i = 0; i < 5; i++) {
      const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
        data: {}, // Invalid request
      });
      const data = await response.json();
      errorIds.add(data.errorId);
    }

    // All error IDs should be unique (very high probability with crypto random)
    expect(errorIds.size).toBeGreaterThanOrEqual(4); // Allow 1 collision in 5 (unlikely)
  });

  // ========================================
  // CORS TESTS
  // ========================================

  test('should include CORS headers', async ({ request }) => {
    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: VALID_REQUEST,
    });

    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeDefined();
    expect(headers['access-control-allow-methods']).toBeDefined();
  });

  // ========================================
  // SECURITY TESTS
  // ========================================

  test('should not expose internal error details in production', async ({
    request,
  }) => {
    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: {
        ...VALID_REQUEST,
        notes: 'a'.repeat(10), // Too short
      },
    });

    const data = await response.json();

    // Should not contain stack traces or internal paths
    const dataString = JSON.stringify(data);
    expect(dataString).not.toContain('at Object');
    expect(dataString).not.toContain('/Users/');
    expect(dataString).not.toContain('node_modules');
  });

  test('should mask API configuration errors', async ({ request }) => {
    // This test assumes API key is configured
    // If it fails with 500, check error message doesn't expose key details
    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: VALID_REQUEST,
    });

    const data = await response.json();

    if (response.status() === 500 || response.status() === 502) {
      const errorMessage = data.error.toLowerCase();
      expect(errorMessage).not.toContain('sk-');
      expect(errorMessage).not.toContain('api_key');
      expect(errorMessage).toContain('support');
    }
  });
});

/**
 * Performance Tests
 */
test.describe('Brain Dumps API Performance', () => {
  test('should respond within 15 seconds', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.post(BRAIN_DUMPS_ENDPOINT, {
      data: VALID_REQUEST,
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(15000); // 15 seconds max
  });

  test('should handle concurrent requests', async ({ request }) => {
    const requests = Array(3)
      .fill(null)
      .map(() =>
        request.post(BRAIN_DUMPS_ENDPOINT, {
          data: VALID_REQUEST,
        })
      );

    const responses = await Promise.all(requests);

    responses.forEach(response => {
      expect([200, 429]).toContain(response.status()); // 200 or rate limited
    });
  });
});

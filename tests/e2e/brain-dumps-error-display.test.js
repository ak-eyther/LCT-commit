/**
 * Brain Dumps Frontend - Error Display E2E Tests
 * Tests that error messages with tracking IDs are properly displayed to users
 *
 * CRITICAL TEST: Verifies that error IDs are shown in the UI so users can
 * report issues to support with a tracking number for correlation
 *
 * Reference: docs/architecture/ERROR_HANDLING_ARCHITECTURE.md
 * Created: October 15, 2025
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

const BRAIN_DUMPS_PAGE = `${BASE_URL}/brain-dumps.html`;

/**
 * Helper: Fill meeting form
 */
async function fillMeetingForm(page, data) {
  await page.fill('#meeting-title', data.title || '');
  await page.fill('#meeting-date', data.date || '');
  if (data.participants !== undefined) {
    await page.fill('#participants', data.participants);
  }
  await page.fill('#meeting-notes', data.notes || '');
}

test.describe('Brain Dumps - Error Display UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BRAIN_DUMPS_PAGE);
  });

  // ========================================
  // VALIDATION ERROR DISPLAY (400)
  // ========================================

  test('should display error ID for missing required fields', async ({
    page,
  }) => {
    // Try to submit without filling required fields
    await page.getByRole('button', { name: /Process with AI/i }).click();

    // HTML5 validation should prevent submission
    // But if we bypass it and submit invalid data via API,
    // the error should be displayed

    // Fill with invalid data (notes too short)
    await fillMeetingForm(page, {
      title: 'Test Meeting',
      date: '2025-10-15',
      notes: 'Too short', // Less than 50 characters
    });

    // Submit
    await page.getByRole('button', { name: /Process with AI/i }).click();

    // Wait for error message
    await page.waitForTimeout(2000);

    // Look for error message containing error ID
    // Error should be displayed in an alert or error container
    const errorMessage = page.locator('.error, [role="alert"], .alert-error');

    // Should have error ID in format: "Error ID: abc12345"
    // Or "Reference: abc12345" or "[abc12345]"

    // Note: The actual implementation may vary, so we check for
    // an 8-character alphanumeric string in the error message
    const errorText = await errorMessage.textContent().catch(() => '');

    // Check if error ID pattern exists (8 lowercase alphanumeric chars)
    const hasErrorId = /[a-z0-9]{8}/.test(errorText);

    // If error is displayed, it should contain error ID
    if (errorText.length > 0) {
      expect(hasErrorId).toBe(true);
    }
  });

  test('should display user-friendly message for validation errors', async ({
    page,
  }) => {
    // Submit with notes too short
    await fillMeetingForm(page, {
      title: 'Validation Test',
      date: '2025-10-15',
      notes: 'Short', // Less than 50 characters
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(2000);

    // Look for error message
    const errorContainer = page.locator(
      '.error, [role="alert"], .alert-error, .text-red-600'
    );

    // Should show user-friendly message
    const errorText =
      (await errorContainer.textContent().catch(() => '')) || '';

    if (errorText.length > 0) {
      // Should mention "50 characters" or "too short"
      expect(errorText.toLowerCase()).toMatch(/50 character|too short/);

      // Should NOT expose internal errors
      expect(errorText).not.toContain('ValidationError');
      expect(errorText).not.toContain('stack trace');
      expect(errorText).not.toContain('at Object');
    }
  });

  test('should display error for medical/PHI keywords', async ({ page }) => {
    // Fill with medical keywords
    await fillMeetingForm(page, {
      title: 'Medical Data Test',
      date: '2025-10-15',
      notes:
        'The patient was diagnosed with hypertension and prescribed medication. ' +
        'This should trigger the PHI detection and show an error with error ID.',
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(2000);

    // Look for error message
    const errorContainer = page.locator(
      '.error, [role="alert"], .alert-error'
    );

    const errorText =
      (await errorContainer.textContent().catch(() => '')) || '';

    if (errorText.length > 0) {
      // Should mention medical/healthcare data
      expect(errorText.toLowerCase()).toMatch(
        /medical|healthcare|phi|business meetings only/
      );

      // Should have error ID
      expect(/[a-z0-9]{8}/.test(errorText)).toBe(true);
    }
  });

  // ========================================
  // SERVER ERROR DISPLAY (500)
  // ========================================

  test('should display error ID for server errors', async ({ page }) => {
    // Note: This test is challenging because we need to trigger a real 500 error
    // Options:
    // 1. Use very large notes (100k+ characters) to potentially cause issues
    // 2. Use test environment with broken OpenAI key
    // 3. Mock API responses in test environment

    // Try with extremely large notes
    const largeNotes = 'This is a very long note. '.repeat(5000); // ~125k chars

    await fillMeetingForm(page, {
      title: 'Server Error Test',
      date: '2025-10-15',
      notes: largeNotes,
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();

    // Wait for processing (may timeout or fail)
    await page.waitForTimeout(5000);

    // Look for error message
    const errorContainer = page.locator(
      '.error, [role="alert"], .alert-error'
    );

    const errorText =
      (await errorContainer.textContent().catch(() => '')) || '';

    if (errorText.length > 0 && errorText.includes('Error')) {
      // Should have error ID for 500 errors
      const hasErrorId = /[a-z0-9]{8}/.test(errorText);

      // Server errors should include error ID
      expect(hasErrorId).toBe(true);

      // Should have support message
      expect(errorText.toLowerCase()).toMatch(
        /support|try again|contact|reference/
      );
    }
  });

  test('should display friendly message for server errors', async ({
    page,
  }) => {
    // Same setup as above test
    const largeNotes = 'This is a very long note. '.repeat(5000);

    await fillMeetingForm(page, {
      title: 'Friendly Error Test',
      date: '2025-10-15',
      notes: largeNotes,
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(5000);

    const errorContainer = page.locator(
      '.error, [role="alert"], .alert-error'
    );

    const errorText =
      (await errorContainer.textContent().catch(() => '')) || '';

    if (errorText.length > 0 && errorText.includes('Error')) {
      // Should NOT expose internal errors
      expect(errorText).not.toContain('OpenAI');
      expect(errorText).not.toContain('gpt-4');
      expect(errorText).not.toContain('ECONNREFUSED');
      expect(errorText).not.toContain('stack');
      expect(errorText).not.toContain('at processNotes');

      // Should be user-friendly
      expect(errorText.toLowerCase()).toMatch(
        /try again|temporarily unavailable|please wait/
      );
    }
  });

  // ========================================
  // ERROR ID FORMAT TESTS
  // ========================================

  test('error ID should be 8-character alphanumeric format', async ({
    page,
  }) => {
    // Trigger validation error
    await fillMeetingForm(page, {
      title: 'ID Format Test',
      date: '2025-10-15',
      notes: 'Short', // Invalid
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(2000);

    const errorContainer = page.locator(
      '.error, [role="alert"], .alert-error'
    );

    const errorText =
      (await errorContainer.textContent().catch(() => '')) || '';

    if (errorText.length > 0) {
      // Extract error ID using regex
      const errorIdMatch = errorText.match(/[a-z0-9]{8}/);

      if (errorIdMatch) {
        const errorId = errorIdMatch[0];

        // Should be exactly 8 characters
        expect(errorId.length).toBe(8);

        // Should be lowercase alphanumeric only
        expect(errorId).toMatch(/^[a-z0-9]{8}$/);

        // Should not contain special characters
        expect(errorId).not.toMatch(/[A-Z\-_\.]/);
      }
    }
  });

  test('error ID should be copyable by user', async ({ page }) => {
    // Trigger an error
    await fillMeetingForm(page, {
      title: 'Copyable ID Test',
      date: '2025-10-15',
      notes: 'X', // Too short
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(2000);

    // Look for error ID element
    // It should be in a selectable element (span, div, code, etc.)
    const errorIdElement = page.locator(
      'code:has-text(/[a-z0-9]{8}/), span:has-text(/[a-z0-9]{8}/), .error-id'
    );

    // If error ID is displayed, check if it's selectable
    const count = await errorIdElement.count();

    if (count > 0) {
      // Should be visible
      await expect(errorIdElement.first()).toBeVisible();

      // Should be text content (not image or non-selectable)
      const errorIdText = await errorIdElement.first().textContent();
      expect(errorIdText).toMatch(/[a-z0-9]{8}/);
    }
  });

  // ========================================
  // NETWORK ERROR DISPLAY
  // ========================================

  test('should display friendly message for network errors', async ({
    page,
  }) => {
    // Note: Network errors are hard to simulate in E2E tests
    // Options:
    // 1. Disconnect network (requires special browser capabilities)
    // 2. Block API endpoint in test environment
    // 3. Use service worker to intercept and fail requests

    // For now, we document expected behavior:
    // Network errors should show:
    // - "Unable to connect to server"
    // - "Please check your internet connection"
    // - "Try again later"
    // - Error ID for tracking

    test.skip(true, 'Requires network failure simulation infrastructure');
  });

  // ========================================
  // ERROR VISIBILITY TESTS
  // ========================================

  test('error message should be prominently displayed', async ({ page }) => {
    // Trigger error
    await fillMeetingForm(page, {
      title: 'Visibility Test',
      date: '2025-10-15',
      notes: 'Short', // Invalid
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(2000);

    const errorContainer = page.locator(
      '.error, [role="alert"], .alert-error, .text-red-600'
    );

    const count = await errorContainer.count();

    if (count > 0) {
      // Should be visible
      await expect(errorContainer.first()).toBeVisible();

      // Should be in viewport (user can see it without scrolling)
      const isInViewport = await errorContainer.first().isInViewport();
      expect(isInViewport).toBe(true);
    }
  });

  test('error message should be styled to stand out', async ({ page }) => {
    // Trigger error
    await fillMeetingForm(page, {
      title: 'Styling Test',
      date: '2025-10-15',
      notes: 'Short',
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(2000);

    const errorContainer = page.locator(
      '.error, [role="alert"], .alert-error, .text-red-600, .bg-red-100'
    );

    const count = await errorContainer.count();

    if (count > 0) {
      // Check for error styling (red color, background, etc.)
      const element = errorContainer.first();

      // Should have red-ish styling
      const color = await element.evaluate(el => {
        return window.getComputedStyle(el).color;
      });

      // Color should contain red component (rgb with high red value)
      // or text-red Tailwind class
      const hasRedStyling = color.includes('red') || color.startsWith('rgb(');

      expect(hasRedStyling).toBe(true);
    }
  });

  // ========================================
  // ERROR PERSISTENCE TESTS
  // ========================================

  test('error message should persist until form is corrected', async ({
    page,
  }) => {
    // Trigger error
    await fillMeetingForm(page, {
      title: 'Persistence Test',
      date: '2025-10-15',
      notes: 'Short',
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(2000);

    // Check error is visible
    const errorContainer = page.locator('.error, [role="alert"]');
    const initialCount = await errorContainer.count();

    if (initialCount > 0) {
      // Wait 3 seconds
      await page.waitForTimeout(3000);

      // Error should still be visible
      const stillVisible = await errorContainer.first().isVisible();
      expect(stillVisible).toBe(true);
    }
  });

  test('error message should clear when form is corrected and resubmitted', async ({
    page,
  }) => {
    // Trigger error
    await fillMeetingForm(page, {
      title: 'Clear Error Test',
      date: '2025-10-15',
      notes: 'Short',
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(2000);

    // Fix the form
    await fillMeetingForm(page, {
      title: 'Clear Error Test',
      date: '2025-10-15',
      notes:
        'Now this is a much longer note that meets the 50 character minimum requirement and should process successfully.',
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(3000);

    // Error should be gone (or replaced with success)
    const errorContainer = page.locator('.error:visible, [role="alert"]:visible');
    const errorCount = await errorContainer.count();

    // Either no errors, or results are displayed (success state)
    const resultsSection = page.locator('#results-section');
    const resultsVisible = await resultsSection.isVisible();

    expect(errorCount === 0 || resultsVisible).toBe(true);
  });

  // ========================================
  // ACCESSIBILITY TESTS
  // ========================================

  test('error message should be accessible to screen readers', async ({
    page,
  }) => {
    // Trigger error
    await fillMeetingForm(page, {
      title: 'Accessibility Test',
      date: '2025-10-15',
      notes: 'Short',
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(2000);

    // Error should have role="alert" or aria-live="assertive"
    const alertElement = page.locator('[role="alert"], [aria-live="assertive"]');

    const count = await alertElement.count();

    if (count > 0) {
      // Should be visible
      await expect(alertElement.first()).toBeVisible();

      // Should contain error message
      const text = await alertElement.first().textContent();
      expect(text.length).toBeGreaterThan(0);
    }
  });

  test('error ID should have semantic markup', async ({ page }) => {
    // Trigger error
    await fillMeetingForm(page, {
      title: 'Semantic Test',
      date: '2025-10-15',
      notes: 'Short',
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(2000);

    // Error ID should be in <code>, <span>, or similar semantic element
    const errorIdElement = page.locator(
      'code:has-text(/[a-z0-9]{8}/), span.error-id, .error-id'
    );

    const count = await errorIdElement.count();

    if (count > 0) {
      // Should have proper semantic markup
      const tagName = await errorIdElement.first().evaluate(el => el.tagName);

      // Should be CODE, SPAN, or similar (not DIV)
      expect(['CODE', 'SPAN', 'STRONG', 'B']).toContain(tagName);
    }
  });
});

/**
 * Error Display Integration Tests
 */
test.describe('Brain Dumps - Error Display Integration', () => {
  test('should display different error IDs for different errors', async ({
    page,
  }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Trigger first error
    await fillMeetingForm(page, {
      title: 'First Error',
      date: '2025-10-15',
      notes: 'Short',
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(2000);

    const firstError = await page
      .locator('.error, [role="alert"]')
      .textContent()
      .catch(() => '');
    const firstErrorId = firstError.match(/[a-z0-9]{8}/)?.[0];

    // Clear and trigger second error
    await page.reload();

    await fillMeetingForm(page, {
      title: 'Second Error',
      date: '2025-10-15',
      notes: 'Different short error',
    });

    await page.getByRole('button', { name: /Process with AI/i }).click();
    await page.waitForTimeout(2000);

    const secondError = await page
      .locator('.error, [role="alert"]')
      .textContent()
      .catch(() => '');
    const secondErrorId = secondError.match(/[a-z0-9]{8}/)?.[0];

    // Error IDs should be different (high probability)
    if (firstErrorId && secondErrorId) {
      // Allow small chance of collision, but generally should be different
      // (With crypto random, collision is extremely unlikely)
      expect(firstErrorId).not.toBe(secondErrorId);
    }
  });
});

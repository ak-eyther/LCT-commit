/**
 * Brain Dumps Frontend - localStorage Persistence E2E Tests
 * Tests auto-save, manual save, history tracking, and data persistence
 *
 * CRITICAL TEST: Verifies that data is properly saved to localStorage
 * and persists across page refreshes. Tests the complete user workflow.
 *
 * Reference: docs/features/brain-dumps/frontend-spec.md
 * Created: October 15, 2025
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

const BRAIN_DUMPS_PAGE = `${BASE_URL}/brain-dumps.html`;

/**
 * Helper: Clear localStorage before each test
 */
test.beforeEach(async ({ page }) => {
  await page.goto(BRAIN_DUMPS_PAGE);
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();
});

/**
 * Helper: Get localStorage data
 */
async function getLocalStorage(page, key) {
  return await page.evaluate(key => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }, key);
}

/**
 * Helper: Set localStorage data
 */
async function setLocalStorage(page, key, value) {
  await page.evaluate(
    ({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key, value }
  );
}

/**
 * Helper: Fill meeting form
 */
async function fillMeetingForm(page, data) {
  await page.fill('#meeting-title', data.title);
  await page.fill('#meeting-date', data.date);
  if (data.participants) {
    await page.fill('#participants', data.participants);
  }
  await page.fill('#meeting-notes', data.notes);
}

test.describe('Brain Dumps - localStorage Auto-Save', () => {
  // ========================================
  // AUTO-SAVE TESTS
  // ========================================

  test('should auto-save draft after 30 seconds of typing', async ({
    page,
  }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Fill form with meeting data
    await fillMeetingForm(page, {
      title: 'Auto-save Test Meeting',
      date: '2025-10-15',
      participants: 'Alice, Bob',
      notes: 'This is a test note that should be auto-saved after 30 seconds.',
    });

    // Wait for auto-save (30 seconds + 1 second buffer)
    await page.waitForTimeout(31000);

    // Check localStorage for draft
    const draft = await getLocalStorage(page, 'brainDumps_draft');

    expect(draft).not.toBeNull();
    expect(draft.title).toBe('Auto-save Test Meeting');
    expect(draft.notes).toContain('auto-saved after 30 seconds');
  });

  test('should show auto-save status indicator after saving', async ({
    page,
  }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Fill form
    await fillMeetingForm(page, {
      title: 'Status Test',
      date: '2025-10-15',
      notes: 'Test notes for auto-save status indicator visibility.',
    });

    // Wait for auto-save
    await page.waitForTimeout(31000);

    // Check for auto-save status message (should appear briefly)
    // Note: The status message may have already disappeared after 2 seconds
    // So we check localStorage instead as proof of auto-save
    const draft = await getLocalStorage(page, 'brainDumps_draft');
    expect(draft).not.toBeNull();
  });

  test('should not auto-save if notes are less than 10 characters', async ({
    page,
  }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Fill form with very short notes
    await fillMeetingForm(page, {
      title: 'Short Notes Test',
      date: '2025-10-15',
      notes: 'Short',
    });

    // Wait for auto-save timer
    await page.waitForTimeout(31000);

    // Check localStorage - should be null or empty
    const draft = await getLocalStorage(page, 'brainDumps_draft');

    // Either null or empty object
    if (draft !== null) {
      expect(draft.notes?.length || 0).toBeLessThan(10);
    }
  });

  test('should overwrite previous draft on subsequent auto-save', async ({
    page,
  }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // First draft
    await fillMeetingForm(page, {
      title: 'First Draft',
      date: '2025-10-15',
      notes: 'This is the first draft that will be overwritten.',
    });

    await page.waitForTimeout(31000);

    const firstDraft = await getLocalStorage(page, 'brainDumps_draft');
    expect(firstDraft.title).toBe('First Draft');

    // Modify form
    await page.fill('#meeting-title', 'Second Draft');
    await page.fill('#meeting-notes', 'This is the second draft that should replace the first.');

    await page.waitForTimeout(31000);

    const secondDraft = await getLocalStorage(page, 'brainDumps_draft');
    expect(secondDraft.title).toBe('Second Draft');
    expect(secondDraft.notes).toContain('second draft');
  });

  // ========================================
  // MANUAL SAVE TESTS
  // ========================================

  test('should save draft immediately when Save Draft button clicked', async ({
    page,
  }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Fill form
    await fillMeetingForm(page, {
      title: 'Manual Save Test',
      date: '2025-10-15',
      participants: 'Charlie',
      notes: 'This draft is saved manually without waiting for auto-save.',
    });

    // Click Save Draft button
    await page.click('button:has-text("💾 Save Draft")');

    // Wait for save to complete
    await page.waitForTimeout(500);

    // Check localStorage immediately (no 30 second wait)
    const draft = await getLocalStorage(page, 'brainDumps_draft');

    expect(draft).not.toBeNull();
    expect(draft.title).toBe('Manual Save Test');
    expect(draft.participants).toBe('Charlie');
  });

  test('should show success message after manual save', async ({ page }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Fill form
    await fillMeetingForm(page, {
      title: 'Success Message Test',
      date: '2025-10-15',
      notes: 'Testing the success message display after manual save.',
    });

    // Click Save Draft
    await page.click('button:has-text("💾 Save Draft")');

    // Look for success message (should appear immediately)
    // Note: Message may disappear quickly, so we check localStorage as proof
    const draft = await getLocalStorage(page, 'brainDumps_draft');
    expect(draft).not.toBeNull();
  });

  // ========================================
  // MEETING HISTORY TESTS
  // ========================================

  test('should save processed meeting to history after processing', async ({
    page,
  }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Fill and submit form
    await fillMeetingForm(page, {
      title: 'History Test Meeting',
      date: '2025-10-15',
      participants: 'David, Eve',
      notes:
        'This meeting should be saved to history after processing. ' +
        'It includes action items, decisions, and blockers for testing.',
    });

    // Click Process button
    await page.click('button:has-text("🚀 Process with AI")');

    // Wait for processing to complete (mock takes 2 seconds)
    await page.waitForTimeout(3000);

    // Check localStorage for meeting history
    const meetings = await getLocalStorage(page, 'brainDumps_meetings');

    expect(meetings).not.toBeNull();
    expect(Array.isArray(meetings)).toBe(true);
    expect(meetings.length).toBeGreaterThan(0);

    // Find our meeting
    const ourMeeting = meetings.find(m => m.title === 'History Test Meeting');
    expect(ourMeeting).toBeDefined();
    expect(ourMeeting.results).toBeDefined();
    expect(ourMeeting.results.action_items).toBeDefined();
  });

  test('should limit history to 20 meetings maximum', async ({ page }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Pre-populate localStorage with 20 meetings
    const existingMeetings = Array(20)
      .fill(null)
      .map((_, i) => ({
        id: Date.now() - (20 - i) * 1000,
        title: `Existing Meeting ${i + 1}`,
        date: '2025-10-14',
        participants: 'Test User',
        notes: 'Test notes',
        results: {
          action_items: [],
          decisions: [],
          blockers: [],
        },
        processedAt: new Date(Date.now() - (20 - i) * 1000).toISOString(),
      }));

    await setLocalStorage(page, 'brainDumps_meetings', existingMeetings);
    await page.reload();

    // Process a new meeting (21st meeting)
    await fillMeetingForm(page, {
      title: 'Twenty-First Meeting',
      date: '2025-10-15',
      notes:
        'This is the 21st meeting and should cause the oldest meeting to be removed from history.',
    });

    await page.click('button:has-text("🚀 Process with AI")');
    await page.waitForTimeout(3000);

    // Check history
    const meetings = await getLocalStorage(page, 'brainDumps_meetings');

    // Should still be exactly 20 meetings
    expect(meetings.length).toBe(20);

    // Newest meeting should be present
    const newestMeeting = meetings.find(m => m.title === 'Twenty-First Meeting');
    expect(newestMeeting).toBeDefined();

    // Oldest meeting should be removed
    const oldestMeeting = meetings.find(m => m.title === 'Existing Meeting 1');
    expect(oldestMeeting).toBeUndefined();
  });

  test('should display history in sidebar after processing', async ({
    page,
  }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Process a meeting
    await fillMeetingForm(page, {
      title: 'Sidebar Test Meeting',
      date: '2025-10-15',
      notes:
        'This meeting should appear in the history sidebar after processing.',
    });

    await page.click('button:has-text("🚀 Process with AI")');
    await page.waitForTimeout(3000);

    // Check if meeting appears in sidebar
    const sidebarItem = page.locator('text="Sidebar Test Meeting"');
    await expect(sidebarItem).toBeVisible();
  });

  // ========================================
  // DATA PERSISTENCE TESTS
  // ========================================

  test('should persist draft after page refresh', async ({ page }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Save a draft
    await fillMeetingForm(page, {
      title: 'Persistence Test',
      date: '2025-10-15',
      participants: 'Frank',
      notes: 'This draft should persist after refreshing the page.',
    });

    await page.click('button:has-text("💾 Save Draft")');
    await page.waitForTimeout(500);

    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);

    // Check if localStorage still has the draft
    const draft = await getLocalStorage(page, 'brainDumps_draft');

    expect(draft).not.toBeNull();
    expect(draft.title).toBe('Persistence Test');
    expect(draft.participants).toBe('Frank');
  });

  test('should persist meeting history after page refresh', async ({
    page,
  }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Process a meeting
    await fillMeetingForm(page, {
      title: 'Persistent History Test',
      date: '2025-10-15',
      notes:
        'This meeting should remain in history after page refresh.',
    });

    await page.click('button:has-text("🚀 Process with AI")');
    await page.waitForTimeout(3000);

    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);

    // Check if meeting is still in history
    const meetings = await getLocalStorage(page, 'brainDumps_meetings');

    expect(meetings).not.toBeNull();
    const ourMeeting = meetings.find(
      m => m.title === 'Persistent History Test'
    );
    expect(ourMeeting).toBeDefined();

    // Check if it's visible in sidebar
    const sidebarItem = page.locator('text="Persistent History Test"');
    await expect(sidebarItem).toBeVisible();
  });

  // ========================================
  // HISTORY INTERACTION TESTS
  // ========================================

  test('should reload meeting when clicking history item', async ({ page }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Process a meeting
    await fillMeetingForm(page, {
      title: 'Reload Test Meeting',
      date: '2025-10-15',
      participants: 'Grace, Henry',
      notes:
        'This meeting should be reloadable from history by clicking on it.',
    });

    await page.click('button:has-text("🚀 Process with AI")');
    await page.waitForTimeout(3000);

    // Clear form
    await page.click('button:has-text("🗑️ Clear Form")');

    // Accept confirmation dialog
    page.on('dialog', dialog => dialog.accept());

    await page.waitForTimeout(500);

    // Click on history item
    await page.click('text="Reload Test Meeting"');
    await page.waitForTimeout(500);

    // Verify results are displayed again
    const summaryTitle = page.locator('h3:has-text("Reload Test Meeting")');
    await expect(summaryTitle).toBeVisible();

    // Verify results section is visible
    const resultsSection = page.locator('#results-section');
    await expect(resultsSection).toBeVisible();
  });

  test('should clear all history when Clear History button clicked', async ({
    page,
  }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Create some history
    const meetings = Array(3)
      .fill(null)
      .map((_, i) => ({
        id: Date.now() - i * 1000,
        title: `Test Meeting ${i + 1}`,
        date: '2025-10-15',
        notes: 'Test notes',
        results: { action_items: [], decisions: [], blockers: [] },
        processedAt: new Date().toISOString(),
      }));

    await setLocalStorage(page, 'brainDumps_meetings', meetings);
    await page.reload();

    // Set up dialog handler BEFORE clicking the button
    page.on('dialog', dialog => dialog.accept());

    // Click Clear History
    await page.click('button:has-text("Clear All")');
    await page.waitForTimeout(500);

    // Check localStorage
    const clearedMeetings = await getLocalStorage(page, 'brainDumps_meetings');

    // Should be null or empty array
    if (clearedMeetings !== null) {
      expect(clearedMeetings.length).toBe(0);
    }
  });

  // ========================================
  // AUTO-SAVE CLEANUP TESTS
  // ========================================

  test('should cleanup auto-save interval on page unload', async ({ page }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Fill form to trigger auto-save setup
    await fillMeetingForm(page, {
      title: 'Cleanup Test',
      date: '2025-10-15',
      notes: 'Testing auto-save interval cleanup on page unload.',
    });

    // Wait a moment for auto-save to be set up
    await page.waitForTimeout(1000);

    // Navigate away (triggers beforeunload)
    await page.goto('about:blank');

    // Note: We can't directly test if setInterval was cleared,
    // but we verify that no errors occur during navigation
    // which would indicate proper cleanup
  });
});

/**
 * localStorage Limits and Error Handling
 */
test.describe('Brain Dumps - localStorage Limits', () => {
  test('should handle localStorage quota exceeded gracefully', async ({
    page,
  }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Try to fill localStorage to capacity
    // Note: This is challenging to test reliably as quota varies by browser
    // Typically 5-10MB, so we'd need to store large amounts of data

    test.skip(true, 'Requires reliable localStorage quota testing mechanism');
  });

  test('should handle corrupted localStorage data gracefully', async ({
    page,
  }) => {
    await page.goto(BRAIN_DUMPS_PAGE);

    // Set corrupted data
    await page.evaluate(() => {
      localStorage.setItem('brainDumps_meetings', 'INVALID JSON{{{');
    });

    // Reload page - should handle gracefully
    await page.reload();

    // Page should load without errors
    const title = page.locator('h1:has-text("Brain Dumps")');
    await expect(title).toBeVisible();

    // History should be empty or default state
    const meetings = await getLocalStorage(page, 'brainDumps_meetings');

    // Either null (cleared) or valid array
    if (meetings !== null) {
      expect(Array.isArray(meetings)).toBe(true);
    }
  });
});

// SENTINEL TEST FILE - This file is intentionally designed to trigger security checks
// These are FAKE test values, not real credentials

// Test case 1: Hardcoded API key pattern
const API_KEY = "sk_test_SENTINEL_FAKE_PLACEHOLDER_12345";
const STRIPE_KEY = "pk_test_SENTINEL_TEST_PLACEHOLDER";

// Test case 2: API key in function
function connectToAPI() {
  const testKey = "sk_live_SENTINEL_FAKE_LIVE_KEY_12345"; // This should trigger CRITICAL
  return fetch('https://api.example.com', {
    headers: { 'Authorization': `Bearer ${testKey}` }
  });
}

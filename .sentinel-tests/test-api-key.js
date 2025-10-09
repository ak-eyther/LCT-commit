// This should be detected as CRITICAL by Sentinel
// Using fake placeholder that doesn't match live token patterns
const API_KEY = "sk_test_" + "SENTINEL_FAKE_PLACEHOLDER_12345";
const STRIPE_KEY = "pk_test_SENTINEL_TEST_PLACEHOLDER";

function connectToAPI() {
  return fetch('https://api.example.com', {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
}

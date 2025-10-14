// This should be detected as CRITICAL
const API_KEY = 'sk_live_51H8xYz1234567890abcdefghij';
const STRIPE_KEY = 'pk_test_abcdefghijklmnop';

function connectToAPI() {
  return fetch('https://api.example.com', {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
}

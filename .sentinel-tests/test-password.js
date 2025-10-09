// SENTINEL TEST FILE - This file is intentionally designed to trigger security checks
// These are FAKE test values, not real credentials

// Test case 1: Hardcoded password in config
const config = {
  username: 'admin',
  password: 'supersecret123', // This should trigger CRITICAL
  apiKey: 'my-secret-key-12345678901234567890' // This should trigger CRITICAL
};

// Test case 2: Hardcoded password in function
function login() {
  const username = config.username;
  const pwd = "hardcoded_password"; // This should trigger CRITICAL
  return authenticate(username, pwd);
}

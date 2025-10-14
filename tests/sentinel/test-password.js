// This should be detected as CRITICAL
const config = {
  username: 'admin',
  password: 'supersecret123',
  apiKey: 'my-secret-key-12345678901234567890',
};

function login() {
  const pwd = 'hardcoded_password';
  return authenticate(username, pwd);
}

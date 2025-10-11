// This should be detected as CRITICAL
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false // Disables SSL verification
});

fetch('https://api.example.com', { agent });

/**
 * Unit tests for authentication verification endpoint
 * Tests JWT_SECRET validation and token verification
 */

const verifyHandler = require('../../api/auth/verify');

// Mock request and response objects
const createMockReq = (authHeader = '') => ({
  headers: {
    authorization: authHeader
  }
});

const createMockRes = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

// Test suite
async function runTests() {
  console.log('🧪 Running authentication verification tests...\n');
  
  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Missing Authorization header
  console.log('Test 1: Missing Authorization header');
  try {
    const req = createMockReq();
    const res = createMockRes();
    await verifyHandler(req, res);
    
    if (res.statusCode === 401 && res.body.error === 'No token provided') {
      console.log('✅ PASS: Returns 401 for missing token\n');
      passedTests++;
    } else {
      console.log('❌ FAIL: Expected 401 with error message\n');
      failedTests++;
    }
  } catch (error) {
    console.log('❌ FAIL: Test threw error:', error.message, '\n');
    failedTests++;
  }

  // Test 2: Invalid Authorization format (missing Bearer)
  console.log('Test 2: Invalid Authorization format');
  try {
    const req = createMockReq('InvalidToken123');
    const res = createMockRes();
    await verifyHandler(req, res);
    
    if (res.statusCode === 401 && res.body.error === 'No token provided') {
      console.log('✅ PASS: Returns 401 for invalid format\n');
      passedTests++;
    } else {
      console.log('❌ FAIL: Expected 401 with error message\n');
      failedTests++;
    }
  } catch (error) {
    console.log('❌ FAIL: Test threw error:', error.message, '\n');
    failedTests++;
  }

  // Test 3: JWT_SECRET not configured (CRITICAL FIX)
  console.log('Test 3: JWT_SECRET not configured (CRITICAL TEST)');
  try {
    // Save original JWT_SECRET
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    
    const req = createMockReq('Bearer validtokenformat');
    const res = createMockRes();
    await verifyHandler(req, res);
    
    // Restore JWT_SECRET
    if (originalSecret) {
      process.env.JWT_SECRET = originalSecret;
    }
    
    if (res.statusCode === 500 && res.body.error === 'Server configuration error') {
      console.log('✅ PASS: Returns 500 when JWT_SECRET is not configured');
      console.log('   ✨ This is the fix for VIT-27!\n');
      passedTests++;
    } else {
      console.log('❌ FAIL: Expected 500 with server configuration error');
      console.log('   Received:', res.statusCode, res.body, '\n');
      failedTests++;
    }
  } catch (error) {
    console.log('❌ FAIL: Test threw error:', error.message, '\n');
    failedTests++;
  }

  // Test 4: Invalid JWT token
  console.log('Test 4: Invalid JWT token');
  try {
    process.env.JWT_SECRET = 'test-secret-key-for-testing';
    
    const req = createMockReq('Bearer invalid.jwt.token');
    const res = createMockRes();
    await verifyHandler(req, res);
    
    if (res.statusCode === 401 && res.body.error === 'Invalid token') {
      console.log('✅ PASS: Returns 401 for invalid token\n');
      passedTests++;
    } else {
      console.log('❌ FAIL: Expected 401 with invalid token error\n');
      failedTests++;
    }
  } catch (error) {
    console.log('❌ FAIL: Test threw error:', error.message, '\n');
    failedTests++;
  }

  // Test Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Total: ${passedTests + failedTests}`);
  console.log(`🎯 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  console.log('='.repeat(50));

  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});

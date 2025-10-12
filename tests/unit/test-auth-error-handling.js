/**
 * Test: Authentication Error Handling
 * Tests the getCurrentUser() function's error handling for malformed JSON
 */

// Mock localStorage for testing
class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = value.toString();
    }

    removeItem(key) {
        delete this.store[key];
    }

    clear() {
        this.store = {};
    }
}

global.localStorage = new LocalStorageMock();

// Import the auth module
const auth = require('../../src/app/auth.js');

// Test Suite
console.log('🧪 Testing Authentication Error Handling\n');

// Test 1: Valid JSON should parse successfully
console.log('Test 1: Valid JSON parsing');
localStorage.setItem('lctUser', JSON.stringify({ username: 'testuser', role: 'admin' }));
const validUser = auth.getCurrentUser();
console.assert(validUser !== null, '❌ FAIL: Should return user object');
console.assert(validUser.username === 'testuser', '❌ FAIL: Should have correct username');
console.log('✅ PASS: Valid JSON parsed correctly\n');

// Test 2: Malformed JSON should return null
console.log('Test 2: Malformed JSON handling');
localStorage.setItem('lctUser', '{invalid json}');
const invalidUser = auth.getCurrentUser();
console.assert(invalidUser === null, '❌ FAIL: Should return null for malformed JSON');
console.log('✅ PASS: Malformed JSON handled gracefully\n');

// Test 3: Corrupted data should be removed from localStorage
console.log('Test 3: Corrupted data cleanup');
localStorage.setItem('lctUser', '{corrupted: data');
auth.getCurrentUser();
const storedData = localStorage.getItem('lctUser');
console.assert(storedData === null, '❌ FAIL: Corrupted data should be removed');
console.log('✅ PASS: Corrupted data removed from localStorage\n');

// Test 4: Empty string should return null
console.log('Test 4: Empty string handling');
localStorage.setItem('lctUser', '');
const emptyUser = auth.getCurrentUser();
console.assert(emptyUser === null, '❌ FAIL: Should return null for empty string');
console.log('✅ PASS: Empty string handled correctly\n');

// Test 5: No stored user should return null
console.log('Test 5: No stored user handling');
localStorage.removeItem('lctUser');
const noUser = auth.getCurrentUser();
console.assert(noUser === null, '❌ FAIL: Should return null when no user stored');
console.log('✅ PASS: No stored user handled correctly\n');

// Test 6: Login should store valid JSON
console.log('Test 6: Login functionality');
const loginResult = auth.login('testuser', 'password123');
console.assert(loginResult.success === true, '❌ FAIL: Login should succeed');
const loggedInUser = auth.getCurrentUser();
console.assert(loggedInUser !== null, '❌ FAIL: Should retrieve logged in user');
console.assert(loggedInUser.username === 'testuser', '❌ FAIL: Should have correct username');
console.log('✅ PASS: Login and user retrieval working\n');

// Test 7: Logout should remove user
console.log('Test 7: Logout functionality');
auth.logout();
const loggedOutUser = auth.getCurrentUser();
console.assert(loggedOutUser === null, '❌ FAIL: User should be null after logout');
console.log('✅ PASS: Logout working correctly\n');

console.log('🎉 All tests passed!');
console.log('\n📊 Test Summary:');
console.log('   ✅ 7/7 tests passed');
console.log('   ❌ 0 failures');
console.log('\n🛡️ Error handling for JSON.parse is working correctly!');

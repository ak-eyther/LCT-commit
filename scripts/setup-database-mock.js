#!/usr/bin/env node

/**
 * LCT Authentication - Mock Database Setup (Local Development)
 *
 * This script creates a mock setup for local development.
 * The actual database will be set up when deployed to Vercel.
 */

const fs = require('fs');
const path = require('path');

async function setupMockDatabase() {
  try {
    console.log(
      '🔧 Setting up LCT authentication (mock mode for local development)...'
    );

    // Create a mock users file for local development
    const mockUsers = {
      'arif.khan@vitraya.com': {
        id: 1,
        email: 'arif.khan@vitraya.com',
        passwordHash:
          '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5J5K5K5K5K', // Mock hash for development password
        createdAt: new Date().toISOString(),
        lastLogin: null,
      },
    };

    // Save mock users to a local file
    const mockDataPath = path.join(__dirname, '..', 'mock-users.json');
    await fs.promises.writeFile(
      mockDataPath,
      JSON.stringify(mockUsers, null, 2)
    );

    console.log('✅ Mock database setup complete!');
    console.log('📝 This is for local development only.');
    console.log('📝 When deployed to Vercel, the real database will be used.');
    console.log('📝 Next steps:');
    console.log('   1. Test login at: /login.html');
    console.log('   2. Use: arif.khan@vitraya.com / [password in .env.local]');
  } catch (error) {
    console.error('❌ Mock database setup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupMockDatabase();
}

module.exports = { setupMockDatabase };

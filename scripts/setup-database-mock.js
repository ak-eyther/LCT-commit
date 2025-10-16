#!/usr/bin/env node

/**
 * LCT Authentication - Mock Database Setup (Local Development)
 *
 * This script creates a mock setup for local development.
 * The actual database will be set up when deployed to Vercel.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { normalizeRole } = require('../shared/role-utils');

async function setupMockDatabase() {
  try {
    console.log(
      '🔧 Setting up LCT authentication (mock mode for local development)...'
    );

    const adminEmail = process.env.MOCK_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword =
      process.env.MOCK_ADMIN_PASSWORD || 'ChangeMe123!';
    const normalizedEmail = adminEmail.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    const adminRole = normalizeRole('admin');

    const mockUsers = {
      [normalizedEmail]: {
        id: 1,
        email: normalizedEmail,
        passwordHash,
        role: adminRole,
        createdAt: new Date().toISOString(),
        lastLogin: null,
      },
    };

    const mockDataPath = path.join(__dirname, '..', 'mock-users.json');
    await fs.promises.writeFile(
      mockDataPath,
      JSON.stringify(mockUsers, null, 2)
    );

    console.log('✅ Mock database setup complete!');
    console.log(`👤 Admin email: ${normalizedEmail}`);
    console.log('🔐 Password sourced from MOCK_ADMIN_PASSWORD (or default).');
    console.log('📝 This is for local development only.');
    console.log('📝 When deployed to Vercel, the real database will be used.');
    console.log('📝 Next steps:');
    console.log('   1. Test login at: /login.html');
    console.log('   2. Use the configured mock admin credentials.');
  } catch (error) {
    console.error('❌ Mock database setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  setupMockDatabase();
}

module.exports = { setupMockDatabase };

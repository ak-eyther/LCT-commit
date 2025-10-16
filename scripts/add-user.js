#!/usr/bin/env node

/**
 * LCT Authentication - Add User Script
 *
 * This script adds a new user to the database with hashed password.
 * Usage: node scripts/add-user.js "email@example.com" "password"
 */

// Load environment variables from .env file
require('dotenv').config();

const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function addUser(email, password, role = 'user') {
  let client;
  try {
    console.log(`🔧 Adding user: ${email}`);

    // Validate POSTGRES_URL is configured
    if (!process.env.POSTGRES_URL) {
      console.error('❌ POSTGRES_URL environment variable is not configured');
      console.error('💡 Check:');
      console.error('   1. .env file exists in project root');
      console.error('   2. File contains: POSTGRES_URL=your-connection-string');
      console.error('   3. You ran: npm install dotenv');
      process.exit(1);
    }

    // Create database client with direct connection
    client = new Client({
      connectionString: process.env.POSTGRES_URL,
    });

    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const normalizedRole = role.toLowerCase();
    const allowedRoles = ['admin', 'user'];
    if (!allowedRoles.includes(normalizedRole)) {
      throw new Error(
        `Role must be one of: ${allowedRoles.join(', ')}`
      );
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('⚠️  User already exists. Updating password...');

      // Update existing user
      await client.query(
        'UPDATE users SET password_hash = $1, role = $2, created_at = CURRENT_TIMESTAMP WHERE email = $3',
        [passwordHash, normalizedRole, email]
      );

      console.log('✅ User password and role updated successfully');
    } else {
      // Insert new user
      await client.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
        [email, passwordHash, normalizedRole]
      );

      console.log('✅ User created successfully');
    }

    console.log('🎉 User setup complete!');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Role: ${normalizedRole}`);
    console.log('🔐 Password: [hidden for security]');
    console.log('📝 You can now test login at: /login.html');
  } catch (error) {
    console.error('❌ Failed to add user:', error.message);
    console.error('💡 Make sure:');
    console.error(
      '   - Database is set up (run: node scripts/setup-database.js)'
    );
    console.error(
      '   - POSTGRES_URL environment variable is configured in .env'
    );
    console.error('   - You have run: npm install');
    process.exit(1);
  } finally {
    // Close the database connection
    if (client) {
      await client.end();
    }
  }
}

// Get command line arguments
const email = process.argv[2];
const password = process.argv[3];
const role = process.argv[4] || 'user';

if (!email || !password) {
  console.log(
    'Usage: node scripts/add-user.js "email@example.com" "password" [role]'
  );
  console.log(
    'Example: node scripts/add-user.js "admin@example.com" "your-secure-password" admin'
  );
  process.exit(1);
}

// Run if called directly
if (require.main === module) {
  addUser(email, password, role);
}

module.exports = { addUser };

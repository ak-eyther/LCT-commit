#!/usr/bin/env node

/**
 * LCT Authentication - Add User Script
 * 
 * This script adds a new user to the database with hashed password.
 * Usage: node scripts/add-user.js "email@example.com" "password"
 */

const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');

async function addUser(email, password) {
  try {
    console.log(`🔧 Adding user: ${email}`);
    
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
    
    // Hash the password
    console.log('🔐 Hashing password...');
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    
    if (existingUser.rows.length > 0) {
      console.log('⚠️  User already exists. Updating password...');
      
      // Update existing user
      await sql`
        UPDATE users 
        SET password_hash = ${passwordHash}, created_at = CURRENT_TIMESTAMP
        WHERE email = ${email}
      `;
      
      console.log('✅ User password updated successfully');
    } else {
      // Insert new user
      await sql`
        INSERT INTO users (email, password_hash)
        VALUES (${email}, ${passwordHash})
      `;
      
      console.log('✅ User created successfully');
    }
    
    console.log('🎉 User setup complete!');
    console.log(`📧 Email: ${email}`);
    console.log('🔐 Password: [hidden for security]');
    console.log('📝 You can now test login at: /login.html');
    
  } catch (error) {
    console.error('❌ Failed to add user:', error.message);
    console.error('💡 Make sure:');
    console.error('   - Database is set up (run: node scripts/setup-database.js)');
    console.error('   - POSTGRES_URL environment variable is configured');
    console.error('   - You have run: npm install');
    process.exit(1);
  }
}

// Get command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node scripts/add-user.js "email@example.com" "password"');
  console.log('Example: node scripts/add-user.js "arif.khan@vitraya.com" "AkFk@#1897"');
  process.exit(1);
}

// Run if called directly
if (require.main === module) {
  addUser(email, password);
}

module.exports = { addUser };

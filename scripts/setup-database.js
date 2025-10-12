#!/usr/bin/env node

/**
 * LCT Authentication - Database Setup Script
 * 
 * This script creates the users table in Vercel Postgres database.
 * Run with: node scripts/setup-database.js
 */

const { sql } = require('@vercel/postgres');

async function setupDatabase() {
  try {
    console.log('🔧 Setting up LCT authentication database...');
    
    // Create users table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `;
    
    await sql`${sql.unsafe(createTableQuery)}`;
    console.log('✅ Users table created successfully');
    
    // Create index on email for faster lookups
    const createIndexQuery = `
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;
    
    await sql`${sql.unsafe(createIndexQuery)}`;
    console.log('✅ Email index created');
    
    console.log('🎉 Database setup complete!');
    console.log('📝 Next steps:');
    console.log('   1. Run: node scripts/add-user.js "arif.khan@vitraya.com" "AkFk@#1897"');
    console.log('   2. Test login at: /login.html');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('💡 Make sure:');
    console.error('   - Vercel Postgres is set up in your project');
    console.error('   - POSTGRES_URL environment variable is configured');
    console.error('   - You have run: npm install');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };

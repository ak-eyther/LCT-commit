#!/usr/bin/env node

/**
 * LCT Authentication - Database Setup Script
 *
 * This script creates the users table in Vercel Postgres database.
 * Run with: node scripts/setup-database.js
 */

// Load environment variables from .env file
require('dotenv').config();

const { Client } = require('pg');

async function setupDatabase() {
  let client;
  try {
    console.log('🔧 Setting up LCT authentication database...');

    if (!process.env.POSTGRES_URL) {
      console.error('❌ POSTGRES_URL environment variable is not configured');
      console.error('💡 Check:');
      console.error('   1. .env file exists in project root');
      console.error('   2. File contains: POSTGRES_URL=your-connection-string');
      console.error('   3. You ran: npm install dotenv');
      process.exit(1);
    }

    client = new Client({
      connectionString: process.env.POSTGRES_URL,
    });

    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        CONSTRAINT users_role_valid CHECK (role IN ('user','admin')),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMPTZ
      );
    `;

    await client.query(createTableQuery);
    console.log('✅ Users table created or verified successfully');

    const ensureRoleColumnQuery = `
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user';
    `;
    await client.query(ensureRoleColumnQuery);

    const ensureConstraintQuery = `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint c
          JOIN pg_class t ON t.oid = c.conrelid
          WHERE t.relname = 'users' AND c.conname = 'users_role_valid'
        ) THEN
          ALTER TABLE users
          ADD CONSTRAINT users_role_valid CHECK (role IN ('user','admin'));
        END IF;
      END $$;
    `;
    await client.query(ensureConstraintQuery);

    const ensureTimestampsQuery = `
      ALTER TABLE users
      ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
      ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
      ALTER COLUMN last_login TYPE TIMESTAMPTZ USING last_login AT TIME ZONE 'UTC';
    `;
    await client.query(ensureTimestampsQuery).catch(() => undefined);

    const createIndexQuery = `
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;
    await client.query(createIndexQuery);

    console.log('🎉 Database setup complete!');
    console.log('📝 Next steps:');
    console.log('   1. Run: node scripts/add-user.js "email@example.com" "your-secure-password" [role]');
    console.log('   2. Test login at: /login.html');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('💡 Make sure:');
    console.error('   - Vercel Postgres is set up in your project');
    console.error('   - POSTGRES_URL environment variable is configured in .env');
    console.error('   - You have run: npm install');
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
    }
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };

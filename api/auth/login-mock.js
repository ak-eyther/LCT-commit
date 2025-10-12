/**
 * LCT Authentication - Mock Login API (Local Development)
 * 
 * This is a mock version for local development.
 * The real version will be used when deployed to Vercel.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  // SECURITY: Prevent mock auth in production
  if (process.env.NODE_ENV === 'production') {
    console.error('CRITICAL: Mock login endpoint called in production environment');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error. Please contact support.'
    });
  }

  try {
    const { email, password, rememberMe } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Load mock users
    const mockDataPath = path.join(process.cwd(), 'mock-users.json');
    let mockUsers = {};
    
    try {
      const mockData = fs.readFileSync(mockDataPath, 'utf8');
      mockUsers = JSON.parse(mockData);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Mock database not set up. Run: node scripts/setup-database-mock.js'
      });
    }

    // Find user
    const user = mockUsers[email];
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Verify password using bcrypt (same as production)
    // The mock database stores bcrypt hashes, not plaintext
    if (!user.passwordHash) {
      console.error('CRITICAL: User record missing passwordHash field');
      return res.status(500).json({
        success: false,
        error: 'Mock database corrupted. Run: node scripts/setup-database-mock.js'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Validate JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET is not configured');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error. Please contact support.'
      });
    }

    // Generate JWT token with Remember Me support
    // Remember Me: 7 days, otherwise: 1 hour
    const expiresIn = rememberMe ? '7d' : '1h';

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // Update last login
    user.lastLogin = new Date().toISOString();
    fs.writeFileSync(mockDataPath, JSON.stringify(mockUsers, null, 2));

    // Return success with token
    return res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Mock login error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again.'
    });
  }
}

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

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { email, password } = req.body;

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

    // Verify password (for mock, we'll use a simple comparison)
    // In production, this would use bcrypt.compare()
    const isValidPassword = password === 'AkFk@#1897'; // Mock password check
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token (expires in 1 hour)
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET || 'mock-secret-for-local-dev',
      { expiresIn: '1h' }
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

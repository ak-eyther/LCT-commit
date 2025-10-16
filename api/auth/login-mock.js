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
const rateLimit = require('express-rate-limit');
const { normalizeRole } = require('../../shared/role-utils');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const logger = {
  error: (msg, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(msg, data);
    }
  },
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  await new Promise((resolve, reject) => {
    loginLimiter(req, res, err => {
      if (err) reject(err);
      else resolve();
    });
  }).catch(() => {
    return;
  });

  if (res.headersSent) {
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    logger.error('CRITICAL: Mock login endpoint called in production environment');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error. Please contact support.',
    });
  }

  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const mockDataPath = path.join(process.cwd(), 'mock-users.json');
    let mockUsers = {};

    try {
      const mockData = await fs.promises.readFile(mockDataPath, 'utf8');
      mockUsers = JSON.parse(mockData);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error:
          'Mock database not set up. Run: node scripts/setup-database-mock.js',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = mockUsers[normalizedEmail];
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    if (!user.passwordHash) {
      logger.error('CRITICAL: User record missing passwordHash field');
      return res.status(500).json({
        success: false,
        error:
          'Mock database corrupted. Run: node scripts/setup-database-mock.js',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    if (!process.env.JWT_SECRET) {
      logger.error('CRITICAL: JWT_SECRET is not configured');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error. Please contact support.',
      });
    }

    let userRole;
    try {
      userRole = normalizeRole(user.role || 'user');
    } catch (roleError) {
      logger.error('Mock login role normalization failed:', {
        message: roleError.message,
        role: user.role,
      });
      userRole = 'user';
    }
    user.role = userRole;

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: userRole,
    };

    const expiresIn = rememberMe ? '7d' : '1h';
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn,
    });

    user.lastLogin = new Date().toISOString();
    await fs.promises.writeFile(
      mockDataPath,
      JSON.stringify(mockUsers, null, 2)
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: userRole,
      },
    });
  } catch (error) {
    logger.error('Mock login error:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again.',
    });
  }
};

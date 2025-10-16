/**
 * LCT Authentication - Login API Endpoint
 *
 * @description Authenticates a user and returns a JWT token
 * @route POST /api/auth/login
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User email address
 * @param {string} req.body.password - User password (plaintext)
 * @param {boolean} [req.body.rememberMe] - Optional flag for extended session (7 days vs 1 hour)
 *
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} JSON response
 * @returns {boolean} success - Whether login was successful
 * @returns {string} [token] - JWT token if successful
 * @returns {Object} [user] - User object with id and email if successful
 * @returns {string} [error] - Error message if unsuccessful
 *
 * @throws {400} Bad Request - Missing email or password, or invalid email format
 * @throws {401} Unauthorized - Invalid credentials
 * @throws {405} Method Not Allowed - Non-POST request
 * @throws {429} Too Many Requests - Rate limit exceeded (5 attempts per 15 minutes)
 * @throws {500} Internal Server Error - Database or configuration error
 */

const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { normalizeRole } = require('../../shared/role-utils');

// Create rate limiter for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Production-safe logging utility
const logger = {
  error: (msg, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(msg, data);
    }
  },
  warn: (msg, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(msg, data);
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

  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userResult = await sql`
      SELECT id, email, password_hash, role
      FROM users
      WHERE email = ${normalizedEmail}
    `;

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const user = userResult.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

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
      logger.warn('Invalid role detected during login, defaulting to user', {
        userId: user.id,
        role: user.role,
        message: roleError.message,
      });
      userRole = 'user';
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: userRole,
    };

    const expiresIn = rememberMe ? '7d' : '1h';
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn });

    await sql`
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `;

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
    logger.error('Login error:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again.',
    });
  }
};

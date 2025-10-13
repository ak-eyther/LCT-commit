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

// Create rate limiter for login endpoint
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Production-safe logging utility
const logger = {
  error: (msg, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(msg, data);
    }
    // In production, this would integrate with your logging service
    // e.g., Sentry, LogRocket, CloudWatch, etc.
  }
};

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  // Apply rate limiting (for Vercel serverless)
  // Note: In production, use a distributed rate limiter with Redis or similar
  await new Promise((resolve, reject) => {
    loginLimiter(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  }).catch(() => {
    // Rate limit exceeded - response already sent by limiter
    return;
  });

  // Check if response was already sent by rate limiter
  if (res.headersSent) {
    return;
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

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Find user in database
    const userResult = await sql`
      SELECT id, email, password_hash 
      FROM users 
      WHERE email = ${email}
    `;

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Validate JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      logger.error('CRITICAL: JWT_SECRET is not configured');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error. Please contact support.'
      });
    }

    // Generate JWT token with appropriate expiration
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

    // Update last login timestamp
    await sql`
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${user.id}
    `;

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
    logger.error('Login error:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again.'
    });
  }
}

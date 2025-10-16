/**
 * LCT Authentication - Token Verification API Endpoint
 *
 * GET /api/auth/verify
 * Headers: { Authorization: "Bearer <token>" }
 * Returns: { success: boolean, user?: object, error?: string }
 */

const jwt = require('jsonwebtoken');
const { normalizeRole } = require('../../shared/role-utils');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.',
    });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const token = authHeader.substring(7);

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let userRole = 'user';

    try {
      userRole = normalizeRole(decoded.role || 'user');
    } catch (error) {
      userRole = 'user';
    }

    return res.status(200).json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: userRole,
      },
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. Please login again.',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Token verification failed',
    });
  }
};

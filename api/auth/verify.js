/**
 * Authentication Verification Endpoint
 * Verifies JWT tokens and returns user information
 * 
 * Security: Validates JWT_SECRET configuration before verification
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token and return user information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
module.exports = async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Validate JWT_SECRET exists before verification
    // This prevents cryptic errors if environment variable is not configured
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Return user info
    return res.status(200).json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email
      }
    });
  } catch (error) {
    // Handle JWT verification errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      error: 'Authentication verification failed'
    });
  }
};

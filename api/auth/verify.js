/**
 * LCT Authentication - Token Verification API Endpoint
 * 
 * GET /api/auth/verify
 * Headers: { Authorization: "Bearer <token>" }
 * Returns: { success: boolean, user?: object, error?: string }
 */

const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET.' 
    });
  }

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
    console.error('Token verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. Please login again.'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Token verification failed'
    });
  }
}

/**
 * LCT Authentication - Logout API Endpoint
 * 
 * POST /api/auth/logout
 * Headers: { Authorization: "Bearer <token>" }
 * Returns: { success: boolean, message: string }
 */

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
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token (optional - just to ensure it was valid)
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // Token is already invalid/expired, but that's okay for logout
      console.log('Token was already invalid during logout:', error.message);
    }

    // For JWT tokens, we don't need to store them server-side
    // The client just needs to remove the token from localStorage
    // In a more complex system, you might maintain a blacklist
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
}

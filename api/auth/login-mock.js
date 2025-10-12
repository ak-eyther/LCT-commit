/**
 * Mock Authentication API Endpoint
 * LCT-Vitraya Healthcare Claims System
 * 
 * This is a mock authentication endpoint for development/testing.
 * In production, replace with secure authentication service.
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Path to mock user data
const mockDataPath = path.join(__dirname, '../../data/mock-users.json');

/**
 * Hash password using SHA-256
 * Note: In production, use bcrypt or argon2 for password hashing
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Load mock users from file
 * @returns {Promise<Array>} Array of user objects
 */
async function loadMockUsers() {
  try {
    const data = await fs.readFile(mockDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return default users
    if (error.code === 'ENOENT') {
      return [
        {
          id: '1',
          username: 'admin',
          password: hashPassword('admin123'),
          role: 'admin',
          email: 'admin@lct.co.ke',
          lastLogin: null
        },
        {
          id: '2',
          username: 'reviewer',
          password: hashPassword('reviewer123'),
          role: 'reviewer',
          email: 'reviewer@lct.co.ke',
          lastLogin: null
        }
      ];
    }
    throw error;
  }
}

/**
 * Mock login endpoint handler
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function handleLogin(req, res) {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    // Load mock users
    const mockUsers = await loadMockUsers();

    // Hash provided password
    const hashedPassword = hashPassword(password);

    // Find user
    const user = mockUsers.find(
      u => u.username === username && u.password === hashedPassword
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login using ASYNC file operation (fixes Linear issue VIT-36)
    user.lastLogin = new Date().toISOString();
    
    try {
      // Ensure data directory exists
      await fs.mkdir(path.dirname(mockDataPath), { recursive: true });
      
      // Write file asynchronously to avoid blocking event loop
      await fs.writeFile(mockDataPath, JSON.stringify(mockUsers, null, 2));
    } catch (writeError) {
      // Log error but don't fail the login
      console.error('Failed to update last login time:', writeError.message);
    }

    // Return success response (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      success: true,
      user: userWithoutPassword,
      token: generateMockToken(user.id)
    });

  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * Generate mock JWT token
 * Note: In production, use proper JWT library
 */
function generateMockToken(userId) {
  const payload = {
    userId,
    timestamp: Date.now()
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

module.exports = {
  handleLogin,
  loadMockUsers,
  hashPassword
};

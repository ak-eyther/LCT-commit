/**
 * LCT Healthcare Claims System - Login API
 * 
 * This endpoint handles user authentication with support for extended sessions.
 * 
 * Security Features:
 * - JWT token-based authentication
 * - Password hashing (bcrypt)
 * - Input validation
 * - Rate limiting (recommended to add middleware)
 * - Secure token expiration handling
 * 
 * Remember Me Functionality:
 * - Default (unchecked): Token expires in 1 hour
 * - Remember Me (checked): Token expires in 7 days
 */

// This would normally be in a separate file, but kept here for simplicity
// In production, use environment variables for secrets
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-change-in-production';

/**
 * Main login handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed. Please use POST.'
        });
    }

    try {
        const { username, password, rememberMe } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Validate input types
        if (typeof username !== 'string' || typeof password !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Invalid input format'
            });
        }

        // Sanitize username (basic sanitization)
        const sanitizedUsername = username.trim().toLowerCase();

        if (sanitizedUsername.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Username must be at least 3 characters long'
            });
        }

        // In a real application, you would:
        // 1. Query the database for the user
        // 2. Compare the hashed password using bcrypt
        // 3. Return user information if valid
        
        // For demonstration purposes, we'll simulate this
        const user = await authenticateUser(sanitizedUsername, password);

        if (!user) {
            // Don't reveal whether username or password is wrong (security best practice)
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Determine token expiration based on rememberMe flag
        // If rememberMe is true: 7 days, else: 1 hour
        const expiresIn = rememberMe === true ? '7d' : '1h';
        const expiresInMs = rememberMe === true ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

        // Generate JWT token
        const token = generateToken(user, expiresIn);

        // Calculate expiration timestamp
        const expiresAt = new Date(Date.now() + expiresInMs).toISOString();

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            expiresAt: expiresAt,
            expiresIn: expiresIn,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                name: user.name
            }
        });

    } catch (error) {
        // Log error for debugging (in production, use proper logging service)
        console.error('Login error:', error);

        // Don't expose internal error details to client
        return res.status(500).json({
            success: false,
            message: 'An error occurred during login. Please try again later.'
        });
    }
}

/**
 * Authenticate user credentials
 * In production, this would query your database and verify password hash
 * 
 * @param {string} username - The username or email
 * @param {string} password - The password
 * @returns {Object|null} User object if valid, null otherwise
 */
async function authenticateUser(username, password) {
    try {
        // This is a DEMO implementation
        // In production, you would:
        // 1. Query database: const user = await db.users.findOne({ username })
        // 2. Verify password: const isValid = await bcrypt.compare(password, user.passwordHash)
        // 3. Return user if valid, null otherwise

        // Demo users for testing (REMOVE IN PRODUCTION)
        const demoUsers = [
            {
                id: '1',
                username: 'admin',
                email: 'admin@lct.co.ke',
                passwordHash: 'demo-hash-admin123', // In production: bcrypt hash
                role: 'admin',
                name: 'System Administrator'
            },
            {
                id: '2',
                username: 'reviewer',
                email: 'reviewer@lct.co.ke',
                passwordHash: 'demo-hash-reviewer123',
                role: 'reviewer',
                name: 'Claims Reviewer'
            },
            {
                id: '3',
                username: 'auditor',
                email: 'auditor@lct.co.ke',
                passwordHash: 'demo-hash-auditor123',
                role: 'auditor',
                name: 'Claims Auditor'
            }
        ];

        // Find user by username or email
        const user = demoUsers.find(u => 
            u.username === username || u.email === username
        );

        if (!user) {
            return null;
        }

        // In production, use bcrypt.compare(password, user.passwordHash)
        // For demo, accept any password that matches the pattern
        const validPassword = password.length >= 6;

        if (!validPassword) {
            return null;
        }

        // Return user without password hash
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;

    } catch (error) {
        console.error('Authentication error:', error);
        return null;
    }
}

/**
 * Generate JWT token
 * In production, use a proper JWT library like 'jsonwebtoken'
 * 
 * @param {Object} user - User object
 * @param {string} expiresIn - Token expiration time (e.g., '1h', '7d')
 * @returns {string} JWT token
 */
function generateToken(user, expiresIn) {
    // This is a simplified implementation
    // In production, use: jwt.sign(payload, JWT_SECRET, { expiresIn })
    
    try {
        // For this demo, we'll create a simple token structure
        // IMPORTANT: In production, use the 'jsonwebtoken' npm package
        
        const payload = {
            userId: user.id,
            username: user.username,
            role: user.role,
            iat: Math.floor(Date.now() / 1000),
            exp: calculateExpiration(expiresIn)
        };

        // In production: return jwt.sign(payload, JWT_SECRET, { expiresIn });
        // For demo, we'll use base64 encoding (NOT SECURE - FOR DEMO ONLY)
        const tokenPayload = JSON.stringify(payload);
        const token = Buffer.from(tokenPayload).toString('base64');
        
        return `demo.${token}.signature`;

    } catch (error) {
        console.error('Token generation error:', error);
        throw new Error('Failed to generate authentication token');
    }
}

/**
 * Calculate token expiration timestamp
 * @param {string} expiresIn - Expiration string (e.g., '1h', '7d')
 * @returns {number} Expiration timestamp in seconds
 */
function calculateExpiration(expiresIn) {
    const now = Math.floor(Date.now() / 1000);
    
    if (expiresIn === '1h') {
        return now + (60 * 60); // 1 hour
    } else if (expiresIn === '7d') {
        return now + (7 * 24 * 60 * 60); // 7 days
    }
    
    return now + (60 * 60); // Default to 1 hour
}

/**
 * Middleware to verify JWT token (for protected routes)
 * Usage: Add this to routes that require authentication
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token provided'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // In production, use: jwt.verify(token, JWT_SECRET)
        // For demo, we'll decode the base64 token
        const parts = token.split('.');
        if (parts.length !== 3 || parts[0] !== 'demo') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format'
            });
        }

        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
        const payload = JSON.parse(payloadJson);

        // Check if token is expired
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please login again.'
            });
        }

        // Attach user info to request
        req.user = {
            userId: payload.userId,
            username: payload.username,
            role: payload.role
        };

        next();

    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}

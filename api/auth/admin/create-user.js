/**
 * Admin-only endpoint for provisioning new users.
 *
 * POST /api/auth/admin/create-user
 * Headers: { Authorization: "Bearer <admin-token>" }
 * Body: { email: string, password: string, role?: "admin" | "user" }
 */

const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const ALLOWED_ROLES = ['admin', 'user'];

function respond(res, status, payload) {
  return res.status(status).json(payload);
}

function normalizeRole(role = 'user') {
  const normalized = role.toLowerCase();
  if (!ALLOWED_ROLES.includes(normalized)) {
    throw new Error(
      `Invalid role "${role}". Allowed roles: ${ALLOWED_ROLES.join(', ')}`
    );
  }
  return normalized;
}

async function createUserInDatabase(email, password, role) {
  const existing = await sql`
    SELECT id FROM users WHERE email = ${email}
  `;

  if (existing.rows.length > 0) {
    return { success: false, status: 409, message: 'User already exists' };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await sql`
    INSERT INTO users (email, password_hash, role)
    VALUES (${email}, ${passwordHash}, ${role})
  `;

  return { success: true, status: 201 };
}

async function createUserInMockStore(email, password, role) {
  const mockPath = path.join(process.cwd(), 'mock-users.json');
  let data = {};

  try {
    const content = await fs.promises.readFile(mockPath, 'utf8');
    data = JSON.parse(content);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  if (data[email]) {
    return { success: false, status: 409, message: 'User already exists' };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const nextId =
    Object.values(data).reduce(
      (max, entry) => (entry.id && entry.id > max ? entry.id : max),
      0
    ) + 1;

  data[email] = {
    id: nextId,
    email,
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
    lastLogin: null,
  };

  await fs.promises.writeFile(mockPath, JSON.stringify(data, null, 2));
  return { success: true, status: 201 };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return respond(res, 405, {
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return respond(res, 401, {
        success: false,
        error: 'Missing authentication token',
      });
    }

    const token = authHeader.substring(7);

    if (!process.env.JWT_SECRET) {
      return respond(res, 500, {
        success: false,
        error: 'Server configuration error',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return respond(res, 401, {
        success: false,
        error: 'Invalid or expired token',
      });
    }

    if ((decoded.role || 'user') !== 'admin') {
      return respond(res, 403, {
        success: false,
        error: 'Admin privileges required',
      });
    }

    const { email, password, role = 'user' } = req.body || {};

    if (!email || !password) {
      return respond(res, 400, {
        success: false,
        error: 'Email and password are required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return respond(res, 400, {
        success: false,
        error: 'Invalid email format',
      });
    }

    if (password.length < 6) {
      return respond(res, 400, {
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    let normalizedRole;
    try {
      normalizedRole = normalizeRole(role);
    } catch (error) {
      return respond(res, 400, {
        success: false,
        error: error.message,
      });
    }

    const useDatabase = !!process.env.POSTGRES_URL;
    const result = await (useDatabase
      ? createUserInDatabase(email, password, normalizedRole)
      : createUserInMockStore(email, password, normalizedRole));

    if (!result.success) {
      return respond(res, result.status, {
        success: false,
        error: result.message || 'Unable to create user',
      });
    }

    return respond(res, 201, {
      success: true,
      message: 'User created successfully',
    });
  } catch (error) {
    // Avoid leaking implementation details
    return respond(res, 500, {
      success: false,
      error: 'Internal server error',
    });
  }
};

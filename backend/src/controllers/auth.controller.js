// =============================================================
// ETHARA NEXUS - Auth Controller
// Handles signup, login, and profile fetch
// =============================================================
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { AppError } = require("../middleware/error.middleware");

/**
 * Generate a signed JWT for a given user ID
 */
const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const { seedUserData } = require("../utils/seedData.util");

/**
 * POST /api/auth/signup
 * Creates a new user account with hashed password
 */
const signup = async (req, res, next) => {
  try {
    const { fullName, email, password, role, department } = req.body;

    // Check if email is already registered
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError("An account with this email already exists.", 409);

    // Hash password with bcrypt (salt rounds: 12)
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: role || "MEMBER",
        department: department || null,
      },
      select: { id: true, fullName: true, email: true, role: true, department: true, createdAt: true },
    });

    // Seed sample data for the new user
    await seedUserData(user.id);

    const token = signToken(user.id);

    res.status(201).json({ success: true, message: "Account created successfully.", token, user });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user including password (normally excluded)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Invalid email or password.", 401);

    // Compare plain password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid email or password.", 401);

    const token = signToken(user.id);

    // Strip password before sending response
    const { password: _, ...safeUser } = user;

    res.json({ success: true, message: "Login successful.", token, user: safeUser });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile
 */
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, fullName: true, email: true, role: true, department: true,
        avatarUrl: true, createdAt: true, updatedAt: true,
        _count: { select: { assignedTasks: true, createdTasks: true, projectMemberships: true } },
      },
    });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe };

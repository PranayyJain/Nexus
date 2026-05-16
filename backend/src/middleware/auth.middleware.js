// =============================================================
// ETHARA NEXUS - JWT Authentication Middleware
// Protects routes by verifying Bearer tokens
// =============================================================
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { AppError } = require("./error.middleware");

/**
 * Middleware: verifyToken
 * Extracts and validates JWT from Authorization header.
 * Attaches the full user object to req.user on success.
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access denied. No token provided.", 401);
    }

    const token = authHeader.split(" ")[1];

    // Decode and verify token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user from DB to ensure they still exist and are valid
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        department: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User no longer exists.", 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token.", 401));
    }
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Token has expired. Please log in again.", 401));
    }
    next(err);
  }
};

/**
 * Middleware: requireAdmin
 * Must be used AFTER verifyToken.
 * Ensures only ADMIN users can access the route.
 */
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return next(new AppError("Access denied. Admin privileges required.", 403));
  }
  next();
};

/**
 * Middleware: requireProjectAdmin
 * Checks that the authenticated user is an ADMIN within the specified project.
 * Reads projectId from req.params.projectId
 */
const requireProjectAdmin = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const membership = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: req.user.id, projectId } },
    });

    if (!membership || membership.role !== "ADMIN") {
      throw new AppError("You must be a project admin to perform this action.", 403);
    }

    req.membership = membership;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { verifyToken, requireAdmin, requireProjectAdmin };

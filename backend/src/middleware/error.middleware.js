// =============================================================
// ETHARA NEXUS - Centralized Error Handler Middleware
// Provides consistent error response format across all routes
// =============================================================

/**
 * Custom application error class for throwing known errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes from unexpected errors
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Express error handling middleware (must have 4 params)
 * Catches all errors thrown in route handlers and returns consistent JSON
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  // Handle Prisma-specific errors with friendly messages
  if (err.code === "P2002") {
    statusCode = 409;
    message = "A record with this value already exists.";
  } else if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found.";
  } else if (err.code === "P2003") {
    statusCode = 400;
    message = "Invalid relation - referenced record does not exist.";
  }

  // Log the full error in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { AppError, errorHandler };

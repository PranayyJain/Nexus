// =============================================================
// ETHARA NEXUS - Express Application Entry Point
// =============================================================
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import route modules
const authRoutes = require("./src/routes/auth.routes");
const projectRoutes = require("./src/routes/project.routes");
const taskRoutes = require("./src/routes/task.routes");
const commentRoutes = require("./src/routes/comment.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const notificationRoutes = require("./src/routes/notification.routes");
const userRoutes = require("./src/routes/user.routes");
const libraryRoutes = require("./src/routes/library.routes");

// Import centralized error handler
const { errorHandler } = require("./src/middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 5000;

// ===================== MIDDLEWARE =====================

// CORS - allow requests from the frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ===================== ROUTES =====================
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/library", libraryRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Ethara Nexus API is running 🚀", timestamp: new Date().toISOString() });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Centralized error handler - must be last middleware
app.use(errorHandler);

// ===================== START SERVER =====================
app.listen(PORT, () => {
  console.log(`🚀 Ethara Nexus API running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;

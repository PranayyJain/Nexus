// =============================================================
// ETHARA NEXUS - Activity Logging Utility
// Centralizes activity log creation across all controllers
// =============================================================
const prisma = require("../lib/prisma");

/**
 * Creates an ActivityLog entry.
 * @param {Object} params
 * @param {string} params.userId - ID of the user performing the action
 * @param {string} params.action - Human-readable action string
 * @param {string} [params.projectId] - Related project ID
 * @param {string} [params.taskId] - Related task ID
 * @param {Object} [params.details] - Optional extra JSON metadata
 */
const logActivity = async ({ userId, action, projectId, taskId, details }) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        projectId: projectId || null,
        taskId: taskId || null,
        details: details || null,
      },
    });
  } catch (err) {
    // Activity logging should never crash the main request
    console.error("⚠️ Failed to log activity:", err.message);
  }
};

module.exports = { logActivity };

// =============================================================
// ETHARA NEXUS - Notification Creation Utility
// =============================================================
const prisma = require("../lib/prisma");

/**
 * Creates an in-app notification for a user.
 * @param {Object} params
 * @param {string} params.userId - The recipient's user ID
 * @param {string} params.content - Notification text
 * @param {string} [params.type] - "task_assigned" | "deadline" | "completed" | "info"
 * @param {string} [params.link] - Deep link URL (e.g., "/tasks/uuid")
 */
const createNotification = async ({ userId, content, type = "info", link }) => {
  try {
    await prisma.notification.create({
      data: { userId, content, type, link: link || null },
    });
  } catch (err) {
    // Notification errors should not crash the main flow
    console.error("⚠️ Failed to create notification:", err.message);
  }
};

module.exports = { createNotification };

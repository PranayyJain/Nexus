// =============================================================
// ETHARA NEXUS - Notification Controller
// Fetches and manages user notifications
// =============================================================
const prisma = require("../lib/prisma");

/**
 * GET /api/notifications
 * Returns the latest 30 notifications for the current user
 */
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false },
    });

    res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/read-all
 * Marks all notifications as read for the current user
 */
const markAllRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });
    res.json({ success: true, message: "All notifications marked as read." });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/:notificationId/read
 * Marks a single notification as read
 */
const markRead = async (req, res, next) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.notificationId },
      data: { isRead: true },
    });
    res.json({ success: true, message: "Notification marked as read." });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markAllRead, markRead };

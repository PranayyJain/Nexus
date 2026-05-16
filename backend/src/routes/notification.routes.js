// =============================================================
// ETHARA NEXUS - Notification Routes
// =============================================================
const express = require("express");
const router = express.Router();
const { getNotifications, markAllRead, markRead } = require("../controllers/notification.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.use(verifyToken);

router.get("/", getNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:notificationId/read", markRead);

module.exports = router;

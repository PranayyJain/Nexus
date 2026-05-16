// =============================================================
// ETHARA NEXUS - Dashboard Routes
// =============================================================
const express = require("express");
const router = express.Router();
const { getOverview, getTeamPerformance, getWeeklyStats } = require("../controllers/dashboard.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.use(verifyToken);

router.get("/overview", getOverview);
router.get("/team-performance", getTeamPerformance);
router.get("/weekly-stats", getWeeklyStats);

module.exports = router;

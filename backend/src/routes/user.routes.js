// =============================================================
// ETHARA NEXUS - User Routes
// =============================================================
const express = require("express");
const router = express.Router();
const { getUsers, getUserProfile, updateProfile } = require("../controllers/user.controller");
const { verifyToken, requireAdmin } = require("../middleware/auth.middleware");

router.use(verifyToken);

router.get("/", getUsers);           // searchable user list (for invites)
router.put("/profile", updateProfile);          // update own profile
router.get("/:userId", getUserProfile);         // public profile with stats

module.exports = router;

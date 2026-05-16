// =============================================================
// ETHARA NEXUS - Auth Routes
// =============================================================
const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", verifyToken, getMe);

module.exports = router;

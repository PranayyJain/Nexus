// =============================================================
// ETHARA NEXUS - Comment Routes
// =============================================================
const express = require("express");
const router = express.Router();
const { getComments, addComment, deleteComment } = require("../controllers/comment.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.use(verifyToken);

router.get("/:taskId", getComments);
router.post("/:taskId", addComment);
router.delete("/:commentId", deleteComment);

module.exports = router;

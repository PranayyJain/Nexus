// =============================================================
// ETHARA NEXUS - Task Routes
// =============================================================
const express = require("express");
const router = express.Router();
const { getTasks, getTask, createTask, updateTask, deleteTask } = require("../controllers/task.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.use(verifyToken);

router.get("/", getTasks);
router.post("/", createTask);
router.get("/:taskId", getTask);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

module.exports = router;

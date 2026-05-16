// =============================================================
// ETHARA NEXUS - Project Routes
// =============================================================
const express = require("express");
const router = express.Router();
const {
  getProjects, getProject, createProject, updateProject, deleteProject,
  inviteMember, removeMember,
} = require("../controllers/project.controller");
const { verifyToken, requireProjectAdmin } = require("../middleware/auth.middleware");

// All project routes require authentication
router.use(verifyToken);

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:projectId", getProject);
router.put("/:projectId", requireProjectAdmin, updateProject);
router.delete("/:projectId", requireProjectAdmin, deleteProject);

// Member management (admin only)
router.post("/:projectId/members", requireProjectAdmin, inviteMember);
router.delete("/:projectId/members/:memberId", requireProjectAdmin, removeMember);

module.exports = router;

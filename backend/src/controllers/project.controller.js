// =============================================================
// ETHARA NEXUS - Project Controller
// Full CRUD + member management for projects
// =============================================================
const prisma = require("../lib/prisma");
const { AppError } = require("../middleware/error.middleware");
const { logActivity } = require("../utils/activity.util");
const { createNotification } = require("../utils/notification.util");

/**
 * GET /api/projects
 * Returns all projects the authenticated user is a member of
 */
const getProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { members: { some: { userId: req.user.id } } },
      include: {
        members: {
          include: { user: { select: { id: true, fullName: true, email: true, avatarUrl: true, department: true } } },
        },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/projects/:projectId
 * Returns a single project with full details
 */
const getProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: { user: { select: { id: true, fullName: true, email: true, avatarUrl: true, role: true, department: true } } },
        },
        tasks: {
          include: {
            assignee: { select: { id: true, fullName: true, avatarUrl: true } },
            creator: { select: { id: true, fullName: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { tasks: true, members: true } },
      },
    });

    if (!project) throw new AppError("Project not found.", 404);

    // Ensure user is a member of this project
    const isMember = project.members.some((m) => m.userId === req.user.id);
    if (!isMember) throw new AppError("You are not a member of this project.", 403);

    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/projects
 * Creates a new project. Creator is automatically assigned as ADMIN.
 */
const createProject = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        color: color || "#6366f1",
        // Auto-add creator as ADMIN member
        members: { create: { userId: req.user.id, role: "ADMIN" } },
      },
      include: {
        members: { include: { user: { select: { id: true, fullName: true, email: true, avatarUrl: true } } } },
        _count: { select: { tasks: true } },
      },
    });

    // Log the creation activity
    await logActivity({
      userId: req.user.id,
      projectId: project.id,
      action: `created project "${project.name}"`,
    });

    res.status(201).json({ success: true, message: "Project created successfully.", project });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/projects/:projectId
 * Updates project details (Admin only)
 */
const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { name, description, color } = req.body;

    const project = await prisma.project.update({
      where: { id: projectId },
      data: { name, description, color },
    });

    await logActivity({ userId: req.user.id, projectId, action: `updated project "${project.name}"` });

    res.json({ success: true, message: "Project updated.", project });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/projects/:projectId
 * Deletes a project and all related data (Admin only)
 */
const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new AppError("Project not found.", 404);

    await prisma.project.delete({ where: { id: projectId } });

    res.json({ success: true, message: "Project deleted successfully." });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/projects/:projectId/members
 * Invites a user to a project by email (Admin only)
 */
const inviteMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { email, role } = req.body;

    // Find the user to invite
    const userToInvite = await prisma.user.findUnique({ where: { email } });
    if (!userToInvite) throw new AppError("No user found with that email address.", 404);

    // Check if already a member
    const existing = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: userToInvite.id, projectId } },
    });
    if (existing) throw new AppError("This user is already a project member.", 409);

    await prisma.projectMember.create({
      data: { userId: userToInvite.id, projectId, role: role || "MEMBER" },
    });

    // Notify the invited user
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    await createNotification({
      userId: userToInvite.id,
      content: `${req.user.fullName} added you to project "${project.name}"`,
      type: "info",
      link: `/projects/${projectId}`,
    });

    await logActivity({
      userId: req.user.id,
      projectId,
      action: `invited ${userToInvite.fullName} to the project`,
    });

    res.status(201).json({ success: true, message: `${userToInvite.fullName} added to project.` });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/projects/:projectId/members/:memberId
 * Removes a member from a project (Admin only)
 */
const removeMember = async (req, res, next) => {
  try {
    const { projectId, memberId } = req.params;

    const membership = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: memberId, projectId } },
      include: { user: true },
    });
    if (!membership) throw new AppError("Member not found in this project.", 404);

    await prisma.projectMember.delete({
      where: { userId_projectId: { userId: memberId, projectId } },
    });

    await logActivity({
      userId: req.user.id,
      projectId,
      action: `removed ${membership.user.fullName} from the project`,
    });

    res.json({ success: true, message: "Member removed successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, inviteMember, removeMember };

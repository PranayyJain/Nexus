// =============================================================
// ETHARA NEXUS - Task Controller
// Full CRUD, filtering, status updates, and assignment
// =============================================================
const prisma = require("../lib/prisma");
const { AppError } = require("../middleware/error.middleware");
const { logActivity } = require("../utils/activity.util");
const { createNotification } = require("../utils/notification.util");

// Fields to select for task responses (consistent shape across endpoints)
const TASK_SELECT = {
  id: true, title: true, description: true, dueDate: true,
  priority: true, status: true, tags: true, createdAt: true, updatedAt: true,
  assignee: { select: { id: true, fullName: true, avatarUrl: true, department: true } },
  creator: { select: { id: true, fullName: true, avatarUrl: true } },
  project: { select: { id: true, name: true, color: true } },
  _count: { select: { comments: true } },
};

/**
 * GET /api/tasks
 * Returns tasks with optional filters: projectId, status, priority, assigneeId, overdue, search
 */
const getTasks = async (req, res, next) => {
  try {
    const { projectId, status, priority, assigneeId, overdue, search } = req.query;

    const where = {};

    // Scope to projects where user is a member
    if (projectId) {
      where.projectId = projectId;
    } else {
      where.project = { members: { some: { userId: req.user.id } } };
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) where.assigneeId = assigneeId;

    // Filter overdue tasks (dueDate in the past and not done)
    if (overdue === "true") {
      where.dueDate = { lt: new Date() };
      where.status = { not: "DONE" };
    }

    // Full-text search on title and description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      select: TASK_SELECT,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    res.json({ success: true, tasks });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tasks/:taskId
 * Returns a single task with comments and activity logs
 */
const getTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: { select: { id: true, fullName: true, avatarUrl: true, department: true } },
        creator: { select: { id: true, fullName: true, avatarUrl: true } },
        project: { select: { id: true, name: true, color: true } },
        comments: {
          include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
          orderBy: { createdAt: "asc" },
        },
        activities: {
          include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!task) throw new AppError("Task not found.", 404);

    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/tasks
 * Creates a new task inside a project
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status, assigneeId, projectId, tags } = req.body;

    // Verify the project exists and user is a member
    const membership = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: req.user.id, projectId } },
    });
    if (!membership) throw new AppError("You are not a member of this project.", 403);

    const task = await prisma.task.create({
      data: {
        title, description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || "MEDIUM",
        status: status || "TODO",
        tags: tags || [],
        assigneeId: assigneeId || null,
        creatorId: req.user.id,
        projectId,
      },
      select: TASK_SELECT,
    });

    // Notify the assignee if different from creator
    if (assigneeId && assigneeId !== req.user.id) {
      await createNotification({
        userId: assigneeId,
        content: `${req.user.fullName} assigned you a task: "${task.title}"`,
        type: "task_assigned",
        link: `/tasks/${task.id}`,
      });
    }

    await logActivity({
      userId: req.user.id,
      projectId,
      taskId: task.id,
      action: `created task "${task.title}"`,
    });

    res.status(201).json({ success: true, message: "Task created.", task });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/tasks/:taskId
 * Updates any task fields
 */
const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { title, description, dueDate, priority, status, assigneeId, tags } = req.body;

    const existing = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existing) throw new AppError("Task not found.", 404);

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(priority !== undefined && { priority }),
        ...(status !== undefined && { status }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(tags !== undefined && { tags }),
      },
      select: TASK_SELECT,
    });

    // If status changed, log it prominently
    if (status && status !== existing.status) {
      await logActivity({
        userId: req.user.id,
        projectId: task.project.id,
        taskId,
        action: `updated "${task.title}" status to ${status}`,
      });
    } else {
      await logActivity({
        userId: req.user.id,
        projectId: task.project.id,
        taskId,
        action: `updated task "${task.title}"`,
      });
    }

    // Notify new assignee
    if (assigneeId && assigneeId !== existing.assigneeId && assigneeId !== req.user.id) {
      await createNotification({
        userId: assigneeId,
        content: `${req.user.fullName} assigned you a task: "${task.title}"`,
        type: "task_assigned",
        link: `/tasks/${taskId}`,
      });
    }

    res.json({ success: true, message: "Task updated.", task });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/tasks/:taskId
 * Deletes a task (creator or project admin only)
 */
const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found.", 404);

    // Only creator or global admin can delete
    if (task.creatorId !== req.user.id && req.user.role !== "ADMIN") {
      throw new AppError("You don't have permission to delete this task.", 403);
    }

    await prisma.task.delete({ where: { id: taskId } });

    res.json({ success: true, message: "Task deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };

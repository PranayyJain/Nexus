// =============================================================
// ETHARA NEXUS - Comment Controller
// Threaded task discussions
// =============================================================
const prisma = require("../lib/prisma");
const { AppError } = require("../middleware/error.middleware");
const { logActivity } = require("../utils/activity.util");

/**
 * GET /api/comments/:taskId
 * Returns all comments for a task, ordered chronologically
 */
const getComments = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: { user: { select: { id: true, fullName: true, avatarUrl: true, department: true } } },
      orderBy: { createdAt: "asc" },
    });
    res.json({ success: true, comments });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/comments/:taskId
 * Adds a comment to a task
 */
const addComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found.", 404);

    const comment = await prisma.comment.create({
      data: { content, taskId, userId: req.user.id },
      include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
    });

    await logActivity({
      userId: req.user.id,
      taskId,
      projectId: task.projectId,
      action: `commented on "${task.title}"`,
    });

    res.status(201).json({ success: true, comment });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/comments/:commentId
 * Deletes a comment (owner only)
 */
const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new AppError("Comment not found.", 404);
    if (comment.userId !== req.user.id) throw new AppError("You can only delete your own comments.", 403);

    await prisma.comment.delete({ where: { id: commentId } });
    res.json({ success: true, message: "Comment deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = { getComments, addComment, deleteComment };

// =============================================================
// ETHARA NEXUS - User Controller
// Profile retrieval and user search for invites
// =============================================================
const prisma = require("../lib/prisma");
const { AppError } = require("../middleware/error.middleware");

/**
 * GET /api/users
 * Returns a searchable list of all users (for member invite dropdown)
 * Admins only
 */
const getUsers = async (req, res, next) => {
  try {
    const { search } = req.query;

    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      select: { id: true, fullName: true, email: true, role: true, department: true, avatarUrl: true, createdAt: true },
      orderBy: { fullName: "asc" },
    });

    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:userId
 * Returns a user profile with their task and project stats
 */
const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, fullName: true, email: true, role: true, department: true, avatarUrl: true, createdAt: true,
        assignedTasks: {
          select: { id: true, title: true, status: true, priority: true, dueDate: true, project: { select: { name: true, color: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        projectMemberships: {
          include: { project: { select: { id: true, name: true, color: true, _count: { select: { tasks: true } } } } },
        },
        _count: { select: { assignedTasks: true, createdTasks: true, comments: true } },
      },
    });

    if (!user) throw new AppError("User not found.", 404);

    // Compute task completion rate
    const doneTasks = user.assignedTasks.filter((t) => t.status === "DONE").length;

    res.json({ success: true, user, stats: { doneTasks, totalAssigned: user._count.assignedTasks } });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/profile
 * Updates the current user's profile (name, department, avatar)
 */
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, department, avatarUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(fullName && { fullName }),
        ...(department && { department }),
        ...(avatarUrl && { avatarUrl }),
      },
      select: { id: true, fullName: true, email: true, role: true, department: true, avatarUrl: true },
    });

    res.json({ success: true, message: "Profile updated.", user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, getUserProfile, updateProfile };

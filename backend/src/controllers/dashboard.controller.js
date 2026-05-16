// =============================================================
// ETHARA NEXUS - Dashboard Controller
// Analytics aggregations for the main dashboard view
// =============================================================
const prisma = require("../lib/prisma");

/**
 * GET /api/dashboard/overview
 * Returns high-level stats: project count, task counts by status, overdue, etc.
 */
const getOverview = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all project IDs the user belongs to
    const memberships = await prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true },
    });
    const projectIds = memberships.map((m) => m.projectId);

    // Run all aggregations in parallel for performance
    const [
      totalProjects,
      totalTasks,
      tasksByStatus,
      overdueTasks,
      myTasks,
      recentActivities,
      upcomingDeadlines,
      tasksByType,
    ] = await Promise.all([
      // Total projects user is in
      prisma.project.count({ where: { id: { in: projectIds } } }),

      // Total tasks across all user's projects
      prisma.task.count({ where: { projectId: { in: projectIds } } }),

      // Task count grouped by status
      prisma.task.groupBy({
        by: ["status"],
        where: { projectId: { in: projectIds } },
        _count: { status: true },
      }),

      // Overdue tasks (past due and not done)
      prisma.task.count({
        where: {
          projectId: { in: projectIds },
          dueDate: { lt: new Date() },
          status: { not: "DONE" },
        },
      }),

      // Tasks assigned to the current user
      prisma.task.findMany({
        where: { assigneeId: userId, status: { not: "DONE" } },
        select: { id: true, title: true, status: true, priority: true, dueDate: true, project: { select: { name: true, color: true } } },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),

      // Recent activity across all projects
      prisma.activityLog.findMany({
        where: { projectId: { in: projectIds } },
        include: { user: { select: { id: true, fullName: true, avatarUrl: true } }, project: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),

      // Tasks with upcoming deadlines (next 7 days)
      prisma.task.findMany({
        where: {
          projectId: { in: projectIds },
          dueDate: { gte: new Date(), lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
          status: { not: "DONE" },
        },
        select: {
          id: true, title: true, dueDate: true, priority: true, status: true,
          assignee: { select: { id: true, fullName: true, avatarUrl: true } },
          project: { select: { name: true, color: true } },
        },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),

      // Task count grouped by type
      prisma.task.groupBy({
        by: ["taskType"],
        where: { projectId: { in: projectIds } },
        _count: { taskType: true },
      }),
    ]);
    // Format status breakdown into a simple map
    const statusMap = {};
    tasksByStatus.forEach((s) => { statusMap[s.status] = s._count.status; });
    
    // Format type breakdown into a simple map
    const typeMap = {};
    tasksByType.forEach((t) => { typeMap[t.taskType] = t._count.taskType; });

    // Generate AI Insight
    let aiInsights = [];
    if (statusMap["BLOCKED"] > 0) aiInsights.push(`Critical: ${statusMap["BLOCKED"]} tasks are blocked.`);
    if (statusMap["IN_REVIEW"] > 5) aiInsights.push(`Bottleneck: ${statusMap["IN_REVIEW"]} tasks waiting for QA.`);
    if (overdueTasks > 0) aiInsights.push(`Alert: ${overdueTasks} tasks are overdue.`);
    if (aiInsights.length === 0) aiInsights.push("All operations running smoothly.");

    res.json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        tasksByStatus: statusMap,
        tasksByType: typeMap,
        overdueTasks,
        myTasks,
        recentActivities,
        upcomingDeadlines,
        aiInsights: aiInsights.join(" "),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/team-performance
 * Returns per-user task completion stats for the team productivity chart
 */
const getTeamPerformance = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const memberships = await prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true },
    });
    const projectIds = memberships.map((m) => m.projectId);

    // Get all members in those projects with their task stats
    const members = await prisma.user.findMany({
      where: { projectMemberships: { some: { projectId: { in: projectIds } } } },
      select: {
        id: true, fullName: true, avatarUrl: true, department: true,
        _count: { select: { assignedTasks: true } },
      },
    });

    // For each member, get done vs total tasks
    const performance = await Promise.all(
      members.map(async (member) => {
        const done = await prisma.task.count({
          where: { assigneeId: member.id, projectId: { in: projectIds }, status: "DONE" },
        });
        const total = await prisma.task.count({
          where: { assigneeId: member.id, projectId: { in: projectIds } },
        });
        return {
          ...member,
          doneTasks: done,
          totalTasks: total,
          completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
        };
      })
    );

    res.json({ success: true, data: performance });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/weekly-stats
 * Returns task creation/completion counts for the past 7 days (for line/bar chart)
 */
const getWeeklyStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const memberships = await prisma.projectMember.findMany({ where: { userId }, select: { projectId: true } });
    const projectIds = memberships.map((m) => m.projectId);

    const stats = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const start = new Date(day.setHours(0, 0, 0, 0));
      const end = new Date(day.setHours(23, 59, 59, 999));

      const [created, completed] = await Promise.all([
        prisma.task.count({ where: { projectId: { in: projectIds }, createdAt: { gte: start, lte: end } } }),
        prisma.task.count({ where: { projectId: { in: projectIds }, status: "DONE", updatedAt: { gte: start, lte: end } } }),
      ]);

      stats.push({
        date: start.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
        created,
        completed,
      });
    }

    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOverview, getTeamPerformance, getWeeklyStats };

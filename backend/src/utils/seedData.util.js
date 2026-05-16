// =============================================================
// ETHARA NEXUS - User Seeding Utility
// Generates sample projects, tasks, and notifications for new users
// =============================================================
const prisma = require("../lib/prisma");

/**
 * Seeds a newly created user with sample data so their dashboard isn't empty.
 * @param {string} userId - The ID of the newly created user
 */
const seedUserData = async (userId) => {
  try {
    // 1. Create Sample Projects
    const projects = await Promise.all([
      prisma.project.create({
        data: {
          name: "Project: Obsidian Phoenix",
          description: "High-priority LLM refinement for creative agency benchmarks. Focus on zero-shot reasoning.",
          color: "#ff4500", // Neon Orange
          members: { create: { userId, role: "ADMIN" } }
        }
      }),
      prisma.project.create({
        data: {
          name: "Project: Cyber-Curation",
          description: "Global dataset metadata cleanup for multi-modal model training (Image + Text).",
          color: "#00f0ff", // Cyber Cyan
          members: { create: { userId, role: "MEMBER" } }
        }
      }),
      prisma.project.create({
        data: {
          name: "Project: Infrastructure Zero",
          description: "Scaling internal GPU cluster monitoring and automated failover systems.",
          color: "#39ff14", // Cyber Green
          members: { create: { userId, role: "MEMBER" } }
        }
      })
    ]);

    // 2. Create Sample Tasks for Project 1 (Obsidian Phoenix)
    await prisma.task.createMany({
      data: [
        {
          title: "Optimize Zero-Shot Prompts",
          description: "Refine system prompts for creative writing tasks to improve diversity scores.",
          status: "DONE",
          priority: "HIGH",
          taskType: "PROMPT_QA",
          confidenceScore: 0.94,
          projectId: projects[0].id,
          creatorId: userId,
          assigneeId: userId,
          tags: ["benchmark", "LLM", "creative"]
        },
        {
          title: "Benchmarking GPT-4o vs Claude 3.5",
          description: "Run comparative analysis on the agency creative suite test cases.",
          status: "IN_PROGRESS",
          priority: "CRITICAL",
          taskType: "MODEL_EVAL",
          confidenceScore: 0.88,
          projectId: projects[0].id,
          creatorId: userId,
          assigneeId: userId,
          tags: ["comparison", "eval"]
        },
        {
          title: "Reviewer Feedback Integration",
          description: "Integrate feedback from the creative team into the prompt engineering pipeline.",
          status: "TODO",
          priority: "MEDIUM",
          taskType: "GENERAL",
          projectId: projects[0].id,
          creatorId: userId,
          assigneeId: userId,
          tags: ["sprint-1"]
        }
      ]
    });

    // 3. Create Sample Tasks for Project 2 (Cyber-Curation)
    await prisma.task.createMany({
      data: [
        {
          title: "Metadata Tagging Audit",
          description: "Audit 50k images for correct 'Cyberpunk' vs 'Industrial' tagging accuracy.",
          status: "DONE",
          priority: "MEDIUM",
          taskType: "ANNOTATION",
          confidenceScore: 0.99,
          projectId: projects[1].id,
          creatorId: userId,
          assigneeId: userId,
          tags: ["dataset", "audit"]
        },
        {
          title: "Deduplication Pipeline Fix",
          description: "Resolve memory leak in the image hashing utility for large batch processing.",
          status: "IN_PROGRESS",
          priority: "HIGH",
          taskType: "DATA_CLEANUP",
          projectId: projects[1].id,
          creatorId: userId,
          assigneeId: userId,
          tags: ["bugfix", "performance"]
        }
      ]
    });

    // 4. Create Sample Tasks for Project 3 (Infrastructure Zero)
    await prisma.task.createMany({
      data: [
        {
          title: "Dashboard Latency Review",
          description: "Optimize the analytical queries used in the team velocity charts.",
          status: "TODO",
          priority: "HIGH",
          taskType: "INFRA",
          projectId: projects[2].id,
          creatorId: userId,
          assigneeId: userId,
          tags: ["dashboard", "optimization"]
        }
      ]
    });

    // 5. Create Welcome Notifications
    await prisma.notification.createMany({
      data: [
        {
          userId,
          content: "Welcome to Ethara Nexus. Your Cyber-Industrial workspace is now active.",
          type: "info",
        },
        {
          userId,
          content: "You have been automatically assigned as Project Admin for 'Project: Obsidian Phoenix'.",
          type: "task_assigned",
        }
      ]
    });

    // 6. Create initial activity log entries
    await prisma.activityLog.create({
      data: {
        action: "joined Ethara Nexus and initialized workspace",
        userId,
        projectId: projects[0].id
      }
    });

    return true;
  } catch (error) {
    console.error("Error seeding user data:", error);
    // We don't want to fail the whole signup if seeding fails, but we should log it
    return false;
  }
};

module.exports = { seedUserData };

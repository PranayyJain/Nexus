// =============================================================
// ETHARA NEXUS - Database Seeder
// Populates the DB with realistic Indian sample data for Ethara.ai
// Run with: node prisma/seed.js
// =============================================================
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// ===================== SAMPLE DATA =====================

const users = [
  { fullName: "Pranay Jain",   email: "pranay.jain@ethara.ai",   password: "Ethara@123", role: "ADMIN",  department: "TPM" },
  { fullName: "Aarav Sharma",  email: "aarav.sharma@ethara.ai",  password: "Ethara@123", role: "MEMBER", department: "SDE" },
  { fullName: "Neha Verma",    email: "neha.verma@ethara.ai",    password: "Ethara@123", role: "MEMBER", department: "QR" },
  { fullName: "Rohan Mehta",   email: "rohan.mehta@ethara.ai",   password: "Ethara@123", role: "MEMBER", department: "QL" },
  { fullName: "Sneha Iyer",    email: "sneha.iyer@ethara.ai",    password: "Ethara@123", role: "MEMBER", department: "TASKER" },
  { fullName: "Kunal Agarwal", email: "kunal.agarwal@ethara.ai", password: "Ethara@123", role: "MEMBER", department: "SDE" },
  { fullName: "Aditya Singh",  email: "aditya.singh@ethara.ai",  password: "Ethara@123", role: "ADMIN",  department: "PL" },
  { fullName: "Priya Nair",    email: "priya.nair@ethara.ai",    password: "Ethara@123", role: "MEMBER", department: "HR" },
  { fullName: "Rahul Khanna",  email: "rahul.khanna@ethara.ai",  password: "Ethara@123", role: "MEMBER", department: "QR" },
  { fullName: "Ananya Patel",  email: "ananya.patel@ethara.ai",  password: "Ethara@123", role: "MEMBER", department: "QL" },
];

const projects = [
  { name: "Atlas Evaluation Pipeline",   description: "Multilingual annotation evaluation and quality scoring pipeline for Atlas AI models.", color: "#6366f1" },
  { name: "Goku Task Automation",        description: "End-to-end automation of repetitive tasker workflows using AI-driven orchestration.", color: "#10b981" },
  { name: "Kensei QA Operations",        description: "Quality assurance system for Kensei model outputs — edge-case detection and audit trails.", color: "#f59e0b" },
  { name: "Leviathan Research Workflow", description: "Research data collection, annotation management, and synthesis pipeline.", color: "#8b5cf6" },
  { name: "Tesseract Analytics",         description: "Real-time operational analytics dashboard for cross-team productivity tracking.", color: "#ec4899" },
  { name: "Kaiju AI Monitoring",         description: "Live monitoring system for AI model health, drift detection, and incident response.", color: "#ef4444" },
];

// Task templates per project
const taskTemplates = [
  // Atlas
  { title: "Validate multilingual annotations", description: "Cross-check Hindi, Bengali, and Tamil annotation sets for consistency and accuracy.", priority: "HIGH",     status: "IN_PROGRESS", taskType: "ANNOTATION", confidenceScore: 0.92, tags: ["annotation", "QA", "multilingual"] },
  { title: "Prepare Atlas sprint analytics",    description: "Aggregate sprint velocity and quality scores for the Atlas Q2 review.",         priority: "MEDIUM",   status: "TODO",        taskType: "GENERAL", tags: ["analytics", "sprint"] },
  { title: "Review scorer calibration drift",   description: "Detect and correct any calibration drift in the automated QR scorer.",           priority: "CRITICAL", status: "BLOCKED",     taskType: "MODEL_EVAL", confidenceScore: 0.75, tags: ["QR", "calibration"] },
  // Goku
  { title: "Fix task assignment latency",       description: "Investigate and reduce latency in the Goku task distribution pipeline.",        priority: "CRITICAL", status: "IN_PROGRESS", taskType: "INFRA", tags: ["performance", "SDE"] },
  { title: "Automate daily task reporting",     description: "Build automated Slack/email digest for daily task completion summaries.",        priority: "MEDIUM",   status: "TODO",        taskType: "GENERAL", tags: ["automation", "reporting"] },
  // Kensei
  { title: "Review Kaiju edge-case outputs",    description: "Manually audit 200 flagged edge-case outputs from Kaiju v2.3 inference run.",   priority: "HIGH",     status: "IN_REVIEW",   taskType: "PROMPT_QA", reviewerFeedback: "Some outputs are hallucinating facts.", tags: ["QA", "edge-case", "kaiju"] },
  { title: "Audit QR scoring pipeline",         description: "Full pipeline audit for the Kensei QR module — schema, scoring logic, outputs.", priority: "HIGH",    status: "TODO",        taskType: "PROMPT_QA", tags: ["QR", "audit"] },
  // Leviathan
  { title: "Collate research dataset v4",       description: "Merge, deduplicate, and validate the Leviathan research dataset for v4 release.", priority: "MEDIUM",  status: "DONE",        taskType: "DATA_CLEANUP", confidenceScore: 0.98, tags: ["dataset", "research"] },
  { title: "Write annotation guidelines v3",    description: "Update annotation guidelines to reflect new task types in Leviathan workflow.",   priority: "LOW",     status: "DONE",        taskType: "GENERAL", tags: ["docs", "annotation"] },
  // Tesseract
  { title: "Build team productivity Recharts",  description: "Implement animated productivity bar/line charts using Recharts for Tesseract.",  priority: "MEDIUM",   status: "IN_PROGRESS", taskType: "GENERAL", tags: ["frontend", "analytics"] },
  { title: "Add overdue task alerting",         description: "Send automated notifications for tasks approaching or past their due date.",     priority: "HIGH",     status: "TODO",        taskType: "GENERAL", tags: ["notifications", "alerts"] },
  // Kaiju
  { title: "Set up model drift detection",      description: "Integrate a drift detection module that triggers alerts on model degradation.",  priority: "CRITICAL", status: "IN_PROGRESS", taskType: "MODEL_EVAL", tags: ["monitoring", "AI", "kaiju"] },
  { title: "Document incident response runbook","description": "Create a step-by-step runbook for Kaiju AI incident response and escalation.", priority: "MEDIUM",   status: "TODO",        taskType: "GENERAL", tags: ["docs", "incident"] },
];

// ===================== SEED FUNCTION =====================

async function main() {
  console.log("🌱 Starting Ethara Nexus seed...\n");

  // 1. Clear existing data in reverse dependency order
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleared existing data.");

  // 2. Create users with hashed passwords
  const createdUsers = [];
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 12);
    const user = await prisma.user.create({
      data: { fullName: u.fullName, email: u.email, password: hashed, role: u.role, department: u.department },
    });
    createdUsers.push(user);
    console.log(`  👤 Created user: ${user.fullName} (${user.email})`);
  }

  const [pranay, aarav, neha, rohan, sneha, kunal, aditya, priya, rahul, ananya] = createdUsers;

  // 3. Create projects and assign members
  const createdProjects = [];
  const projectMemberMap = [
    { project: projects[0], admin: pranay,  members: [aarav, neha, rohan, rahul] },
    { project: projects[1], admin: aditya,  members: [sneha, kunal, aarav] },
    { project: projects[2], admin: pranay,  members: [neha, rohan, ananya, rahul] },
    { project: projects[3], admin: aditya,  members: [priya, aarav, sneha] },
    { project: projects[4], admin: pranay,  members: [kunal, ananya, rohan] },
    { project: projects[5], admin: aditya,  members: [rahul, neha, aarav, sneha] },
  ];

  for (const pm of projectMemberMap) {
    const project = await prisma.project.create({
      data: {
        ...pm.project,
        members: {
          create: [
            { userId: pm.admin.id, role: "ADMIN" },
            ...pm.members.map((m) => ({ userId: m.id, role: "MEMBER" })),
          ],
        },
      },
    });
    createdProjects.push({ ...project, admin: pm.admin, members: pm.members });
    console.log(`  📁 Created project: ${project.name}`);
  }

  // 4. Create tasks distributed across projects with realistic assignees
  const assigneePool = [aarav, neha, rohan, sneha, kunal, rahul, ananya];
  const dueDates = [
    new Date(Date.now() - 2 * 86400000),  // 2 days ago (overdue)
    new Date(Date.now() + 1 * 86400000),  // tomorrow
    new Date(Date.now() + 3 * 86400000),  // 3 days
    new Date(Date.now() + 7 * 86400000),  // 1 week
    new Date(Date.now() + 14 * 86400000), // 2 weeks
    new Date(Date.now() - 5 * 86400000),  // 5 days ago (overdue)
    new Date(Date.now() + 5 * 86400000),  // 5 days
  ];

  const createdTasks = [];
  for (let i = 0; i < taskTemplates.length; i++) {
    const tmpl = taskTemplates[i];
    const project = createdProjects[i % createdProjects.length];
    const assignee = assigneePool[i % assigneePool.length];
    const creator = project.admin;

    const task = await prisma.task.create({
      data: {
        title: tmpl.title,
        description: tmpl.description,
        priority: tmpl.priority,
        status: tmpl.status,
        taskType: tmpl.taskType || "GENERAL",
        confidenceScore: tmpl.confidenceScore || null,
        reviewerFeedback: tmpl.reviewerFeedback || null,
        tags: tmpl.tags,
        dueDate: dueDates[i % dueDates.length],
        assigneeId: assignee.id,
        creatorId: creator.id,
        projectId: project.id,
      },
    });
    createdTasks.push(task);
    console.log(`  ✅ Task: "${task.title}"`);
  }

  // 5. Add sample comments
  const commentSamples = [
    "Looks good from my end — proceeding with the next batch.",
    "Found 3 inconsistencies in the Bengali set. Will flag them in the tracker.",
    "Latency is down to 120ms from 340ms after the Redis cache fix.",
    "Runbook draft is ready for review. Ping me if you need changes.",
    "Edge cases in set B are tricky. Let's sync on Friday.",
    "Dashboard charts are live in staging. Check the Tesseract branch.",
  ];

  for (let i = 0; i < Math.min(createdTasks.length, commentSamples.length); i++) {
    await prisma.comment.create({
      data: {
        content: commentSamples[i],
        taskId: createdTasks[i].id,
        userId: assigneePool[(i + 1) % assigneePool.length].id,
      },
    });
  }
  console.log("  💬 Added sample comments.");

  // 6. Add activity logs
  const activities = [
    { userId: pranay.id,  projectId: createdProjects[0].id, taskId: createdTasks[0].id, action: `assigned "Validate multilingual annotations" to Aarav Sharma` },
    { userId: neha.id,    projectId: createdProjects[2].id, taskId: createdTasks[5].id, action: `updated "Review Kaiju edge-case outputs" status to IN_REVIEW` },
    { userId: aditya.id,  projectId: createdProjects[1].id, taskId: createdTasks[3].id, action: `marked "Fix task assignment latency" as CRITICAL` },
    { userId: rohan.id,   projectId: createdProjects[2].id, taskId: createdTasks[6].id, action: `started "Audit QR scoring pipeline"` },
    { userId: sneha.id,   projectId: createdProjects[3].id, taskId: createdTasks[7].id, action: `completed "Collate research dataset v4"` },
    { userId: pranay.id,  projectId: createdProjects[4].id, taskId: createdTasks[9].id, action: `created "Build team productivity Recharts"` },
  ];

  for (const log of activities) {
    await prisma.activityLog.create({ data: log });
  }
  console.log("  📋 Added activity logs.");

  // 7. Add notifications
  await prisma.notification.createMany({
    data: [
      { userId: aarav.id,  content: "Pranay assigned you: Validate multilingual annotations", type: "task_assigned", link: `/tasks/${createdTasks[0].id}` },
      { userId: neha.id,   content: "Your task Review Kaiju edge-case outputs is due tomorrow", type: "deadline", link: `/tasks/${createdTasks[5].id}` },
      { userId: rohan.id,  content: "Pranay added you to Atlas Evaluation Pipeline", type: "info" },
      { userId: sneha.id,  content: "Aditya assigned you: Automate daily task reporting", type: "task_assigned", link: `/tasks/${createdTasks[4].id}` },
      { userId: rahul.id,  content: "Set up model drift detection is now CRITICAL priority", type: "info", link: `/tasks/${createdTasks[11].id}` },
    ],
  });
  console.log("  🔔 Added notifications.");

  // 8. Add Library Documents
  await prisma.document.createMany({
    data: [
      { title: "Atlas Annotation Guidelines v4", category: "SOP", content: "### Guidelines\n1. Always verify translation context...\n2. Check tone...", authorId: pranay.id, tags: ["atlas", "guidelines"] },
      { title: "Kensei Client Requirements Q2", category: "REQUIREMENT", content: "Client requested 98% accuracy on edge cases...", authorId: aditya.id, tags: ["kensei", "client"] },
      { title: "Kaiju Drift Detection Paper", category: "RESEARCH", content: "Recent research indicates drift occurs early in conversational AI...", authorId: neha.id, tags: ["kaiju", "research"] },
      { title: "Ethara Security Protocol", category: "SOP", content: "All model exports must be encrypted via AES-256...", authorId: aditya.id, tags: ["security", "infra"] },
      { title: "Multilingual LLM Eval Dataset", category: "RESEARCH", content: "Comparative analysis of Indic language support in Llama-3 vs Claude-3...", authorId: pranay.id, tags: ["research", "multilingual"] },
      { title: "Project Leviathan Deliverables", category: "REQUIREMENT", content: "Q3 Roadmap for Leviathan data ingestion pipeline...", authorId: neha.id, tags: ["leviathan", "roadmap"] },
    ]
  });
  console.log("  📚 Added Knowledge Base Documents.");

  // 9. Add more notifications
  await prisma.notification.createMany({
    data: [
      { userId: pranay.id, content: "Deployment to AWS Tokyo region completed.", type: "completed" },
      { userId: pranay.id, content: "Incident: Goku Latency spike detected (+400ms)", type: "info" },
      { userId: aditya.id, content: "Kensei Audit report is ready for sign-off.", type: "info" },
    ]
  });
  console.log("  🔔 Added more notifications.\n");

  console.log("🎉 Ethara Nexus seed completed successfully!");
  console.log("\n📋 Login credentials (all passwords: Ethara@123):");
  users.forEach((u) => console.log(`   ${u.role === "ADMIN" ? "👑 ADMIN" : "👤 MEMBER"} | ${u.fullName.padEnd(16)} | ${u.email}`));
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

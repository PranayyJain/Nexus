// =============================================================
// ETHARA NEXUS - Prisma Client Singleton
// Ensures only one PrismaClient instance exists in the app
// =============================================================
const { PrismaClient } = require("@prisma/client");

// In development, prevent creating too many connections due to hot-reloading
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

module.exports = prisma;

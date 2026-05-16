-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('ANNOTATION', 'MODEL_EVAL', 'PROMPT_QA', 'DATA_CLEANUP', 'INFRA', 'GENERAL');

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "confidenceScore" DOUBLE PRECISION,
ADD COLUMN     "reviewerFeedback" TEXT,
ADD COLUMN     "taskType" "TaskType" NOT NULL DEFAULT 'GENERAL';

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'SOP',
    "content" TEXT,
    "linkUrl" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "documents_category_idx" ON "documents"("category");

-- CreateIndex
CREATE INDEX "tasks_projectId_status_priority_idx" ON "tasks"("projectId", "status", "priority");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

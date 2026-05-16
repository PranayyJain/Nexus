// =============================================================
// ETHARA NEXUS - Shared Utility Functions
// cn() for merging Tailwind classes, formatting helpers, etc.
// =============================================================
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isPast, isWithinInterval, addDays } from "date-fns";

/**
 * Merge Tailwind classes safely (handles conflicts like 'px-2 px-4' → 'px-4')
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date for display (e.g. "14 May 2026")
 */
export function formatDate(date) {
  if (!date) return "—";
  return format(new Date(date), "d MMM yyyy");
}

/**
 * Relative time from now (e.g. "3 hours ago")
 */
export function timeAgo(date) {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Returns true if the date is in the past and status is not DONE
 */
export function isOverdue(dueDate, status) {
  if (!dueDate || status === "DONE") return false;
  return isPast(new Date(dueDate));
}

/**
 * Returns true if deadline is within 3 days
 */
export function isDueSoon(dueDate, status) {
  if (!dueDate || status === "DONE") return false;
  return isWithinInterval(new Date(dueDate), { start: new Date(), end: addDays(new Date(), 3) });
}

/**
 * Maps task status to Tailwind badge class
 */
export function statusBadgeClass(status) {
  const map = {
    TODO: "badge-todo",
    IN_PROGRESS: "badge-progress",
    IN_REVIEW: "badge-review",
    DONE: "badge-done",
    BLOCKED: "badge-blocked",
  };
  return map[status] || "badge-todo";
}

/**
 * Maps priority to Tailwind badge class
 */
export function priorityBadgeClass(priority) {
  const map = {
    LOW: "badge-low",
    MEDIUM: "badge-medium",
    HIGH: "badge-high",
    CRITICAL: "badge-critical",
  };
  return map[priority] || "badge-medium";
}

/**
 * Formats priority label for display
 */
export function formatStatus(status) {
  const map = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    DONE: "Done",
    BLOCKED: "Blocked",
  };
  return map[status] || status;
}

/**
 * Returns initials from a full name (e.g. "Pranay Jain" → "PJ")
 */
export function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Generates a consistent avatar background color from a name string
 */
export function avatarColor(name = "") {
  const colors = [
    "#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b",
    "#3b82f6", "#ef4444", "#14b8a6", "#f97316", "#06b6d4",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

/**
 * Truncates text to a max length with ellipsis
 */
export function truncate(str, max = 60) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
}

// =============================================================
// ETHARA NEXUS - Badge Component
// Status and priority indicator pills
// =============================================================
import { cn, statusBadgeClass, priorityBadgeClass, formatStatus } from "../../lib/utils";
import { AlertCircle, Clock, CheckCircle2, Circle, PauseCircle } from "lucide-react";

const STATUS_ICONS = {
  TODO: Circle,
  IN_PROGRESS: Clock,
  IN_REVIEW: PauseCircle,
  DONE: CheckCircle2,
  BLOCKED: AlertCircle,
};

export function StatusBadge({ status }) {
  const Icon = STATUS_ICONS[status] || Circle;
  return (
    <span className={cn("badge", statusBadgeClass(status))}>
      <Icon className="w-3 h-3" />
      {formatStatus(status)}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={cn("badge", priorityBadgeClass(priority))}>
      {priority === "CRITICAL" && "🔴 "}
      {priority === "HIGH" && "🟠 "}
      {priority}
    </span>
  );
}

/** Generic badge with custom className */
export function Badge({ children, className }) {
  return <span className={cn("badge", className)}>{children}</span>;
}

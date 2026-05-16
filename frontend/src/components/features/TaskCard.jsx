// =============================================================
// ETHARA NEXUS - Task Card Component
// Compact task card for lists and Kanban columns
// =============================================================
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, AlertCircle, Cpu } from "lucide-react";
import { cn, formatDate, isOverdue, isDueSoon } from "../../lib/utils";
import { StatusBadge, PriorityBadge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";

const TaskCard = memo(({ task, dragging = false, onClick }) => {
  const navigate = useNavigate();
  const overdue = isOverdue(task.dueDate, task.status);
  const dueSoon = isDueSoon(task.dueDate, task.status);

  const handleClick = () => {
    if (onClick) onClick(task);
    else navigate(`/tasks/${task.id}`);
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: dragging ? 1 : 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      className={cn(
        "glass-sm p-4 cursor-pointer transition-all duration-200 border-l-[3px]",
        "hover:bg-surface-3 hover:border-accent",
        dragging && "shadow-[4px_4px_0px_rgba(255,69,0,0.5)] rotate-1 opacity-90 border-accent",
        !dragging && task.priority === "CRITICAL" ? "border-l-danger" :
        !dragging && task.priority === "HIGH" ? "border-l-warning" :
        !dragging && task.priority === "MEDIUM" ? "border-l-info" :
        !dragging ? "border-l-slate-600" : ""
      )}
    >
      {/* Type & AI Confidence Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/[0.05]">
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
          // {task.taskType || "GENERAL"}
        </span>
        {task.confidenceScore && (
          <div className="flex items-center gap-1 text-[9px] font-mono font-bold"
               style={{ color: task.confidenceScore < 0.8 ? "#ffae42" : "#39ff14" }}>
            <Cpu className="w-3 h-3" />
            {(task.confidenceScore * 100).toFixed(0)}%
          </div>
        )}
      </div>

      {/* Title */}
      <p className="text-sm font-bold font-mono text-slate-200 leading-snug mb-3 pr-1 uppercase tracking-wider">{task.title}</p>

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-accent/10 text-accent-light border border-accent/20">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Row */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          {/* Due Date */}
          {task.dueDate && (
            <span className={cn(
              "flex items-center gap-1 text-[10px] font-mono font-bold uppercase",
              overdue ? "text-danger" : dueSoon ? "text-warning" : "text-slate-500"
            )}>
              {overdue && <AlertCircle className="w-3 h-3" />}
              <Calendar className="w-3 h-3" />
              {formatDate(task.dueDate)}
            </span>
          )}

          {/* Comment count */}
          {task._count?.comments > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-slate-600">
              <MessageSquare className="w-3 h-3" />
              {task._count.comments}
            </span>
          )}
        </div>

        {/* Assignee */}
        {task.assignee && (
          <Avatar name={task.assignee.fullName} src={task.assignee.avatarUrl} size="xs" />
        )}
      </div>
    </motion.div>
  );
});

export default TaskCard;

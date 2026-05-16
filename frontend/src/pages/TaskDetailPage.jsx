// =============================================================
// ETHARA NEXUS - Task Detail Page
// Full task view: description, comments, activity timeline
// =============================================================
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Trash2, Edit2 } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { StatusBadge, PriorityBadge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import TaskModal from "../components/features/TaskModal";
import { useFetch } from "../hooks/useData";
import { toast } from "../hooks/useToast";
import api from "../lib/api";
import { formatDate, timeAgo } from "../lib/utils";
import useAuthStore from "../store/authStore";

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data, loading, refetch } = useFetch(`/tasks/${taskId}`);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const task = data?.task;

  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/comments/${taskId}`, { content: comment });
      setComment("");
      refetch();
      toast.success("Comment added");
    } catch { toast.error("Failed to add comment"); }
    setSubmitting(false);
  };

  const deleteTask = async () => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Task deleted");
      navigate(-1);
    } catch { toast.error("Failed to delete task"); }
  };

  if (loading) return (
    <AppLayout title="Task Detail">
      <div className="max-w-4xl mx-auto space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
      </div>
    </AppLayout>
  );

  if (!task) return (
    <AppLayout title="Task Not Found">
      <div className="text-center py-20 text-slate-400">Task not found</div>
    </AppLayout>
  );

  return (
    <AppLayout title="Task Detail">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title + Actions */}
            <div className="glass p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="font-display text-xl font-bold text-white leading-snug">{task.title}</h1>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setShowEdit(true)} className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {(task.creatorId === user?.id || user?.role === "ADMIN") && (
                    <button onClick={deleteTask} className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                {task.tags?.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent-light border border-accent/15">{tag}</span>
                ))}
              </div>

              {task.description && (
                <p className="text-slate-300 text-sm leading-relaxed">{task.description}</p>
              )}
            </div>

            {/* Comments */}
            <div className="glass p-6">
              <h3 className="font-semibold text-white mb-4">
                Comments ({task.comments?.length || 0})
              </h3>

              <div className="space-y-4 mb-5">
                {task.comments?.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">No comments yet — be the first!</p>
                )}
                {task.comments?.map((c) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                              className="flex gap-3">
                    <Avatar name={c.user?.fullName} size="sm" className="flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{c.user?.fullName}</span>
                        <span className="text-xs text-slate-600">{timeAgo(c.createdAt)}</span>
                      </div>
                      <div className="glass-sm p-3 text-sm text-slate-300">{c.content}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Comment Input */}
              <form onSubmit={submitComment} className="flex gap-3">
                <Avatar name={user?.fullName} size="sm" className="flex-shrink-0 mt-1" />
                <div className="flex-1 flex gap-2">
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="input flex-1"
                  />
                  <Button type="submit" loading={submitting} icon={Send} className="flex-shrink-0">Send</Button>
                </div>
              </form>
            </div>

            {/* Activity Timeline */}
            {task.activities?.length > 0 && (
              <div className="glass p-6">
                <h3 className="font-semibold text-white mb-4">Activity Timeline</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-white/[0.05]" />
                  <div className="space-y-4">
                    {task.activities.map((a) => (
                      <div key={a.id} className="flex items-start gap-4 relative">
                        <Avatar name={a.user?.fullName} size="xs" className="flex-shrink-0 z-10 ring-2 ring-surface-2" />
                        <div>
                          <p className="text-xs text-slate-300">
                            <span className="font-medium text-white">{a.user?.fullName}</span>{" "}{a.action}
                          </p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{timeAgo(a.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Task Meta */}
          <div className="space-y-4">
            <div className="glass p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Details</h3>

              <div>
                <p className="text-xs text-slate-500 mb-1">Project</p>
                <p className="text-sm text-white font-medium">{task.project?.name}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Assignee</p>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar name={task.assignee.fullName} size="sm" />
                    <div>
                      <p className="text-sm text-white">{task.assignee.fullName}</p>
                      <p className="text-xs text-slate-500">{task.assignee.department}</p>
                    </div>
                  </div>
                ) : <p className="text-sm text-slate-500">Unassigned</p>}
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Created By</p>
                <p className="text-sm text-white">{task.creator?.fullName}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Due Date</p>
                <p className="text-sm text-white">{formatDate(task.dueDate)}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Created</p>
                <p className="text-sm text-slate-400">{timeAgo(task.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSuccess={refetch}
        projectId={task.project?.id}
        task={task}
        members={[]}
      />
    </AppLayout>
  );
}

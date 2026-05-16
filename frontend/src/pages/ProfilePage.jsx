// =============================================================
// ETHARA NEXUS - Profile Page
// Displays user stats, assigned tasks, and project contributions
// =============================================================
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckSquare, FolderKanban, MessageSquare, TrendingUp } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { Avatar } from "../components/ui/Avatar";
import { StatusBadge, PriorityBadge } from "../components/ui/Badge";
import { useFetch } from "../hooks/useData";
import useAuthStore from "../store/authStore";
import { formatDate } from "../lib/utils";

const DEPT_COLORS = { SDE:"#6366f1", QR:"#10b981", QL:"#f59e0b", TASKER:"#ec4899", TPM:"#8b5cf6", HR:"#3b82f6", PL:"#ef4444" };

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: me } = useAuthStore();
  const targetId = userId || me?.id;

  const { data, loading } = useFetch(targetId ? `/users/${targetId}` : null);
  const user = data?.user;
  const stats = data?.stats;

  if (loading) return (
    <AppLayout title="Profile">
      <div className="max-w-4xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
    </AppLayout>
  );

  if (!user) return (
    <AppLayout title="Profile">
      <div className="text-center py-20 text-slate-400">User not found</div>
    </AppLayout>
  );

  const completionRate = stats?.totalAssigned > 0
    ? Math.round((stats.doneTasks / stats.totalAssigned) * 100) : 0;

  return (
    <AppLayout title="Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 flex items-start gap-6">
          <Avatar name={user.fullName} size="xl" />
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">{user.fullName}</h2>
                <p className="text-slate-400 mt-0.5">{user.email}</p>
                <div className="flex items-center gap-2 mt-3">
                  {user.department && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{ backgroundColor: (DEPT_COLORS[user.department] || "#6366f1") + "20",
                                   color: DEPT_COLORS[user.department] || "#6366f1",
                                   border: `1px solid ${DEPT_COLORS[user.department] || "#6366f1"}40` }}>
                      {user.department}
                    </span>
                  )}
                  <span className={`text-xs px-3 py-1 rounded-full font-medium
                    ${user.role === "ADMIN" ? "bg-accent/15 text-accent-light border border-accent/25" : "bg-surface-3 text-slate-400"}`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: CheckSquare,   label: "Assigned Tasks",  value: user._count?.assignedTasks || 0, color: "#6366f1" },
            { icon: TrendingUp,    label: "Tasks Done",      value: stats?.doneTasks || 0,           color: "#10b981" },
            { icon: FolderKanban,  label: "Projects",        value: user.projectMemberships?.length || 0, color: "#f59e0b" },
            { icon: MessageSquare, label: "Comments",        value: user._count?.comments || 0,      color: "#ec4899" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: s.color + "20" }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-display font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Completion Rate */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="glass p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Task Completion Rate</h3>
            <span className="text-2xl font-display font-bold text-success">{completionRate}%</span>
          </div>
          <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-success to-success/70 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">{stats?.doneTasks} of {stats?.totalAssigned} tasks completed</p>
        </motion.div>

        {/* Assigned Tasks + Projects grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Assigned Tasks */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="glass p-5">
            <h3 className="font-semibold text-white mb-4">Assigned Tasks</h3>
            <div className="space-y-3">
              {user.assignedTasks?.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No assigned tasks</p>
              )}
              {user.assignedTasks?.map((t) => (
                <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{t.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{t.project?.name} · {formatDate(t.dueDate)}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Projects */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                      className="glass p-5">
            <h3 className="font-semibold text-white mb-4">Projects</h3>
            <div className="space-y-3">
              {user.projectMemberships?.map((m) => (
                <div key={m.project?.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <div className="w-8 h-8 rounded-xl flex-shrink-0"
                       style={{ backgroundColor: (m.project?.color || "#6366f1") + "25" }}>
                    <FolderKanban className="w-4 h-4 m-2" style={{ color: m.project?.color || "#6366f1" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{m.project?.name}</p>
                    <p className="text-xs text-slate-600">{m.project?._count?.tasks || 0} tasks</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full
                    ${m.role === "ADMIN" ? "bg-accent/15 text-accent-light" : "bg-surface-3 text-slate-500"}`}>
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}

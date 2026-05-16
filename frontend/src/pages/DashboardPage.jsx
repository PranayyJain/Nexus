// =============================================================
// ETHARA NEXUS - Dashboard Page
// Animated analytics hub with charts, stats, and activity feed
// =============================================================
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  FolderKanban, CheckSquare, AlertCircle, TrendingUp,
  Clock, ArrowRight, Activity, Terminal
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { StatCardSkeleton } from "../components/ui/Skeleton";
import { StatusBadge, PriorityBadge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { useDashboard, useWeeklyStats, useTeamPerformance } from "../hooks/useData";
import { formatDate, timeAgo, formatStatus } from "../lib/utils";
import useAuthStore from "../store/authStore";

// Recharts custom tooltip (Brutalist style)
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-2 border border-white/[0.15] p-3 text-xs font-mono uppercase tracking-wider">
      <p className="text-slate-400 mb-2 border-b border-white/[0.15] pb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const STATUS_COLORS = {
  TODO: "#64748b", IN_PROGRESS: "#3b82f6",
  IN_REVIEW: "#f59e0b", DONE: "#10b981", BLOCKED: "#ef4444",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: overview, loading: overviewLoading } = useDashboard();
  const { data: weeklyData } = useWeeklyStats();
  const { data: teamData } = useTeamPerformance();

  // Extract actual stats from the API response wrapper
  const stats = overview?.data;

  // Build pie chart data from status map
  const pieData = stats?.tasksByStatus
    ? Object.entries(stats.tasksByStatus).map(([status, count]) => ({
        name: status, value: count, color: STATUS_COLORS[status] || "#6366f1",
      }))
    : [];

  // Build pie chart data from type map
  const TYPE_COLORS = {
    ANNOTATION: "#ff4500", MODEL_EVAL: "#00f0ff", PROMPT_QA: "#39ff14",
    DATA_CLEANUP: "#ffae42", INFRA: "#ff003c", GENERAL: "#6366f1"
  };
  const typePieData = stats?.tasksByType
    ? Object.entries(stats.tasksByType).map(([type, count]) => ({
        name: type, value: count, color: TYPE_COLORS[type] || "#6366f1",
      }))
    : [];

  const StatCard = ({ icon: Icon, label, value, sub, color, loading }) => (
    <motion.div {...fadeUp()} className="stat-card">
      {loading ? <StatCardSkeleton /> : (
        <>
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 flex items-center justify-center border border-white/[0.15] bg-surface-1">
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-mono font-bold text-primary mt-2">{value ?? "—"}</p>
            <p className="text-sm font-mono text-secondary uppercase tracking-widest mt-1">{label}</p>
          </div>
          {sub && <p className="text-xs font-mono text-muted">{sub}</p>}
        </>
      )}
    </motion.div>
  );

  return (
    <AppLayout title="Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="grid lg:grid-cols-3 gap-5 items-start">
          <motion.div {...fadeUp()} className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-primary tracking-tight">
              Welcome back, <span className="text-accent">{user?.fullName?.split(" ")[0]}</span>
            </h2>
            <p className="text-muted text-xs font-medium uppercase tracking-widest mt-1">
              System Status: <span className="text-success font-bold">Operational</span> • All services active
            </p>
          </motion.div>
          
          <motion.div {...fadeUp(0.1)} className="glass p-4 border-l-4 border-l-accent flex gap-3">
            <Terminal className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Operations Summary</p>
              <p className="text-xs text-secondary leading-relaxed">
                {overviewLoading ? "Analyzing data..." : stats?.aiInsights || "Your projects are progressing on schedule. No critical bottlenecks detected."}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FolderKanban} label="Projects"  value={stats?.totalProjects}  color="#ff4500" loading={overviewLoading} />
          <StatCard icon={CheckSquare}  label="Tasks"     value={stats?.totalTasks}      color="#00f0ff" loading={overviewLoading} />
          <StatCard icon={AlertCircle}  label="Overdue"   value={stats?.overdueTasks}    color="#ff003c" loading={overviewLoading} />
          <StatCard icon={TrendingUp}   label="Done" value={stats?.tasksByStatus?.DONE || 0} color="#39ff14" loading={overviewLoading} />
        </div>

        {/* ── CHARTS SECTION ── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Velocity Line Chart */}
          <motion.div {...fadeUp(0.1)} className="glass p-5">
            <h3 className="section-title mb-5">Project Velocity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyData?.data || []}>
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: "monospace", color: "#a1a1aa", textTransform: "uppercase" }} />
                <Line type="monotone" dataKey="created"   stroke="#ff4500" strokeWidth={2} dot={false} name="Created" />
                <Line type="monotone" dataKey="completed" stroke="#39ff14" strokeWidth={2} dot={false} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Distribution Pie Chart */}
          <motion.div {...fadeUp(0.2)} className="glass p-5">
            <h3 className="section-title mb-5">Task Distribution</h3>
            <div className="h-[200px] relative">
              {typePieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={typePieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                         paddingAngle={2} dataKey="value" stroke="none">
                      {typePieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center border border-white/[0.05] bg-white/[0.02]">
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">No_Type_Data_Found</p>
                </div>
              )}
            </div>
            <div className="space-y-1.5 mt-2">
              {typePieData.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2" style={{ backgroundColor: p.color }} />
                    <span className="text-slate-400 uppercase">{p.name}</span>
                  </div>
                  <span className="text-white font-bold">{p.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── TEAM PERFORMANCE STATUS BOARD ── */}
        <motion.div {...fadeUp(0.2)} className="glass p-5">
          <h3 className="section-title mb-5">Team Performance Overview</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart 
              layout="vertical"
              data={(teamData?.data || []).map(m => ({ ...m, remaining: Math.max(0, m.totalTasks - m.doneTasks) }))} 
              margin={{ left: 40, right: 40 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="fullName" 
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                axisLine={false} 
                tickLine={false} 
                width={80}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 10, fontFamily: "monospace", color: "#a1a1aa", textTransform: "uppercase", paddingBottom: 20 }} />
              
              <Bar dataKey="doneTasks" stackId="a" name="Completed" fill="#39ff14" barSize={12} radius={0} />
              <Bar dataKey="remaining" stackId="a" name="Remaining" fill="#1a1a1a" barSize={12} radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── BOTTOM ROW: My Tasks + Activity + Deadlines ── */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* My Tasks */}
          <motion.div {...fadeUp(0.25)} className="glass p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">My Tasks</h3>
              <Link to="/tasks" className="text-xs text-accent-light hover:text-white flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {(stats?.myTasks || []).length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No pending tasks 🎉</p>
              )}
              {(stats?.myTasks || []).map((t) => (
                <Link key={t.id} to={`/tasks/${t.id}`}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                       style={{ backgroundColor: STATUS_COLORS[t.status] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{t.title}</p>
                    <p className="text-xs text-slate-600">{t.project?.name}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div {...fadeUp(0.3)} className="glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-accent" />
              <h3 className="section-title">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {(stats?.recentActivities || []).map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <Avatar name={a.user?.fullName} size="xs" className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 leading-snug">
                      <span className="text-white font-medium">{a.user?.fullName}</span>{" "}
                      {a.action}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{timeAgo(a.createdAt)}</p>
                  </div>
                </div>
              ))}
              {!stats?.recentActivities?.length && (
                <p className="text-slate-500 text-sm text-center py-4">No recent activity</p>
              )}
            </div>
          </motion.div>

          {/* Upcoming Deadlines */}
          <motion.div {...fadeUp(0.35)} className="glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-warning" />
              <h3 className="section-title">Upcoming Deadlines</h3>
            </div>
            <div className="space-y-3">
              {(stats?.upcomingDeadlines || []).map((t) => (
                <Link key={t.id} to={`/tasks/${t.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{t.title}</p>
                    <p className="text-xs text-warning">{formatDate(t.dueDate)}</p>
                  </div>
                  {t.assignee && <Avatar name={t.assignee.fullName} size="xs" />}
                </Link>
              ))}
              {!stats?.upcomingDeadlines?.length && (
                <p className="text-slate-500 text-sm text-center py-4">No upcoming deadlines 🎉</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

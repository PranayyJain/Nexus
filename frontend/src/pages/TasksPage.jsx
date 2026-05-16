// =============================================================
// ETHARA NEXUS - Tasks Page
// Filterable task list with smart filters and search
// =============================================================
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, X, AlertCircle } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import TaskCard from "../components/features/TaskCard";
import TaskModal from "../components/features/TaskModal";
import { Button } from "../components/ui/Button";
import { TaskRowSkeleton } from "../components/ui/Skeleton";
import { useTasks, useProjects } from "../hooks/useData";
import { useNavigate } from "react-router-dom";

const STATUSES  = ["TODO","IN_PROGRESS","IN_REVIEW","DONE","BLOCKED"];
const PRIORITIES = ["LOW","MEDIUM","HIGH","CRITICAL"];

export default function TasksPage() {
  const navigate = useNavigate();
  const [search, setSearch]       = useState("");
  const [status, setStatus]       = useState("");
  const [priority, setPriority]   = useState("");
  const [overdue, setOverdue]     = useState(false);
  const [projectId, setProjectId] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const { data: tasksData, loading, refetch } = useTasks({
    search: search || undefined,
    status: status || undefined,
    priority: priority || undefined,
    overdue: overdue ? "true" : undefined,
    projectId: projectId || undefined,
  });
  const { data: projectsData } = useProjects();
  const tasks    = tasksData?.tasks    || [];
  const projects = projectsData?.projects || [];

  const hasFilters = search || status || priority || overdue || projectId;
  const clearFilters = () => { setSearch(""); setStatus(""); setPriority(""); setOverdue(false); setProjectId(""); };

  return (
    <AppLayout title="Tasks">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-white">All Tasks</h2>
            <p className="text-slate-400 text-sm mt-0.5">{tasks.length} task{tasks.length !== 1 ? "s" : ""} found</p>
          </div>
          <Button icon={Plus} onClick={() => setShowCreate(true)}>New Task</Button>
        </div>

        {/* Filter Bar */}
        <div className="glass p-4 mb-5 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="input pl-9 py-2"
            />
          </div>

          {/* Status filter */}
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-auto py-2">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
          </select>

          {/* Priority filter */}
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input w-auto py-2">
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Project filter */}
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="input w-auto py-2">
            <option value="">All Projects</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          {/* Overdue toggle */}
          <button
            onClick={() => setOverdue(!overdue)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
              ${overdue ? "bg-danger/15 text-danger border border-danger/25" : "bg-surface-3 text-slate-400 border border-white/[0.06] hover:text-white"}`}
          >
            <AlertCircle className="w-4 h-4" />
            Overdue
          </button>

          {/* Clear */}
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Task List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <TaskRowSkeleton key={i} />)}
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass p-16 text-center">
            <Filter className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">No tasks found</p>
            <p className="text-slate-400 text-sm">
              {hasFilters ? "Try adjusting your filters" : "Create your first task to get started"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            <AnimatePresence>
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <TaskCard task={task} onClick={() => navigate(`/tasks/${task.id}`)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={refetch}
        projectId={projectId || projects[0]?.id}
        members={[]}
      />
    </AppLayout>
  );
}

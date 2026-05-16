// =============================================================
// ETHARA NEXUS - Project Detail Page
// Shows project info, members, and links to Kanban board
// =============================================================
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Kanban, UserPlus, Trash2, Users, CheckSquare, ArrowRight } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { Avatar } from "../components/ui/Avatar";
import { StatusBadge, PriorityBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { useProject } from "../hooks/useData";
import { toast } from "../hooks/useToast";
import api from "../lib/api";
import { formatDate, timeAgo } from "../lib/utils";
import useAuthStore from "../store/authStore";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const { user } = useAuthStore();
  const { data, loading, refetch } = useProject(projectId);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const project = data?.project;
  const myMembership = project?.members?.find((m) => m.userId === user?.id);
  const isAdmin = myMembership?.role === "ADMIN" || user?.role === "ADMIN";

  const inviteMember = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      await api.post(`/projects/${projectId}/members`, { email: inviteEmail });
      toast.success("Member invited!");
      setInviteEmail("");
      setShowInvite(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Invite failed");
    }
    setInviting(false);
  };

  const removeMember = async (memberId, name) => {
    if (!window.confirm(`Remove ${name} from this project?`)) return;
    try {
      await api.delete(`/projects/${projectId}/members/${memberId}`);
      toast.success(`${name} removed`);
      refetch();
    } catch { toast.error("Failed to remove member"); }
  };

  if (loading) return (
    <AppLayout title="Project">
      <div className="max-w-5xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
    </AppLayout>
  );

  if (!project) return (
    <AppLayout title="Project Not Found">
      <div className="text-center py-20 text-slate-400">Project not found</div>
    </AppLayout>
  );

  return (
    <AppLayout title={project.name}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-7">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                   style={{ backgroundColor: (project.color || "#6366f1") + "25",
                            border: `1px solid ${project.color || "#6366f1"}40` }}>
                <span className="text-2xl">📁</span>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-white">{project.name}</h2>
                {project.description && (
                  <p className="text-slate-400 text-sm mt-1 max-w-lg">{project.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5" /> {project._count?.tasks || 0} tasks</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {project.members?.length || 0} members</span>
                  <span>Created {timeAgo(project.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <Button variant="ghost" icon={UserPlus} onClick={() => setShowInvite(true)}>Invite</Button>
              )}
              <Link to={`/projects/${projectId}/kanban`} className="btn-primary">
                <Kanban className="w-4 h-4" /> Open Kanban <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Members */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                      className="glass p-5">
            <h3 className="font-semibold text-white mb-4">Members ({project.members?.length})</h3>
            <div className="space-y-3">
              {project.members?.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <Avatar name={m.user?.fullName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{m.user?.fullName}</p>
                    <p className="text-xs text-slate-500">{m.user?.department} · {m.role}</p>
                  </div>
                  {isAdmin && m.userId !== user?.id && (
                    <button onClick={() => removeMember(m.userId, m.user?.fullName)}
                            className="text-slate-600 hover:text-danger transition-colors p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Tasks */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                      className="glass p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Recent Tasks</h3>
              <Link to={`/projects/${projectId}/kanban`} className="text-xs text-accent-light hover:text-white flex items-center gap-1">
                View Kanban <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {project.tasks?.slice(0, 6).map((t) => (
                <Link key={t.id} to={`/tasks/${t.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{t.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {t.dueDate && <p className="text-xs text-slate-600">{formatDate(t.dueDate)}</p>}
                    </div>
                  </div>
                  <StatusBadge status={t.status} />
                  {t.assignee && <Avatar name={t.assignee.fullName} size="xs" />}
                </Link>
              ))}
              {!project.tasks?.length && (
                <p className="text-slate-500 text-sm text-center py-4">No tasks yet</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Invite Team Member">
        <form onSubmit={inviteMember} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
            <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                   type="email" placeholder="colleague@ethara.ai" className="input" required />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button type="submit" loading={inviting} icon={UserPlus}>Send Invite</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}

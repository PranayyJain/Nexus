// =============================================================
// ETHARA NEXUS - Projects Page
// Grid of project cards with create modal
// =============================================================
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, FolderKanban, Users, CheckSquare, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppLayout from "../components/layout/AppLayout";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { AvatarGroup } from "../components/ui/Avatar";
import { ProjectCardSkeleton } from "../components/ui/Skeleton";
import { useProjects } from "../hooks/useData";
import { toast } from "../hooks/useToast";
import api from "../lib/api";
import { timeAgo } from "../lib/utils";

const PROJECT_COLORS = ["#6366f1","#10b981","#f59e0b","#8b5cf6","#ec4899","#ef4444","#3b82f6","#14b8a6"];

const projectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  color: z.string().default("#6366f1"),
});

export default function ProjectsPage() {
  const { data, loading, refetch } = useProjects();
  const [showCreate, setShowCreate] = useState(false);
  const projects = data?.projects || [];

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { color: "#6366f1" },
  });
  const selectedColor = watch("color");

  const onSubmit = async (formData) => {
    try {
      await api.post("/projects", formData);
      toast.success("Project created!");
      reset();
      setShowCreate(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <AppLayout title="Projects">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-white">All Projects</h2>
            <p className="text-slate-400 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? "s" : ""} you're a member of</p>
          </div>
          <Button onClick={() => setShowCreate(true)} icon={Plus}>New Project</Button>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="glass p-16 text-center">
            <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">No projects yet</p>
            <p className="text-slate-400 text-sm mb-6">Create your first project to get started</p>
            <Button onClick={() => setShowCreate(true)} icon={Plus}>Create Project</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/projects/${p.id}`} className="glass p-6 flex flex-col gap-4 glass-hover block group">
                  {/* Color bar + icon */}
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                         style={{ backgroundColor: (p.color || "#6366f1") + "25", border: `1px solid ${p.color || "#6366f1"}40` }}>
                      <FolderKanban className="w-5 h-5" style={{ color: p.color || "#6366f1" }} />
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent transition-colors" />
                  </div>

                  {/* Name + description */}
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-accent-light transition-colors">{p.name}</h3>
                    {p.description && (
                      <p className="text-slate-400 text-sm mt-1 line-clamp-2">{p.description}</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5" /> {p._count?.tasks || 0} tasks
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> {p.members?.length || 0} members
                    </span>
                  </div>

                  {/* Members + time */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                    <AvatarGroup users={p.members?.map((m) => m.user) || []} max={4} size="xs" />
                    <span className="text-xs text-slate-600">{timeAgo(p.createdAt)}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Project">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Project Name *</label>
            <input {...register("name")} placeholder="e.g. Atlas Evaluation Pipeline" className="input" />
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea {...register("description")} rows={3} placeholder="What is this project about?" className="input resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Accent Color</label>
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setValue("color", c)}
                        className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                        style={{ backgroundColor: c, outline: selectedColor === c ? `2px solid ${c}` : "none", outlineOffset: 2 }} />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Create Project</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}

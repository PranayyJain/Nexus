// =============================================================
// ETHARA NEXUS - Create / Edit Task Modal
// React Hook Form + Zod validation for task management
// =============================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import api from "../../lib/api";
import { toast } from "../../hooks/useToast";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"]),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
  tags: z.string().optional(), // comma-separated, parsed before submit
});

export default function TaskModal({ isOpen, onClose, onSuccess, projectId, task, members = [] }) {
  const isEditing = !!task;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "", description: "", priority: "MEDIUM",
      status: "TODO", dueDate: "", assigneeId: "", tags: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (task) {
      reset({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "MEDIUM",
        status: task.status || "TODO",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
        assigneeId: task.assigneeId || "",
        tags: task.tags?.join(", ") || "",
      });
    } else {
      reset({ title: "", description: "", priority: "MEDIUM", status: "TODO", dueDate: "", assigneeId: "", tags: "" });
    }
  }, [task, isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        projectId,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        assigneeId: data.assigneeId || null,
        dueDate: data.dueDate || null,
      };

      if (isEditing) {
        await api.put(`/tasks/${task.id}`, payload);
        toast.success("Task updated successfully!");
      } else {
        await api.post("/tasks", payload);
        toast.success("Task created successfully!");
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save task");
    }
  };

  const Label = ({ children, error }) => (
    <label className="block text-xs font-medium text-slate-400 mb-1.5">
      {children}
      {error && <span className="text-danger ml-2 font-normal">{error}</span>}
    </label>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Task" : "Create New Task"} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <Label error={errors.title?.message}>Title *</Label>
          <input {...register("title")} placeholder="e.g. Validate multilingual annotations"
                 className={cn("input", errors.title && "border-danger/50 focus:ring-danger/50")} />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <textarea {...register("description")} rows={3}
                    placeholder="Add more context about this task..."
                    className="input resize-none" />
        </div>

        {/* Priority + Status row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Priority</Label>
            <select {...register("priority")} className="input">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div>
            <Label>Status</Label>
            <select {...register("status")} className="input">
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
        </div>

        {/* Due Date + Assignee row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Due Date</Label>
            <input {...register("dueDate")} type="date" className="input" />
          </div>
          <div>
            <Label>Assignee</Label>
            <select {...register("assigneeId")} className="input">
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.user?.id || m.id} value={m.user?.id || m.id}>
                  {m.user?.fullName || m.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label>Tags (comma separated)</Label>
          <input {...register("tags")} placeholder="e.g. annotation, QA, sprint"
                 className="input" />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>
            {isEditing ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

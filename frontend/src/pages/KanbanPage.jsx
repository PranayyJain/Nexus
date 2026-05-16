// =============================================================
// ETHARA NEXUS - Kanban Board Page
// Full drag-and-drop board using @dnd-kit
// =============================================================
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import TaskCard from "../components/features/TaskCard";
import TaskModal from "../components/features/TaskModal";
import { Button } from "../components/ui/Button";
import { useTasks, useProject } from "../hooks/useData";
import { toast } from "../hooks/useToast";
import api from "../lib/api";
import { formatStatus } from "../lib/utils";

// Status columns in order
const COLUMNS = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"];

const COLUMN_STYLES = {
  TODO:        { border: "border-slate-700/50", header: "text-slate-400", dot: "bg-slate-500" },
  IN_PROGRESS: { border: "border-info/20",      header: "text-info",      dot: "bg-info" },
  IN_REVIEW:   { border: "border-warning/20",   header: "text-warning",   dot: "bg-warning" },
  DONE:        { border: "border-success/20",   header: "text-success",   dot: "bg-success" },
  BLOCKED:     { border: "border-danger/20",    header: "text-danger",    dot: "bg-danger" },
};

// Sortable task wrapper
function SortableTaskCard({ task, members, onRefresh }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div {...attributes} {...listeners}
           className="absolute left-1 top-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab z-10">
        <GripVertical className="w-3.5 h-3.5 text-slate-600" />
      </div>
      <TaskCard task={task} />
    </div>
  );
}

export default function KanbanPage() {
  const { projectId } = useParams();
  const { data: projectData } = useProject(projectId);
  const { data: tasksData, refetch } = useTasks({ projectId });

  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createStatus, setCreateStatus] = useState("TODO");

  const project = projectData?.project;
  const members = project?.members || [];

  useEffect(() => {
    if (tasksData?.tasks) setTasks(tasksData.tasks);
  }, [tasksData]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  const handleDragStart = (event) => {
    setActiveTask(tasks.find((t) => t.id === event.active.id));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const draggedTask = tasks.find((t) => t.id === active.id);
    const newStatus = over.id; // column id is the status

    if (!draggedTask || draggedTask.status === newStatus) return;
    if (!COLUMNS.includes(newStatus)) return;

    // Optimistic update
    setTasks((prev) => prev.map((t) => t.id === draggedTask.id ? { ...t, status: newStatus } : t));

    try {
      await api.put(`/tasks/${draggedTask.id}`, { status: newStatus });
      toast.success(`Moved to ${formatStatus(newStatus)}`);
      refetch();
    } catch {
      toast.error("Failed to update task status");
      refetch(); // revert
    }
  };

  return (
    <AppLayout title={project?.name ? `${project.name} — Kanban` : "Kanban Board"}>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-shrink-0">
          <div>
            <h2 className="font-display font-bold text-white">{project?.name || "Loading..."}</h2>
            <p className="text-slate-400 text-sm">{tasks.length} tasks across {COLUMNS.length} columns</p>
          </div>
          <Button icon={Plus} onClick={() => { setCreateStatus("TODO"); setShowCreate(true); }}>
            Add Task
          </Button>
        </div>

        {/* Board */}
        <DndContext sensors={sensors} collisionDetection={closestCorners}
                    onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 flex-1 no-scrollbar">
            {COLUMNS.map((status) => {
              const colTasks = getTasksByStatus(status);
              const style = COLUMN_STYLES[status];

              return (
                <div key={status} id={status}
                     className={`flex-shrink-0 w-72 flex flex-col bg-surface-2/40 rounded-2xl border ${style.border} overflow-hidden`}>
                  {/* Column header */}
                  <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span className={`text-sm font-medium ${style.header}`}>{formatStatus(status)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 bg-surface-3 px-2 py-0.5 rounded-full">
                        {colTasks.length}
                      </span>
                      <button
                        onClick={() => { setCreateStatus(status); setShowCreate(true); }}
                        className="text-slate-600 hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Drop zone + cards */}
                  <SortableContext items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    <div id={status} className="flex-1 p-3 space-y-2 overflow-y-auto min-h-[60px]">
                      {colTasks.map((task) => (
                        <SortableTaskCard key={task.id} task={task} members={members} onRefresh={refetch} />
                      ))}
                      {colTasks.length === 0 && (
                        <div className="h-16 rounded-xl border-2 border-dashed border-white/[0.05]
                                        flex items-center justify-center">
                          <p className="text-xs text-slate-700">Drop tasks here</p>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>

          {/* Drag overlay */}
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} dragging />}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Create task modal */}
      <TaskModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={refetch}
        projectId={projectId}
        members={members}
        task={{ status: createStatus }}
      />
    </AppLayout>
  );
}

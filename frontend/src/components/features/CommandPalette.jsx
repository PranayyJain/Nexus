// =============================================================
// ETHARA NEXUS - Command Palette
// AI-style quick search modal (⌘K) for tasks and projects
// =============================================================
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, FolderKanban, CheckSquare, Users, X, ArrowRight } from "lucide-react";
import api from "../../lib/api";
import { cn, truncate } from "../../lib/utils";
import { StatusBadge } from "../ui/Badge";

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ tasks: [], projects: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults({ tasks: [], projects: [] });
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keyboard shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : null; // toggle handled from parent
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults({ tasks: [], projects: [] }); return; }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          api.get("/tasks", { params: { search: query } }),
          api.get("/projects"),
        ]);

        const filteredProjects = (projectsRes.data.projects || []).filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );

        setResults({
          tasks: (tasksRes.data.tasks || []).slice(0, 5),
          projects: filteredProjects.slice(0, 4),
        });
      } catch (_) {}
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const goTo = (path) => { navigate(path); onClose(); };
  const hasResults = results.tasks.length > 0 || results.projects.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-xl glass overflow-hidden z-10"
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks, projects, people..."
                className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none"
              />
              {loading && (
                <div className="w-4 h-4 border-2 border-accent/40 border-t-accent rounded-full animate-spin" />
              )}
              <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {!query && (
                <div className="p-8 text-center text-slate-500 text-sm">
                  <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p>Type to search tasks, projects, and team members</p>
                </div>
              )}

              {query && !hasResults && !loading && (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No results found for "<span className="text-white">{query}</span>"
                </div>
              )}

              {/* Projects */}
              {results.projects.length > 0 && (
                <div className="p-2">
                  <p className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Projects</p>
                  {results.projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => goTo(`/projects/${p.id}`)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.05] text-left transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                           style={{ backgroundColor: p.color + "33" }}>
                        <FolderKanban className="w-4 h-4" style={{ color: p.color }} />
                      </div>
                      <span className="text-sm text-slate-300 group-hover:text-white flex-1">{p.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div className="p-2 border-t border-white/[0.04]">
                  <p className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tasks</p>
                  {results.tasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => goTo(`/tasks/${t.id}`)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.05] text-left transition-colors group"
                    >
                      <CheckSquare className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300 group-hover:text-white truncate">{t.title}</p>
                        <p className="text-xs text-slate-600">{t.project?.name}</p>
                      </div>
                      <StatusBadge status={t.status} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-white/[0.04] flex gap-4 text-xs text-slate-600">
              <span><kbd className="font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="font-mono">↵</kbd> open</span>
              <span><kbd className="font-mono">Esc</kbd> close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

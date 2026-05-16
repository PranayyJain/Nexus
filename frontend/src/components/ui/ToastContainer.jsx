// =============================================================
// ETHARA NEXUS - Toast Renderer
// Renders the global toast notification stack
// =============================================================
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "../../lib/utils";
import useToastStore from "../../hooks/useToast";

const ICONS = {
  success: { Icon: CheckCircle2, color: "text-success" },
  error:   { Icon: XCircle,      color: "text-danger" },
  info:    { Icon: Info,         color: "text-info" },
  warning: { Icon: AlertTriangle, color: "text-warning" },
};

const BORDER = {
  success: "border-success/20",
  error:   "border-danger/20",
  info:    "border-info/20",
  warning: "border-warning/20",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const { Icon, color } = ICONS[t.type] || ICONS.info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "glass-sm border flex items-start gap-3 px-4 py-3 min-w-[280px] max-w-sm pointer-events-auto",
                BORDER[t.type]
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", color)} />
              <p className="text-sm text-slate-200 flex-1">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-500 hover:text-white transition-colors ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

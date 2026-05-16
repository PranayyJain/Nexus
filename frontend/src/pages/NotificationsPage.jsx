// =============================================================
// ETHARA NEXUS - Notifications Page
// =============================================================
import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { Button } from "../components/ui/Button";
import { useNotifications } from "../hooks/useData";
import { toast } from "../hooks/useToast";
import api from "../lib/api";
import { timeAgo, cn } from "../lib/utils";

const TYPE_COLORS = {
  task_assigned: "bg-accent/15 text-accent-light border-accent/20",
  deadline:      "bg-warning/15 text-warning border-warning/20",
  completed:     "bg-success/15 text-success border-success/20",
  info:          "bg-surface-3 text-slate-400 border-white/[0.06]",
};

export default function NotificationsPage() {
  const { data, refetch } = useNotifications();
  const notifications = data?.notifications || [];

  const markAll = async () => {
    try {
      await api.patch("/notifications/read-all");
      toast.success("All notifications marked as read");
      refetch();
    } catch { toast.error("Failed to mark notifications"); }
  };

  return (
    <AppLayout title="Notifications">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Notifications</h2>
            <p className="text-slate-400 text-sm mt-0.5">{data?.unreadCount || 0} unread</p>
          </div>
          {(data?.unreadCount || 0) > 0 && (
            <Button variant="ghost" icon={CheckCheck} onClick={markAll}>Mark all read</Button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.length === 0 && (
            <div className="glass p-16 text-center">
              <Bell className="w-10 h-10 text-slate-600 mx-auto mb-4" />
              <p className="text-white font-medium">You're all caught up!</p>
              <p className="text-slate-400 text-sm mt-1">No notifications to show</p>
            </div>
          )}

          {notifications.map((n, i) => (
            <motion.div key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn("glass-sm p-4 flex items-start gap-3 border transition-all",
                n.isRead ? "opacity-60" : "border-accent/10 bg-accent/5")}
            >
              <span className={cn("text-[10px] font-medium px-2 py-1 rounded-full border flex-shrink-0 mt-0.5", TYPE_COLORS[n.type] || TYPE_COLORS.info)}>
                {n.type?.replace("_", " ") || "info"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200">{n.content}</p>
                <p className="text-xs text-slate-500 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.isRead && <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />}
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

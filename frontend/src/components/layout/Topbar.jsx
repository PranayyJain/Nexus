// =============================================================
// ETHARA NEXUS - Top Navigation Bar
// Search trigger, notifications bell, user avatar
// =============================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { useNotifications } from "../../hooks/useData";
import useAuthStore from "../../store/authStore";
import { cn } from "../../lib/utils";
import CommandPalette from "../features/CommandPalette";

export default function Topbar({ title }) {
  const { user } = useAuthStore();
  const { data } = useNotifications();
  const unreadCount = data?.unreadCount || 0;
  const [cmdOpen, setCmdOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6
                         border-b border-white/[0.05] bg-surface-1/60 backdrop-blur-xl
                         sticky top-0 z-30">
        {/* Left: Page Title */}
        <h1 className="font-display text-lg font-semibold text-white">{title}</h1>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setCmdOpen(true)}
            className="flex items-center gap-2 bg-surface-3/60 hover:bg-surface-3
                       border border-white/[0.06] rounded-xl px-3 py-2
                       text-slate-400 hover:text-white text-sm transition-all duration-200"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:block">Quick search...</span>
            <kbd className="hidden sm:block text-xs bg-surface-4/60 border border-white/[0.08]
                           px-1.5 py-0.5 rounded text-slate-500 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => navigate("/notifications")}
            className={cn(
              "relative p-2 rounded-xl transition-all duration-200",
              "text-slate-400 hover:text-white hover:bg-white/[0.06]"
            )}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
            )}
          </button>

          {/* User Avatar */}
          <button onClick={() => navigate("/profile")} className="flex-shrink-0">
            <Avatar name={user?.fullName} size="sm" className="ring-2 ring-accent/30 hover:ring-accent/60 transition-all" />
          </button>
        </div>
      </header>

      {/* Command Palette */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
}

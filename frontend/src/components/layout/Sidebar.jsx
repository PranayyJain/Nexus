// =============================================================
// ETHARA NEXUS - Sidebar Navigation
// Floating dark glass sidebar with animated nav items
// =============================================================
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  Bell, Settings, LogOut, Zap, ChevronRight, BookOpen
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";
import useAuthStore from "../../store/authStore";

const NAV_ITEMS = [
  { to: "/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { to: "/projects",     icon: FolderKanban,    label: "Projects" },
  { to: "/tasks",        icon: CheckSquare,     label: "Tasks" },
  { to: "/team",         icon: Users,           label: "Team" },
  { to: "/library",      icon: BookOpen,        label: "Knowledge Base" },
  { to: "/notifications",icon: Bell,            label: "Notifications" },
];

const BOTTOM_ITEMS = [
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed left-0 top-0 h-screen w-64 z-40 flex flex-col
                 bg-surface-1/90 backdrop-blur-md border-r border-white/[0.15]"
    >
      {/* ── Brand ── */}
      <div className="px-5 pt-6 pb-4 border-b border-white/[0.15]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-accent
                          flex items-center justify-center border border-accent-light shadow-[4px_4px_0px_var(--accent-glow)]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-primary text-base tracking-widest uppercase leading-none">
              ETHARA
            </p>
            <p className="text-[10px] text-muted font-bold tracking-widest uppercase leading-none mt-1">
              Project Hub
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn("nav-item group", isActive && "active")
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-accent" : "text-muted group-hover:text-primary")} />
                <span className="flex-1 uppercase tracking-wider">{label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-accent" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom: Settings + User ── */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/[0.15] pt-3">
        {BOTTOM_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn("nav-item", isActive && "active")}
          >
            <Icon className="w-4 h-4 text-muted" />
            {label}
          </NavLink>
        ))}

        {/* User profile strip */}
        <NavLink to="/profile" className={({ isActive }) => cn("nav-item mt-2", isActive && "active")}>
          <Avatar name={user?.fullName} size="sm" />
          <div className="flex flex-col min-w-0">
            <span className="text-primary text-sm font-medium truncate leading-none">{user?.fullName}</span>
            <span className="text-muted text-xs truncate leading-none mt-0.5">{user?.department || user?.role}</span>
          </div>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="nav-item w-full text-left text-danger/80 hover:text-danger hover:bg-danger/10"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </motion.aside>
  );
}

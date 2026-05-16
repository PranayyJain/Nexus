// =============================================================
// ETHARA NEXUS - Team Members Page
// Lists all users with their department and task stats
// =============================================================
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { Avatar } from "../components/ui/Avatar";
import { useFetch } from "../hooks/useData";

export default function TeamPage() {
  const [search, setSearch] = useState("");
  const { data, loading } = useFetch("/users", { search: search || undefined });
  const users = data?.users || [];

  const DEPT_COLORS = { SDE:"#6366f1", QR:"#10b981", QL:"#f59e0b", TASKER:"#ec4899", TPM:"#8b5cf6", HR:"#3b82f6", PL:"#ef4444" };

  return (
    <AppLayout title="Team">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Team Members</h2>
            <p className="text-slate-400 text-sm mt-0.5">{users.length} members on Ethara Nexus</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
                   placeholder="Search members..." className="input pl-9 py-2 w-56" />
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass p-5 flex items-center gap-4">
                <div className="skeleton w-11 h-11 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-32" />
                  <div className="skeleton h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="glass p-16 text-center">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <p className="text-white font-medium">No members found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u, i) => (
              <motion.div key={u.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/profile/${u.id}`} className="glass p-5 flex items-center gap-4 glass-hover block group">
                  <Avatar name={u.fullName} src={u.avatarUrl} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white group-hover:text-accent-light transition-colors truncate">{u.fullName}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {u.department && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: (DEPT_COLORS[u.department] || "#6366f1") + "20",
                                       color: DEPT_COLORS[u.department] || "#6366f1" }}>
                          {u.department}
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                        ${u.role === "ADMIN" ? "bg-accent/15 text-accent-light" : "bg-surface-3 text-slate-400"}`}>
                        {u.role}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

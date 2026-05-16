// =============================================================
// ETHARA NEXUS - Zustand Auth Store
// Global auth state management with localStorage persistence
// =============================================================
import { create } from "zustand";

const useAuthStore = create((set) => ({
  // ── State ──
  user: JSON.parse(localStorage.getItem("en_user") || "null"),
  token: localStorage.getItem("en_token") || null,
  isAuthenticated: !!localStorage.getItem("en_token"),

  // ── Actions ──

  /** Called after successful login/signup */
  setAuth: (user, token) => {
    localStorage.setItem("en_token", token);
    localStorage.setItem("en_user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  /** Update user profile info in state and storage */
  updateUser: (updatedUser) => {
    const merged = { ...JSON.parse(localStorage.getItem("en_user") || "{}"), ...updatedUser };
    localStorage.setItem("en_user", JSON.stringify(merged));
    set({ user: merged });
  },

  /** Called on logout */
  logout: () => {
    localStorage.removeItem("en_token");
    localStorage.removeItem("en_user");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;

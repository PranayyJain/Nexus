// =============================================================
// ETHARA NEXUS - Toast Notification System
// Simple toast queue using Zustand
// =============================================================
import { create } from "zustand";

let toastId = 0;

const useToastStore = create((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = ++toastId;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// Helper functions to trigger toasts from anywhere
export const toast = {
  success: (message) => useToastStore.getState().addToast({ type: "success", message }),
  error: (message) => useToastStore.getState().addToast({ type: "error", message }),
  info: (message) => useToastStore.getState().addToast({ type: "info", message }),
  warning: (message) => useToastStore.getState().addToast({ type: "warning", message }),
};

export default useToastStore;

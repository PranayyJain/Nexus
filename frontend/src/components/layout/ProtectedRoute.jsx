// =============================================================
// ETHARA NEXUS - Protected Route Guard
// Redirects unauthenticated users to /login
// =============================================================
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

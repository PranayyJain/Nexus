// =============================================================
// ETHARA NEXUS - Root App with React Router
// Defines all routes and wraps the app in global providers
// =============================================================
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layout
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Public pages
import LandingPage     from "./pages/LandingPage";
import LoginPage       from "./pages/LoginPage";
import SignupPage      from "./pages/SignupPage";

// Protected pages
import DashboardPage      from "./pages/DashboardPage";
import ProjectsPage       from "./pages/ProjectsPage";
import ProjectDetailPage  from "./pages/ProjectDetailPage";
import KanbanPage         from "./pages/KanbanPage";
import TasksPage          from "./pages/TasksPage";
import TaskDetailPage     from "./pages/TaskDetailPage";
import TeamPage           from "./pages/TeamPage";
import ProfilePage        from "./pages/ProfilePage";
import NotificationsPage  from "./pages/NotificationsPage";
import SettingsPage       from "./pages/SettingsPage";
import LibraryPage        from "./pages/LibraryPage";

// Global UI
import { ToastContainer } from "./components/ui/ToastContainer";

export default function App() {
  return (
    <BrowserRouter>
      {/* Global toast notifications */}
      <ToastContainer />

      <AnimatePresence mode="wait">
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/"       element={<LandingPage />} />
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ── Protected Routes ── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"                        element={<DashboardPage />} />
            <Route path="/projects"                         element={<ProjectsPage />} />
            <Route path="/projects/:projectId"              element={<ProjectDetailPage />} />
            <Route path="/projects/:projectId/kanban"       element={<KanbanPage />} />
            <Route path="/tasks"                            element={<TasksPage />} />
            <Route path="/tasks/:taskId"                    element={<TaskDetailPage />} />
            <Route path="/team"                             element={<TeamPage />} />
            <Route path="/library"                          element={<LibraryPage />} />
            <Route path="/profile"                          element={<ProfilePage />} />
            <Route path="/profile/:userId"                  element={<ProfilePage />} />
            <Route path="/notifications"                    element={<NotificationsPage />} />
            <Route path="/settings"                         element={<SettingsPage />} />
          </Route>

          {/* ── Fallback: redirect unknown routes ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

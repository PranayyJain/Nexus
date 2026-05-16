// =============================================================
// ETHARA NEXUS - App Shell Layout
// Wraps all authenticated pages with sidebar + topbar
// =============================================================
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children, title = "Ethara Nexus" }) {
  return (
    <div className="min-h-screen bg-surface flex relative">
      <div className="bg-grid-pattern" />
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main content area — offset by sidebar width */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <Topbar title={title} />

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

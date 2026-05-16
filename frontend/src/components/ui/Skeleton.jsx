// =============================================================
// ETHARA NEXUS - Skeleton Loader Components
// Placeholder shimmer blocks shown while data is loading
// =============================================================
import { cn } from "../../lib/utils";

/** Generic skeleton block */
export function Skeleton({ className }) {
  return <div className={cn("skeleton", className)} />;
}

/** Skeleton for a stat card */
export function StatCardSkeleton() {
  return (
    <div className="glass p-5 flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

/** Skeleton for a task row */
export function TaskRowSkeleton() {
  return (
    <div className="glass-sm p-4 flex items-center gap-4">
      <Skeleton className="h-4 w-4 rounded" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}

/** Skeleton for project cards */
export function ProjectCardSkeleton() {
  return (
    <div className="glass p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

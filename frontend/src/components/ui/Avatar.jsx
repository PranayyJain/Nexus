// =============================================================
// ETHARA NEXUS - Avatar Component
// Displays user avatar with fallback initials and color
// =============================================================
import { getInitials, avatarColor, cn } from "../../lib/utils";

const sizes = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
  xl: "w-14 h-14 text-lg",
};

export function Avatar({ name = "", src, size = "md", className }) {
  const sizeClass = sizes[size] || sizes.md;
  const bg = avatarColor(name);
  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover flex-shrink-0", sizeClass, className)}
      />
    );
  }

  return (
    <div
      className={cn("rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0", sizeClass, className)}
      style={{ backgroundColor: bg }}
      title={name}
    >
      {initials}
    </div>
  );
}

/** Stacked avatar group — shows up to `max` avatars then "+N" */
export function AvatarGroup({ users = [], max = 3, size = "sm" }) {
  const shown = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {shown.map((u, i) => (
        <div key={u.id || i} className="ring-2 ring-surface-2 rounded-full" title={u.fullName}>
          <Avatar name={u.fullName} src={u.avatarUrl} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            "rounded-full bg-surface-4 ring-2 ring-surface-2 flex items-center justify-center text-slate-400 font-medium",
            sizes[size]
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

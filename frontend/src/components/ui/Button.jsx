// =============================================================
// ETHARA NEXUS - Button Component
// Variant-based button with loading and icon support
// =============================================================
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  danger: "btn-danger",
  link: "text-accent hover:text-accent-light underline-offset-4 hover:underline text-sm font-medium transition-colors",
};

export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className,
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={cn(variants[variant], "select-none", (loading || disabled) && "opacity-60 cursor-not-allowed pointer-events-none", className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}

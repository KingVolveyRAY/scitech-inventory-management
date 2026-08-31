import { designSystem } from "@/lib/design-system";
import { cn } from "@/lib/utils/cn";

export function AppLogo({ 
  className, 
  onlyIcon = false,
  iconSize = "h-10 w-10"
}: { 
  className?: string; 
  onlyIcon?: boolean;
  iconSize?: string;
}) {
  return (
    <div className={cn("flex items-center", !onlyIcon && "gap-3", className)}>
      <div className={cn("relative shrink-0", iconSize)}>
        <img
          src="/new-logo.jpg"
          alt={designSystem.appName}
          className="block h-full w-full rounded-lg object-contain"
        />
      </div>
      {!onlyIcon && (
        <div>
          <p className="text-sm font-semibold text-slate-900">{designSystem.appName}</p>
          <p className="text-xs text-slate-500">Sistem Inventori Manajemen Scitech</p>
        </div>
      )}
    </div>
  );
}

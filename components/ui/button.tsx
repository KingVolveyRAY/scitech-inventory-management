import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils/cn";

const variants = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-sm shadow-indigo-600/20",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-[0.98]",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  destructive: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]"
} as const;

const sizes = {
  md: "h-11 sm:h-12 px-5 text-sm font-semibold",
  sm: "h-9 px-3.5 text-xs font-semibold",
  icon: "h-11 w-11"
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, asChild = false, variant = "primary", size = "md", ...props },
  ref
) {
  const baseClasses = "inline-flex items-center justify-center rounded-2xl border border-transparent transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 disabled:pointer-events-none disabled:opacity-50";

  if (asChild) {
    return (
      <Slot
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      type={props.type ?? "button"}
      {...props}
    />
  );
});

Button.displayName = "Button";

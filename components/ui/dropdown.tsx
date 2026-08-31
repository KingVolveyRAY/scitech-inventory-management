"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils/cn";

export const Dropdown = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;

export function DropdownContent({ className, ...props }: DropdownMenu.DropdownMenuContentProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        sideOffset={8}
        className={cn("z-50 min-w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-subtle", className)}
        {...props}
      />
    </DropdownMenu.Portal>
  );
}

export function DropdownItem({ className, ...props }: DropdownMenu.DropdownMenuItemProps) {
  return (
    <DropdownMenu.Item
      className={cn("flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100", className)}
      {...props}
    />
  );
}

"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils/cn";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: TabsPrimitive.TabsListProps) {
  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-hide">
      <TabsPrimitive.List 
        className={cn("inline-flex min-w-full items-center whitespace-nowrap rounded-xl bg-slate-100 p-1 md:min-w-0", className)} 
        {...props} 
      />
    </div>
  );
}

export function TabsTrigger({ className, ...props }: TabsPrimitive.TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "rounded-lg px-3 py-2 text-sm text-slate-600 transition data-[state=active]:bg-white data-[state=active]:text-indigo-600",
        className
      )}
      {...props}
    />
  );
}

export const TabsContent = TabsPrimitive.Content;

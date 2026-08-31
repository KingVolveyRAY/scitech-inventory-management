"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange
}: {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (value: string) => void;
}) {
  return (
    <div className="max-w-full overflow-x-auto scrollbar-hide py-1">
      <div className="inline-flex items-center gap-1.5 whitespace-nowrap p-1.5 bg-slate-100/70 rounded-full border border-slate-200/60 shadow-inner">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              type="button"
              className={cn(
                "relative h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-semibold transition-all duration-200 rounded-full select-none cursor-pointer focus:outline-none",
                isActive 
                  ? "text-white" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="category-active"
                  className="absolute inset-0 rounded-full bg-indigo-600 shadow-md shadow-indigo-600/20"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

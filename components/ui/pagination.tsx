"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const [jumpValue, setJumpValue] = useState("");

  useEffect(() => {
    setJumpValue("");
  }, [currentPage]);

  if (totalPages <= 1) return null;

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(jumpValue);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
    setJumpValue("");
  };

  const pages = [];
  const delta = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-between gap-6 border-t border-slate-100 py-6 md:flex-row", className)}>
      <div className="flex items-center gap-4">
        <div className="text-xs text-slate-500 md:text-sm">
          Halaman <span className="font-medium text-slate-900">{currentPage}</span> dari{" "}
          <span className="font-medium text-slate-900">{totalPages}</span>
        </div>
        
        <form onSubmit={handleJump} className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Lompat ke:</span>
          <Input 
            className="h-8 w-14 px-2 text-center text-xs" 
            placeholder="#"
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
          />
        </form>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          size="sm"
          className="h-9 w-9 p-0"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 px-1">
          {pages.map((page, index) => (
            page === "..." ? (
              <div key={`ellipsis-${index}`} className="flex h-9 w-9 items-center justify-center text-slate-400">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "ghost"}
                size="sm"
                className={cn(
                  "h-9 w-9 p-0 text-sm hidden sm:inline-flex",
                  currentPage === page ? "shadow-md shadow-indigo-100" : "text-slate-600 hover:bg-slate-100"
                )}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </Button>
            )
          ))}
          {/* Mobile indicator */}
          <span className="px-2 text-sm font-bold text-indigo-600 sm:hidden">{currentPage}</span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="h-9 w-9 p-0"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

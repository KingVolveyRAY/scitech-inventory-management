"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
  cursorClassName?: string;
}

export function Typewriter({
  text,
  delay = 70,
  className,
  cursorClassName,
}: TypewriterProps) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset if text changes
    setCurrentText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span>{currentText}</span>
      <span
        className={cn(
          "ml-1 inline-block w-[3px] h-[0.7em] bg-indigo-600 animate-pulse transition-opacity duration-300",
          currentIndex === text.length ? "opacity-0" : "opacity-100",
          cursorClassName
        )}
        style={{ animationDuration: "0.8s" }}
      />
    </span>
  );
}

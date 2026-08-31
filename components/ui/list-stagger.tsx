"use client";

import { motion } from "framer-motion";
import { designSystem } from "@/lib/design-system";

export function ListStagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: designSystem.motion.stagger
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function ListStaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0 }
      }}
    >
      {children}
    </motion.div>
  );
}

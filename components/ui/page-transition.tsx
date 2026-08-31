"use client";

import { motion } from "framer-motion";
import { designSystem } from "@/lib/design-system";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}

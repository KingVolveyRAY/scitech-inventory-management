"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ open, onOpenChange, title, description, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={cn(
                  "fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-white/20 bg-white/80 p-8 shadow-sophisticated backdrop-blur-2xl scrollbar-hide",
                  className
                )}
              >
                <div className="mb-8 flex items-start justify-between gap-6">
                  <div>
                    <Dialog.Title className="text-2xl font-black tracking-tight text-slate-900">{title}</Dialog.Title>
                    {description ? (
                      <Dialog.Description className="mt-2 text-sm font-medium text-slate-500">
                        {description}
                      </Dialog.Description>
                    ) : null}
                  </div>
                  <Dialog.Close className="rounded-full bg-slate-100 p-2.5 text-slate-500 transition-all hover:bg-white hover:shadow-sm active:scale-95">
                    <X className="h-5 w-5" />
                  </Dialog.Close>
                </div>
                <div className="relative">
                  {children}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
};

type ToastContextValue = {
  notify: (title: string, description?: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const value = useMemo(
    () => ({
      notify: (title: string, description?: string, type: ToastType = "success") => {
        setItems((current) => [
          ...current,
          { id: Math.random().toString(36).substring(2, 9), title, description, type }
        ]);
      }
    }),
    []
  );

  const removeToast = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right" duration={5000}>
        {children}
        
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <ToastPrimitive.Root
              key={item.id}
              asChild
              onOpenChange={(open) => {
                if (!open) removeToast(item.id);
              }}
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="pointer-events-auto relative flex w-full max-w-sm gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-lg ring-1 ring-slate-900/5"
              >
                <div className="flex-shrink-0">
                  {item.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                  {item.type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                  {item.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
                </div>

                <div className="flex-1">
                  <ToastPrimitive.Title className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </ToastPrimitive.Title>
                  {item.description && (
                    <ToastPrimitive.Description className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {item.description}
                    </ToastPrimitive.Description>
                  )}
                </div>

                <ToastPrimitive.Close className="absolute right-2 top-2 rounded-lg p-1 text-slate-400 opacity-0 transition hover:bg-slate-50 hover:text-slate-900 group-hover:opacity-100 focus:opacity-100">
                  <X className="h-4 w-4" />
                </ToastPrimitive.Close>
              </motion.div>
            </ToastPrimitive.Root>
          ))}
        </AnimatePresence>

        <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] m-0 flex flex-col gap-2 p-6 w-full max-w-[420px] outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

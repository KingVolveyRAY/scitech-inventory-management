"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "destructive" | "primary";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Hapus",
  variant = "destructive",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={onClose} title={title}>
      <div className="flex flex-col gap-4 pt-2">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            variant === "destructive" ? "bg-red-50" : "bg-blue-50"
          }`}>
            <AlertTriangle className={`h-6 w-6 ${
              variant === "destructive" ? "text-red-600" : "text-blue-600"
            }`} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button 
            variant={variant} 
            onClick={onConfirm} 
            disabled={isLoading}
            className="px-6"
          >
            {isLoading ? "Memproses..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

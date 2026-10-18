"use client";

import { X } from "lucide-react";

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 min-h-screen animate-fade-in">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-brand-lg max-w-md w-full p-6 animate-scale-in z-10 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={18} className="text-on-surface-variant" />
        </button>
        <h2 className="font-display text-xl font-bold text-on-surface pr-8 mb-2">
          {title}
        </h2>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
          {message}
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-brand-border bg-white text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-full text-white text-sm font-medium transition-opacity cursor-pointer ${
              danger ? "bg-error hover:opacity-90" : "bg-primary-container hover:opacity-90"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

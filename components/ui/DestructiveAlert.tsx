import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export function DestructiveAlert({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <AlertDialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-xl">
          <AlertDialog.Title className="text-xl font-bold text-destructive mb-2 font-syne">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mb-6 text-white/80 font-geist-mono">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 font-medium font-geist-mono transition">
                {cancelText}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                className="px-4 py-2 rounded-lg bg-destructive text-white font-bold font-geist-mono hover:bg-red-700 transition shadow-md disabled:opacity-60"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? "Deleting..." : confirmText}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
} 
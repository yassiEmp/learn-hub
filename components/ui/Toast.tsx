import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

export function Toast({
  open,
  onOpenChange,
  title,
  description,
  variant = "default",
  duration = 4000,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}) {
  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={duration}>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        className={`fixed bottom-6 right-6 z-[100] w-full max-w-xs rounded-xl shadow-lg border px-6 py-4 font-geist-mono bg-black/90 text-white border-white/10 animate-fade-in ${
          variant === "destructive" ? "bg-destructive text-white border-destructive" : ""
        }`}
      >
        <ToastPrimitive.Title className="font-bold text-lg mb-1 font-syne">
          {title}
        </ToastPrimitive.Title>
        {description && (
          <ToastPrimitive.Description className="text-white/80 text-sm mb-2">
            {description}
          </ToastPrimitive.Description>
        )}
        <ToastPrimitive.Close className="absolute top-2 right-2 text-white/60 hover:text-white font-bold text-lg cursor-pointer">
          ×
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-full z-[101]" />
    </ToastPrimitive.Provider>
  );
} 
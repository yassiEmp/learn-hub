'use client';
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { DestructiveAlert } from "@/components/ui/DestructiveAlert";
import { Toast } from "@/components/ui/Toast";

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const [alertOpen, setAlertOpen] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }>({ open: false, title: "" });
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    if (!user) return;
    const res = await fetch("/api/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    setLoading(false);
    if (res.ok) {
      setToast({
        open: true,
        title: "Account deleted",
        description: "Your account and all data have been deleted.",
        variant: "destructive",
      });
      setTimeout(async () => {
        await signOut();
      }, 1200);
    } else {
      setToast({
        open: true,
        title: "Failed to delete account",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
    setAlertOpen(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black w-screen h-screen top-0 left-0" />
      <motion.div
        className="relative w-full max-w-xl p-8 bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 text-white z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-3xl font-bold mb-4 font-syne">Account Management</h1>
        <p className="mb-8 text-base text-white/70 font-geist-mono">
          Delete your account and all associated data. This action is <span className="text-destructive font-bold">irreversible</span>.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="bg-destructive text-white hover:bg-red-700 border-destructive transition-all duration-300 shadow-md hover:scale-105 font-bold"
          onClick={() => setAlertOpen(true)}
        >
          Delete Account
        </Button>
      </motion.div>
      <DestructiveAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        onConfirm={handleDeleteAccount}
        title="Delete your account?"
        description="This will permanently delete your account and all associated data. This action cannot be undone."
        confirmText={loading ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        loading={loading}
      />
      <Toast
        open={toast.open}
        onOpenChange={open => setToast(t => ({ ...t, open }))}
        title={toast.title}
        description={toast.description}
        variant={toast.variant}
      />
    </div>
  );
} 
'use client';
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { DestructiveAlert } from "@/components/ui/DestructiveAlert";
import { Toast } from "@/components/ui/Toast";
import { userApi, handleApiError } from "@/utils/api-client";

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
    
    try {
      await userApi.deleteAccount();
      
      setToast({
        open: true,
        title: "Account deleted",
        description: "Your account and all data have been deleted.",
        variant: "destructive",
      });
      
      setTimeout(async () => {
        await signOut();
      }, 1200);
      
    } catch (error) {
      const errorMessage = handleApiError(error);
      setToast({
        open: true,
        title: "Failed to delete account",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Please log in to view your account.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
            <p className="text-gray-400">Manage your account and preferences</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <p className="text-white">
                    {user.user_metadata?.full_name || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    User ID
                  </label>
                  <p className="text-white font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-red-400">
                Danger Zone
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300 mb-2">
                    Once you delete your account, there is no going back. Please be
                    certain.
                  </p>
                  <Button
                    onClick={() => setAlertOpen(true)}
                    variant="outline"
                    disabled={loading}
                    className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700"
                  >
                    {loading ? "Deleting..." : "Delete Account"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <DestructiveAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your account and remove all your data from our servers."
        onConfirm={handleDeleteAccount}
        confirmText="Delete Account"
        loading={loading}
      />

      <Toast
        open={toast.open}
        onOpenChange={(open) => setToast({ ...toast, open })}
        title={toast.title}
        description={toast.description}
        variant={toast.variant}
      />
    </div>
  );
} 
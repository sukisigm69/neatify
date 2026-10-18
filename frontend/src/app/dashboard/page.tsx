"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { roleHome } from "@/lib/roles";

export default function DashboardPage() {
  const { user, token, loading, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!token || !user) {
      router.replace("/login");
      return;
    }
    router.replace(roleHome(user.roles.name));
  }, [loading, token, user, router]);

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <Loader2 className="animate-spin text-primary-container" size={32} />
    </div>
  );
}

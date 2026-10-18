"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { roleHome } from "@/lib/roles";

export function RoleGuard({ allow, children }: { allow: string[]; children: React.ReactNode }) {
  const { user, token, loading, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (loading) return;
    if (!token || !user) {
      router.replace("/login");
      return;
    }
    if (!allow.includes(user.roles.name)) {
      router.replace(roleHome(user.roles.name));
    }
  }, [loading, token, user, allow, router]);

  if (loading || !user || !allow.includes(user.roles.name)) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-container" size={32} />
      </div>
    );
  }

  return <>{children}</>;
}

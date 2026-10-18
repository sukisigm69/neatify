"use client";

import { useEffect, useState } from "react";
import { api, useAuthStore } from "@/lib/store";
import { RoleGuard } from "@/components/RoleGuard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ShieldAlert, Settings, Key, Activity, Server, Loader2 } from "lucide-react";

const navItems = [
  { label: "Kelola Role", tab: "roles", icon: <Key size={18} /> },
  { label: "Audit Log", tab: "audit", icon: <Activity size={18} /> },
  { label: "Pengaturan", tab: "settings", icon: <Settings size={18} /> },
];

type Stats = {
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  pendingApproval: number;
};

function SuperAdminContent() {
  const [activeTab, setActiveTab] = useState<"roles" | "audit" | "settings">("roles");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [fee, setFee] = useState("3");
  const [environment, setEnvironment] = useState("sandbox");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get("/dashboard/statistics");
        if (res.data.success) setStats(res.data.data);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    const handleTabChange = (event: globalThis.Event) => {
      const tab = (event as CustomEvent<"roles" | "audit" | "settings">).detail;
      if (tab === "roles" || tab === "audit" || tab === "settings") setActiveTab(tab);
    };
    window.addEventListener("dashboard-tab-change", handleTabChange);
    return () => window.removeEventListener("dashboard-tab-change", handleTabChange);
  }, []);

  const saveLocalSettings = () => {
    localStorage.setItem("konsera:platform-settings", JSON.stringify({ fee, environment }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="max-w-[960px]">
      <div className="mb-8">
        <h2 className="font-display text-xl font-bold text-on-surface">Administrasi Sistem</h2>
        <p className="text-sm text-on-surface-variant mt-0.5">Pantau platform dan konfigurasi operasional.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-5"><div className="flex items-center justify-between mb-2"><span className="text-sm text-on-surface-variant">Total User</span><Key size={18} className="text-primary-container" /></div><p className="font-display text-2xl font-bold text-on-surface">{loading ? "..." : stats?.totalUsers ?? 0}</p></div>
        <div className="glass-card rounded-2xl p-5"><div className="flex items-center justify-between mb-2"><span className="text-sm text-on-surface-variant">Status Sistem</span><Server size={18} className="text-emerald-500" /></div><p className="font-display text-2xl font-bold text-emerald-600">Online</p></div>
        <div className="glass-card rounded-2xl p-5"><div className="flex items-center justify-between mb-2"><span className="text-sm text-on-surface-variant">Pending Approval</span><ShieldAlert size={18} className="text-primary-container" /></div><p className="font-display text-2xl font-bold text-on-surface">{loading ? "..." : stats?.pendingApproval ?? 0}</p></div>
      </div>

      <div className="flex border-b border-brand-border mb-6 overflow-x-auto">
        <button onClick={() => setActiveTab("roles")} className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === "roles" ? "border-primary-container text-primary-container" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>Kelola Role</button>
        <button onClick={() => setActiveTab("audit")} className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === "audit" ? "border-primary-container text-primary-container" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>Audit Log</button>
        <button onClick={() => setActiveTab("settings")} className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === "settings" ? "border-primary-container text-primary-container" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>Pengaturan</button>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-16 text-center"><Loader2 className="animate-spin text-primary-container mx-auto mb-3" size={32} /><p className="text-sm text-on-surface-variant">Memuat data...</p></div>
      ) : activeTab === "roles" ? (
        <div className="glass-card rounded-2xl overflow-hidden p-6">
          <h3 className="font-display font-bold text-lg text-on-surface mb-4">Role Platform</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {["USER", "ORGANIZER", "ADMIN", "SUPER_ADMIN"].map((role) => (
              <div key={role} className="rounded-xl border border-brand-border bg-white/60 p-4">
                <p className="text-sm font-bold text-on-surface">{role}</p>
                <p className="text-xs text-on-surface-variant mt-1">Role bawaan sistem. Endpoint tambah admin belum tersedia.</p>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "audit" ? (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg text-on-surface mb-4">Log Aktivitas</h3>
          <div className="text-center py-8"><Activity size={32} className="text-primary-container/30 mx-auto mb-3" /><p className="text-sm text-on-surface-variant">Endpoint audit log belum tersedia. Area ini siap dihubungkan saat API tersedia.</p></div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg text-on-surface mb-6">Konfigurasi Platform</h3>
          <div className="space-y-4 max-w-lg">
            <div><label className="block text-xs font-semibold uppercase text-on-surface-variant mb-1.5">Platform Service Fee (%)</label><input type="number" value={fee} onChange={(e) => setFee(e.target.value)} className="w-full px-4 py-2.5 border border-brand-border rounded-xl text-sm bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" /></div>
            <div><label className="block text-xs font-semibold uppercase text-on-surface-variant mb-1.5">Midtrans Environment</label><select value={environment} onChange={(e) => setEnvironment(e.target.value)} className="w-full px-4 py-2.5 border border-brand-border rounded-xl text-sm bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all cursor-pointer"><option value="sandbox">Sandbox (Testing)</option><option value="production">Production (Live)</option></select></div>
            <button onClick={saveLocalSettings} className="px-6 py-2.5 rounded-xl bg-primary-container text-white text-sm font-semibold hover:bg-brand-primary-dark transition-colors cursor-pointer">Simpan Pengaturan Lokal</button>
            {saved && <p className="text-sm text-emerald-700">Pengaturan disimpan di browser.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SuperAdminDashboard() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <RoleGuard allow={["SUPER_ADMIN"]}>
      <DashboardLayout title="Super Admin Dashboard" subtitle="Super Admin" navItems={navItems}>
        <SuperAdminContent />
      </DashboardLayout>
    </RoleGuard>
  );
}

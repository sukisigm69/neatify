"use client";

import { useEffect, useState } from "react";
import { api, Event, useAuthStore } from "@/lib/store";
import { RoleGuard } from "@/components/RoleGuard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Users, CalendarCheck, AlertTriangle, Check, X, ShieldCheck, Loader2 } from "lucide-react";

const navItems = [
  { label: "Approve Organizer", tab: "organizers", icon: <ShieldCheck size={18} /> },
  { label: "Approve Event", tab: "events", icon: <CalendarCheck size={18} /> },
  { label: "Kelola User", tab: "users", icon: <Users size={18} /> },
];

type Stats = {
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  pendingApproval: number;
};

type PendingOrganizer = {
  id: string;
  org_name: string;
  description: string | null;
  website: string | null;
  users?: { name: string; email: string };
};

function AdminContent() {
  const [activeTab, setActiveTab] = useState<"organizers" | "events" | "users">("organizers");
  const [stats, setStats] = useState<Stats | null>(null);
  const [organizers, setOrganizers] = useState<PendingOrganizer[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const statsRes = await api.get("/dashboard/statistics");
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setLoadError(error.response?.data?.message || "Statistik gagal dimuat.");
    }

    try {
      const organizerRes = await api.get("/organizers/admin/pending", { params: { limit: 50 } });
      if (organizerRes.data.success) setOrganizers(organizerRes.data.data.organizers);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setLoadError((current) => current || error.response?.data?.message || "Organizer pending gagal dimuat.");
    }

    try {
      const eventsRes = await api.get("/events/admin/all", { params: { status: "PENDING_APPROVAL", limit: 50 } });
      if (eventsRes.data.success) setEvents(eventsRes.data.data.events);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setLoadError((current) => current || error.response?.data?.message || "Event pending gagal dimuat.");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleTabChange = (event: globalThis.Event) => {
      const tab = (event as CustomEvent<"organizers" | "events" | "users">).detail;
      if (tab === "organizers" || tab === "events" || tab === "users") setActiveTab(tab);
    };
    window.addEventListener("dashboard-tab-change", handleTabChange);
    return () => window.removeEventListener("dashboard-tab-change", handleTabChange);
  }, []);

  const approveOrganizer = async (id: string, isApproved: boolean) => {
    setBusyId(id);
    try {
      await api.patch(`/organizers/admin/${id}/approval`, { isApproved });
      await loadData();
    } finally {
      setBusyId(null);
    }
  };

  const approveEvent = async (id: string) => {
    setBusyId(id);
    try {
      await api.patch(`/events/${id}/approve`);
      await loadData();
    } finally {
      setBusyId(null);
    }
  };

  const rejectEvent = async (id: string) => {
    setBusyId(id);
    try {
      await api.patch(`/events/${id}/reject`);
      await loadData();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-[1040px]">
      <div className="mb-8">
        <h2 className="font-display text-xl font-bold text-on-surface">Moderasi Platform</h2>
        <p className="text-sm text-on-surface-variant mt-0.5">Approve organizer, review event, dan pantau pengguna.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-5"><div className="flex items-center justify-between mb-2"><span className="text-sm text-on-surface-variant">Menunggu Approval</span><AlertTriangle size={18} className="text-amber-500" /></div><p className="font-display text-2xl font-bold text-on-surface">{(organizers.length + events.length) || stats?.pendingApproval || 0}</p></div>
        <div className="glass-card rounded-2xl p-5"><div className="flex items-center justify-between mb-2"><span className="text-sm text-on-surface-variant">Organizer</span><Users size={18} className="text-primary-container" /></div><p className="font-display text-2xl font-bold text-on-surface">{stats?.totalOrganizers ?? 0}</p></div>
        <div className="glass-card rounded-2xl p-5"><div className="flex items-center justify-between mb-2"><span className="text-sm text-on-surface-variant">Total Event</span><CalendarCheck size={18} className="text-primary-container" /></div><p className="font-display text-2xl font-bold text-on-surface">{stats?.totalEvents ?? 0}</p></div>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {loadError}
        </div>
      )}

      <div className="flex border-b border-brand-border mb-6 overflow-x-auto">
        <button onClick={() => setActiveTab("organizers")} className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === "organizers" ? "border-primary-container text-primary-container" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>Approve Organizer</button>
        <button onClick={() => setActiveTab("events")} className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === "events" ? "border-primary-container text-primary-container" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>Approve Event</button>
        <button onClick={() => setActiveTab("users")} className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === "users" ? "border-primary-container text-primary-container" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>Kelola User</button>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-16 text-center"><Loader2 className="animate-spin text-primary-container mx-auto mb-3" size={32} /><p className="text-sm text-on-surface-variant">Memuat data...</p></div>
      ) : activeTab === "organizers" ? (
        organizers.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center"><ShieldCheck size={32} className="text-primary-container/30 mx-auto mb-3" /><p className="font-display font-semibold text-on-surface mb-1">Tidak ada permintaan</p><p className="text-sm text-on-surface-variant">Semua permintaan organizer sudah diproses</p></div>
        ) : (
          <div className="space-y-3">
            {organizers.map((organizer) => (
              <div key={organizer.id} className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div><h3 className="font-display font-semibold text-on-surface">{organizer.org_name}</h3><p className="text-sm text-on-surface-variant">{organizer.users?.email ?? "Email tidak tersedia"}</p>{organizer.description && <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{organizer.description}</p>}</div>
                <div className="flex gap-2"><button disabled={busyId === organizer.id} onClick={() => approveOrganizer(organizer.id, true)} className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-brand-primary-dark transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"><Check size={14} /> Approve</button><button disabled={busyId === organizer.id} onClick={() => approveOrganizer(organizer.id, false)} className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-600 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"><X size={14} /> Reject</button></div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === "events" ? (
        events.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center"><CalendarCheck size={32} className="text-primary-container/30 mx-auto mb-3" /><p className="font-display font-semibold text-on-surface mb-1">Tidak ada event pending</p><p className="text-sm text-on-surface-variant">Semua event sudah direview</p></div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div><h3 className="font-display font-semibold text-on-surface">{event.title}</h3><p className="text-sm text-on-surface-variant">{event.venues?.name}, {event.venues?.city}</p><p className="text-xs text-on-surface-variant mt-1">{new Date(event.start_date).toLocaleDateString("id-ID")}</p></div>
                <div className="flex gap-2"><button disabled={busyId === event.id} onClick={() => approveEvent(event.id)} className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-brand-primary-dark transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"><Check size={14} /> Publish</button><button disabled={busyId === event.id} onClick={() => rejectEvent(event.id)} className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-600 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"><X size={14} /> Reject</button></div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="glass-card rounded-2xl p-16 text-center"><Users size={32} className="text-primary-container/30 mx-auto mb-3" /><p className="font-display font-semibold text-on-surface mb-1">Total pengguna: {stats?.totalUsers ?? 0}</p><p className="text-sm text-on-surface-variant">Backend user management belum tersedia, jadi halaman ini hanya menampilkan ringkasan.</p></div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <RoleGuard allow={["ADMIN", "SUPER_ADMIN"]}>
      <DashboardLayout title="Admin Dashboard" subtitle="Admin" navItems={navItems}>
        <AdminContent />
      </DashboardLayout>
    </RoleGuard>
  );
}

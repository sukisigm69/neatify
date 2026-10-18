"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, Event, useAuthStore } from "@/lib/store";
import { RoleGuard } from "@/components/RoleGuard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Calendar, Users, DollarSign, QrCode, BarChart3, Plus, Edit, Loader2, Send, Trash2, CheckCircle } from "lucide-react";

const navItems = [
  { label: "Event Saya", tab: "events", icon: <Calendar size={18} /> },
  { label: "Penjualan Tiket", tab: "sales", icon: <BarChart3 size={18} /> },
  { label: "Scan Tiket", tab: "scan", icon: <QrCode size={18} /> },
];

type Summary = {
  totalEvents: number;
  totalTicketsSold: number;
  totalTicketQuota: number;
  publishedEvents: number;
  totalOrders: number;
  isApproved: boolean;
};

function OrganizerContent() {
  const [activeTab, setActiveTab] = useState<"events" | "sales" | "scan">("events");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanCode, setScanCode] = useState("");
  const [scanMessage, setScanMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [summaryRes, eventsRes] = await Promise.all([
        api.get("/organizers/dashboard/summary"),
        api.get("/events/manage/own", { params: { limit: 50 } }),
      ]);
      if (summaryRes.data.success) setSummary(summaryRes.data.data);
      if (eventsRes.data.success) setEvents(eventsRes.data.data.events);
    } catch {
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    const handleTabChange = (event: globalThis.Event) => {
      const tab = (event as CustomEvent<"events" | "sales" | "scan">).detail;
      if (tab === "events" || tab === "sales" || tab === "scan") setActiveTab(tab);
    };
    window.addEventListener("dashboard-tab-change", handleTabChange);
    return () => window.removeEventListener("dashboard-tab-change", handleTabChange);
  }, []);

  const submitEvent = async (id: string) => {
    setBusyId(id);
    try {
      await api.patch(`/events/${id}/submit`);
      await loadDashboard();
    } finally {
      setBusyId(null);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Hapus event ini?")) return;
    setBusyId(id);
    try {
      await api.delete(`/events/${id}`);
      await loadDashboard();
    } finally {
      setBusyId(null);
    }
  };

  const scanTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanMessage(null);
    if (!scanCode.trim()) {
      setScanMessage({ type: "error", text: "Masukkan kode tiket." });
      return;
    }
    try {
      await api.post("/tickets/scan", { qrCode: scanCode.trim() });
      setScanMessage({ type: "success", text: "Tiket valid. Check-in berhasil." });
      setScanCode("");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setScanMessage({ type: "error", text: error.response?.data?.message || "Tiket tidak valid." });
    }
  };

  const soldPercent = summary && summary.totalTicketQuota > 0 ? Math.round((summary.totalTicketsSold / summary.totalTicketQuota) * 100) : 0;

  return (
    <div className="max-w-[1040px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="font-display text-xl font-bold text-on-surface">Kelola Event</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Buat event, submit review, dan validasi tiket.</p>
        </div>
        <Link href="/dashboard/organizer/create-event" className="px-5 py-2.5 rounded-xl bg-primary-container text-white text-sm font-semibold hover:bg-brand-primary-dark transition-colors flex items-center gap-2">
          <Plus size={16} /> Buat Event Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2"><span className="text-sm text-on-surface-variant">Total Event</span><Calendar size={18} className="text-primary-container" /></div>
          <p className="font-display text-2xl font-bold text-on-surface">{summary?.totalEvents ?? 0}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2"><span className="text-sm text-on-surface-variant">Tiket Terjual</span><Users size={18} className="text-primary-container" /></div>
          <p className="font-display text-2xl font-bold text-on-surface">{summary?.totalTicketsSold ?? 0}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2"><span className="text-sm text-on-surface-variant">Order Masuk</span><DollarSign size={18} className="text-primary-container" /></div>
          <p className="font-display text-2xl font-bold text-on-surface">{summary?.totalOrders ?? 0}</p>
        </div>
      </div>

      <div className="flex border-b border-brand-border mb-6 overflow-x-auto">
        <button onClick={() => setActiveTab("events")} className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === "events" ? "border-primary-container text-primary-container" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>Event Saya</button>
        <button onClick={() => setActiveTab("sales")} className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === "sales" ? "border-primary-container text-primary-container" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>Penjualan</button>
        <button onClick={() => setActiveTab("scan")} className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === "scan" ? "border-primary-container text-primary-container" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>Scan Tiket</button>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-16 text-center"><Loader2 className="animate-spin text-primary-container mx-auto mb-3" size={32} /><p className="text-sm text-on-surface-variant">Memuat dashboard...</p></div>
      ) : activeTab === "events" ? (
        events.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            <Calendar size={32} className="text-primary-container/30 mx-auto mb-3" />
            <p className="font-display font-semibold text-on-surface mb-1">Belum ada event</p>
            <p className="text-sm text-on-surface-variant mb-4">Mulai buat event pertamamu</p>
            <Link href="/dashboard/organizer/create-event" className="px-5 py-2 rounded-xl bg-primary-container text-white text-sm font-semibold hover:bg-brand-primary-dark transition-colors inline-flex">Buat Event</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-on-surface">{event.title}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-primary-container/10 text-primary-container text-[10px] font-bold">{event.status}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant">{event.venues?.name}, {event.venues?.city}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{new Date(event.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.status === "DRAFT" && (
                    <button disabled={busyId === event.id} onClick={() => submitEvent(event.id)} className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-brand-primary-dark transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"><Send size={14} /> Submit</button>
                  )}
                  <button className="px-4 py-2 rounded-xl border border-brand-border bg-white/70 text-xs font-semibold text-on-surface flex items-center gap-1.5 cursor-pointer"><Edit size={14} /> Edit</button>
                  <button disabled={busyId === event.id} onClick={() => deleteEvent(event.id)} className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-600 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"><Trash2 size={14} /> Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === "sales" ? (
        <div className="glass-card rounded-2xl p-8">
          <h3 className="font-display font-semibold text-on-surface mb-4">Ringkasan Penjualan</h3>
          <div className="h-3 rounded-full bg-surface-container-low overflow-hidden mb-3"><div className="h-full bg-primary-container" style={{ width: `${soldPercent}%` }} /></div>
          <p className="text-sm text-on-surface-variant">{summary?.totalTicketsSold ?? 0} dari {summary?.totalTicketQuota ?? 0} tiket terjual ({soldPercent}%).</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8">
          <div className="max-w-md mx-auto text-center">
            <QrCode size={40} className="text-primary-container mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-on-surface mb-2">Scanner Tiket QR</h3>
            <p className="text-sm text-on-surface-variant mb-6">Tempel kode QR tiket untuk validasi manual. Kamera bisa ditambahkan saat package scanner dipasang.</p>
            <form onSubmit={scanTicket} className="space-y-3 text-left">
              <input value={scanCode} onChange={(e) => setScanCode(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm" placeholder="Kode QR tiket" />
              <button type="submit" className="w-full px-6 py-2.5 rounded-xl bg-primary-container text-white text-sm font-semibold hover:bg-brand-primary-dark transition-colors cursor-pointer">Validasi Tiket</button>
            </form>
            {scanMessage && <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${scanMessage.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{scanMessage.type === "success" && <CheckCircle size={16} className="inline mr-1" />}{scanMessage.text}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrganizerDashboard() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <RoleGuard allow={["ORGANIZER", "ADMIN", "SUPER_ADMIN"]}>
      <DashboardLayout title="Organizer Dashboard" subtitle="Organizer" navItems={navItems}>
        <OrganizerContent />
      </DashboardLayout>
    </RoleGuard>
  );
}

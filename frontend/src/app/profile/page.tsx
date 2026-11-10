"use client";

import { useEffect, useState, type FormEvent } from "react";
import { api, useAuthStore, useTicketStore, type User as UserData } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EventBannerImage } from "@/components/EventBannerImage";
import { User, Ticket, ShoppingBag, Bell, Shield, Settings, LogOut, CalendarDays, MapPin, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type MenuItem = {
  key: string;
  label: string;
  icon: typeof User;
};

function ProfileForm({ user }: { user: UserData }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    if (name.trim().length < 2) {
      setFeedback({ type: "error", message: "Nama harus terdiri dari minimal 2 karakter." });
      return;
    }
    if (phone && !/^[0-9+()\s-]{7,20}$/.test(phone)) {
      setFeedback({ type: "error", message: "Format nomor telepon tidak valid." });
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.put<{ success: boolean; message?: string; data: UserData }>("/auth/profile", {
        name: name.trim(),
        phone,
      });
      if (res.data.success) {
        useAuthStore.setState({ user: res.data.data });
        setName(res.data.data.name);
        setPhone(res.data.data.phone || "");
        setFeedback({ type: "success", message: "Profil berhasil diperbarui!" });
      } else {
        setFeedback({ type: "error", message: res.data.message || "Gagal memperbarui profil." });
      }
    } catch {
      setFeedback({ type: "error", message: "Profil gagal disimpan. Periksa koneksi, lalu coba lagi." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} aria-busy={isSaving} className="bg-white rounded-xl border border-brand-border p-6 space-y-5">
      <div>
        <label htmlFor="profile-name" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Nama Lengkap</label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
          className="w-full min-h-11 px-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      <div>
        <label htmlFor="profile-email" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Email</label>
        <div className="relative">
          <input
            id="profile-email"
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-surface-container-low text-sm text-on-surface-variant cursor-not-allowed"
          />
          <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        </div>
      </div>

      <div>
        <label htmlFor="profile-phone" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Telepon</label>
        <input
          id="profile-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Masukkan nomor telepon"
          autoComplete="tel"
          maxLength={20}
          className="w-full min-h-11 px-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {feedback && (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          aria-live={feedback.type === "error" ? "assertive" : "polite"}
          className={`p-3 rounded-xl text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="min-h-11 px-8 py-3 rounded-xl bg-primary-container text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}

const menuItems: MenuItem[] = [
  { key: "personal", label: "Info Pribadi", icon: User },
  { key: "tickets", label: "Tiket Saya", icon: Ticket },
  { key: "orders", label: "Pesanan", icon: ShoppingBag },
  { key: "notifications", label: "Notifikasi", icon: Bell },
  { key: "security", label: "Keamanan", icon: Shield },
  { key: "settings", label: "Pengaturan", icon: Settings },
];

export default function ProfilePage() {
  const { user, token, checkAuth, loading: authLoading, logout } = useAuthStore();
  const { tickets, fetchTickets } = useTicketStore();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("personal");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchTickets();
  }, [checkAuth, fetchTickets]);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [authLoading, token, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-[72px]">
          <div className="animate-pulse space-y-4 w-64">
            <div className="h-16 w-16 bg-surface-container rounded-full mx-auto" />
            <div className="h-4 w-3/4 bg-surface-container rounded mx-auto" />
            <div className="h-4 w-1/2 bg-surface-container rounded mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const now = new Date();
  const upcomingTicket = tickets.find((t) => t.startDate && new Date(t.startDate) > now);

  const handleLogout = () => {
    logout();
    router.push("/");
    setShowLogoutDialog(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-10">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-[240px] flex-shrink-0">
              <div className="bg-white rounded-xl border border-brand-border p-5">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mb-3">
                    <span className="text-white text-xl font-bold font-display">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <p className="font-display font-semibold text-on-surface text-sm">{user.name}</p>
                  <p className="text-xs text-on-surface-variant">{user.email}</p>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setActiveMenu(item.key)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-colors cursor-pointer ${
                          isActive
                            ? "bg-primary-container/10 text-primary-container font-medium"
                            : "text-on-surface-variant hover:bg-surface-container-low"
                        }`}
                      >
                        <Icon size={16} />
                        {item.label}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setShowLogoutDialog(true)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-error hover:bg-error-container/30 transition-colors cursor-pointer mt-4"
                  >
                    <LogOut size={16} />
                    Keluar
                  </button>
                </nav>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {activeMenu === "personal" && (
                <>
                  <h2 className="font-display text-xl font-bold text-on-surface mb-6">Info Pribadi</h2>

                  <ProfileForm user={user} />

                  {upcomingTicket && (
                    <div className="mt-6 bg-brand-cream rounded-xl border border-brand-border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden relative flex-shrink-0 bg-primary-container/20">
                        <EventBannerImage
                          src={upcomingTicket.eventBanner}
                          alt={upcomingTicket.event || "Event"}
                          className="h-full w-full object-cover"
                          fallbackClassName="flex h-full w-full items-center justify-center text-primary/30"
                          iconSize={20}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary-container uppercase tracking-wider mb-1">Event Berikutnya</p>
                        <p className="font-display font-semibold text-sm text-on-surface">{upcomingTicket.event}</p>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <CalendarDays size={12} className="text-primary-container" />
                            {upcomingTicket.startDate
                              ? new Date(upcomingTicket.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                              : "-"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-primary-container" />
                            {upcomingTicket.venue || "-"}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/tickets/${upcomingTicket.ticketId}`}
                        className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-medium hover:bg-brand-primary-dark transition-colors flex-shrink-0"
                      >
                        Lihat Tiket
                      </Link>
                    </div>
                  )}
                </>
              )}

              {activeMenu === "tickets" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-on-surface mb-6">Tiket Saya</h2>
                  {tickets.length === 0 ? (
                    <div className="bg-white rounded-xl border border-brand-border p-12 text-center">
                      <Ticket size={32} className="text-primary-container/30 mx-auto mb-3" />
                      <p className="font-display font-semibold text-on-surface mb-1">Belum ada tiket</p>
                      <p className="text-sm text-on-surface-variant mb-6">Pesan konser pertamamu</p>
                      <Link href="/events/search" className="px-5 py-2.5 rounded-xl bg-primary-container text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors">
                        Jelajahi Event
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <div key={ticket.ticketId} className="bg-white rounded-xl border border-brand-border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0">
                              <Ticket size={24} className="text-primary-container" />
                            </div>
                            <div>
                              <p className="font-display font-semibold text-on-surface">{ticket.event || "Tiket Konser"}</p>
                              <p className="text-xs text-on-surface-variant mt-0.5">{ticket.ticketCategory} &middot; {ticket.venue}</p>
                              <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary-container/10 text-primary-container">
                                {ticket.ticketStatus}
                              </span>
                            </div>
                          </div>
                          <Link
                            href={`/tickets/${ticket.ticketId}`}
                            className="px-5 py-2 rounded-xl border border-brand-border hover:bg-surface-container-low text-sm font-medium text-on-surface transition-colors w-full sm:w-auto text-center"
                          >
                            Lihat Detail
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeMenu === "orders" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-on-surface mb-6">Riwayat Pesanan</h2>
                  <div className="bg-white rounded-xl border border-brand-border p-12 text-center">
                    <ShoppingBag size={32} className="text-primary-container/30 mx-auto mb-3" />
                    <p className="font-display font-semibold text-on-surface mb-1">Lihat Riwayat Pesanan</p>
                    <p className="text-sm text-on-surface-variant mb-6">Cek transaksi dan detail invoice</p>
                    <Link href="/orders" className="px-5 py-2.5 rounded-xl bg-primary-container text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors">
                      Ke Halaman Pesanan
                    </Link>
                  </div>
                </div>
              )}

              {activeMenu === "notifications" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-on-surface mb-6">Notifikasi</h2>
                  <div className="bg-white rounded-xl border border-brand-border p-12 text-center">
                    <Bell size={32} className="text-primary-container/30 mx-auto mb-3" />
                    <p className="font-display font-semibold text-on-surface mb-1">Tidak ada notifikasi</p>
                    <p className="text-sm text-on-surface-variant">Kami akan menginformasikan update event dan promo</p>
                  </div>
                </div>
              )}

              {activeMenu === "security" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-on-surface mb-6">Keamanan</h2>
                  <div className="bg-white rounded-xl border border-brand-border p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm text-on-surface mb-1">Password</h3>
                      <p className="text-xs text-on-surface-variant mb-3">Ganti password secara berkala untuk menjaga keamanan akun</p>
                      <Link href="/forgot-password" className="px-4 py-2 rounded-xl border border-brand-border hover:bg-surface-container-low text-xs font-medium text-on-surface transition-colors inline-block">
                        Ganti Password
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeMenu === "settings" && (
                <div>
                  <h2 className="font-display text-xl font-bold text-on-surface mb-6">Pengaturan Akun</h2>
                  <div className="bg-white rounded-xl border border-brand-border p-6 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                      <div>
                        <p className="text-sm font-semibold text-on-surface">Notifikasi Email</p>
                        <p className="text-xs text-on-surface-variant">Terima rekomendasi konser dan promo</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Keluar"
        message="Yakin ingin keluar? Kamu perlu login kembali untuk mengakses akun."
        confirmText="Keluar"
        cancelText="Batal"
        danger
      />
      <Footer />
    </div>
  );
}

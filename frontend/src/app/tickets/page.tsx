"use client";

import { useEffect, useState } from "react";
import { api, useTicketStore, useOrderStore, Order } from "@/lib/store";
import { useAuthStore } from "@/lib/store";
import { TicketCard } from "@/components/TicketCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventBannerImage } from "@/components/EventBannerImage";
import { Ticket, ChevronRight, CalendarDays, MapPin, Clock, Receipt, Loader2 } from "lucide-react";
import Link from "next/link";

type Tab = "upcoming" | "past" | "orders";

export default function MyTicketsPage() {
  const { token, loading: authLoading, checkAuth } = useAuthStore();
  const { tickets, loading, error: ticketsError, fetchTickets } = useTicketStore();
  const { orders, loading: ordersLoading, error: ordersError, fetchOrders } = useOrderStore();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [syncingPayments, setSyncingPayments] = useState(false);
  const [paymentSyncError, setPaymentSyncError] = useState(false);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authLoading || !token) return;

    const loadTicketsAndOrders = async () => {
      await Promise.all([fetchTickets(), fetchOrders()]);

      const pendingOrders = useOrderStore.getState().orders.filter(
        (order) => order.orderStatus === "PENDING" && order.paymentStatus === "PENDING" && order.hasPaymentSession,
      );
      if (pendingOrders.length === 0) return;

      setSyncingPayments(true);
      setPaymentSyncError(false);
      const results = await Promise.allSettled(
        pendingOrders.map((order) => api.post(`/payments/${order.id}/status`)),
      );
      setPaymentSyncError(results.some((result) => result.status === "rejected"));
      await Promise.all([fetchTickets(), fetchOrders()]);
      setSyncingPayments(false);
    };

    void loadTicketsAndOrders();
  }, [authLoading, token, fetchTickets, fetchOrders]);

  const now = new Date();
  const upcoming = tickets.filter((t) => t.startDate && new Date(t.startDate) > now);
  const past = tickets.filter((t) => !t.startDate || new Date(t.startDate) <= now);

  const heroTicket = upcoming[0];
  const moreUpcoming = upcoming.slice(1);

  const tabs: { key: Tab; label: string }[] = [
    { key: "upcoming", label: "Mendatang" },
    { key: "past", label: "Selesai" },
    { key: "orders", label: "Pesanan" },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-[72px]">
          <Loader2 className="animate-spin text-primary-container" size={32} aria-label="Memeriksa sesi login" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 pt-[72px]">
          <div className="w-full max-w-md rounded-xl border border-brand-border bg-brand-surface p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-muted">
              <Ticket className="text-primary-container" size={24} aria-hidden="true" />
            </div>
            <h1 className="font-display text-xl font-bold text-brand-heading">Masuk untuk melihat tiket</h1>
            <p className="mt-2 text-sm text-brand-paragraph">
              Tiket dan riwayat pesanan hanya bisa dilihat setelah kamu masuk ke akun.
            </p>
            <Link
              href="/login?redirect=%2Ftickets"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-container px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container"
            >
              Masuk
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-10">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface mb-6">Tiket Saya</h1>
          {paymentSyncError && (
            <p role="alert" className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Pembayaran beberapa pesanan belum bisa diverifikasi. Muat ulang halaman untuk mencoba lagi.
            </p>
          )}

          <div className="flex gap-2 mb-8">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  tab === t.key
                    ? "bg-primary-container text-white"
                    : "bg-white border border-brand-border text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "upcoming" && (
            <>
              {loading || syncingPayments ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => <SkeletonCard key={i} type="ticket" />)}
                </div>
              ) : ticketsError ? (
                <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                  <p>Tiket gagal dimuat ({ticketsError}). Periksa koneksi atau login, lalu coba lagi.</p>
                  <button
                    type="button"
                    onClick={() => void fetchTickets()}
                    className="min-h-11 rounded-lg border border-rose-300 px-4 font-medium hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                  >
                    Coba lagi
                  </button>
                </div>
              ) : upcoming.length === 0 ? (
                <EmptyState
                  title="Belum ada tiket mendatang"
                  message="Jelajahi event dan pesan tiket konser favoritmu."
                  icon={<Ticket className="text-primary-container" size={24} />}
                />
              ) : (
                <div className="space-y-6">
                  {heroTicket && (
                    <div className="max-w-4xl mx-auto bg-brand-cream rounded-xl overflow-hidden border border-brand-border">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-2/5 h-36 md:h-48 relative shrink-0">
                          <EventBannerImage
                            src={heroTicket.eventBanner}
                            alt={heroTicket.event || "Event"}
                            className="h-full w-full object-cover"
                            fallbackClassName="flex h-full w-full items-center justify-center bg-primary-container/20 text-primary/30"
                            iconSize={40}
                          />
                        </div>
                        <div className="p-4 md:p-5 flex flex-col justify-center flex-1 min-w-0">
                          <p className="text-xs font-semibold text-primary-container uppercase tracking-wider mb-1.5">Event Berikutnya</p>
                          <h2 className="font-display text-lg md:text-xl font-bold text-on-surface mb-2">{heroTicket.event}</h2>
                          {heroTicket.ticketCategory && (
                            <span className="inline-flex w-fit px-3 py-1 rounded-lg bg-primary-container text-white text-xs font-semibold mb-3">
                              {heroTicket.ticketCategory}
                            </span>
                          )}
                          <div className="space-y-1.5 text-sm text-on-surface-variant mb-4">
                            <div className="flex items-center gap-2">
                              <CalendarDays size={14} className="text-primary-container" />
                              {heroTicket.startDate
                                ? new Date(heroTicket.startDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                                : "-"}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-primary-container" />
                              {heroTicket.startDate
                                ? new Date(heroTicket.startDate).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                                : "-"}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-primary-container" />
                              {heroTicket.venue || "-"}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Link href={`/tickets/${heroTicket.ticketId}`} className="px-4 py-2 rounded-lg bg-primary-container text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors">
                              Lihat Tiket
                            </Link>
                            {heroTicket.orderNumber && (
                              <Link href={`/orders/${heroTicket.orderNumber}`} className="px-4 py-2 rounded-lg border border-brand-border text-on-surface text-sm font-medium hover:bg-white transition-colors">
                                Lihat Pesanan
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {moreUpcoming.length > 0 && (
                    <div>
                      <h3 className="font-display text-lg font-semibold text-on-surface mb-4">Tiket Lainnya</h3>
                      <div className="bg-white rounded-xl border border-brand-border divide-y divide-brand-border">
                        {moreUpcoming.map((ticket) => (
                          <Link
                            key={ticket.ticketId}
                            href={`/tickets/${ticket.ticketId}`}
                            className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden relative flex-shrink-0">
                                <EventBannerImage
                                  src={ticket.eventBanner}
                                  alt={ticket.event || "Event"}
                                  className="h-full w-full object-cover"
                                  fallbackClassName="flex h-full w-full items-center justify-center text-primary-container/40"
                                  iconSize={16}
                                />
                              </div>
                              <div>
                                <p className="font-display font-semibold text-sm text-on-surface">{ticket.event}</p>
                                <p className="text-xs text-on-surface-variant">
                                  {ticket.startDate
                                    ? new Date(ticket.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                                    : "-"}{" "}
                                  &middot; {ticket.venue || "-"}
                                </p>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-on-surface-variant group-hover:text-primary-container transition-colors flex-shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {tab === "past" && (
            <>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => <SkeletonCard key={i} type="ticket" />)}
                </div>
              ) : ticketsError ? (
                <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                  <p>Tiket gagal dimuat ({ticketsError}). Periksa koneksi atau login, lalu coba lagi.</p>
                  <button
                    type="button"
                    onClick={() => void fetchTickets()}
                    className="min-h-11 rounded-lg border border-rose-300 px-4 font-medium hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                  >
                    Coba lagi
                  </button>
                </div>
              ) : past.length === 0 ? (
                <EmptyState
                  title="Belum ada tiket selesai"
                  message="Event yang sudah kamu hadiri akan muncul di sini."
                  icon={<Ticket className="text-primary-container" size={24} />}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {past.map((ticket) => (
                    <TicketCard key={ticket.ticketId} ticket={ticket} />
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "orders" && (
            <>
              {ordersLoading || syncingPayments ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map((i) => <SkeletonCard key={i} type="order" />)}
                </div>
              ) : ordersError ? (
                <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                  <p>Pesanan gagal dimuat ({ordersError}). Periksa koneksi atau login, lalu coba lagi.</p>
                  <button
                    type="button"
                    onClick={() => void fetchOrders()}
                    className="min-h-11 rounded-lg border border-rose-300 px-4 font-medium hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                  >
                    Coba lagi
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <EmptyState
                  title="Belum ada pesanan"
                  message="Riwayat pesanan akan muncul setelah kamu membeli tiket."
                  icon={<Receipt className="text-primary-container" size={24} />}
                />
              ) : (
                <div className="space-y-3">
                  {orders.map((order: Order) => (
                    <OrderItem key={order.invoiceNumber} order={order} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function OrderItem({ order }: { order: Order }) {
  const statusColor = (s: string) => {
    switch (s.toUpperCase()) {
      case "PAID":
      case "SETTLEMENT":
      case "SUCCESS":
        return "bg-emerald-500/10 text-emerald-600";
      case "PENDING":
        return "bg-amber-500/10 text-amber-600";
      case "CANCELLED":
      case "FAILED":
      case "EXPIRED":
        return "bg-rose-500/10 text-rose-600";
      default:
        return "bg-slate-500/10 text-slate-600";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-brand-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="font-display font-semibold text-sm text-on-surface">{order.eventSummary}</p>
        <p className="text-xs text-on-surface-variant mt-1">
          {order.invoiceNumber} &middot; {new Date(order.purchaseDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${statusColor(order.paymentStatus)}`}>
            {order.paymentStatus.toUpperCase()}
          </span>
          <span className="text-xs text-on-surface-variant">{order.totalTicket} tiket</span>
        </div>
      </div>
      <div className="text-right">
        <p className="font-display font-bold text-base text-on-surface">Rp {order.grandTotal.toLocaleString("id-ID")}</p>
      </div>
    </div>
  );
}

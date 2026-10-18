"use client";

import { useEffect, useState } from "react";
import { useTicketStore, useOrderStore, Order } from "@/lib/store";
import { TicketCard } from "@/components/TicketCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Ticket, ChevronRight, CalendarDays, MapPin, Clock, Receipt } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Tab = "upcoming" | "past" | "orders";

export default function MyTicketsPage() {
  const { tickets, loading, fetchTickets } = useTicketStore();
  const { orders, loading: ordersLoading, fetchOrders } = useOrderStore();
  const [tab, setTab] = useState<Tab>("upcoming");

  useEffect(() => {
    fetchTickets();
    fetchOrders();
  }, [fetchTickets, fetchOrders]);

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

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-10">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface mb-6">Tiket Saya</h1>

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
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => <SkeletonCard key={i} type="ticket" />)}
                </div>
              ) : upcoming.length === 0 ? (
                <EmptyState
                  title="Belum ada tiket mendatang"
                  message="Jelajahi event dan pesan tiket konser favoritmu."
                  icon={<Ticket className="text-primary-container" size={24} />}
                />
              ) : (
                <div className="space-y-8">
                  {heroTicket && (
                    <div className="bg-brand-cream rounded-xl overflow-hidden border border-brand-border">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 h-56 md:h-auto relative">
                          {heroTicket.eventBanner ? (
                            <Image src={heroTicket.eventBanner} alt={heroTicket.event || ""} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-primary-container/20 flex items-center justify-center">
                              <Ticket size={40} className="text-primary/30" />
                            </div>
                          )}
                        </div>
                        <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                          <p className="text-xs font-semibold text-primary-container uppercase tracking-wider mb-2">Event Berikutnya</p>
                          <h2 className="font-display text-xl md:text-2xl font-bold text-on-surface mb-3">{heroTicket.event}</h2>
                          {heroTicket.ticketCategory && (
                            <span className="inline-flex w-fit px-3 py-1 rounded-lg bg-primary-container text-white text-xs font-semibold mb-4">
                              {heroTicket.ticketCategory}
                            </span>
                          )}
                          <div className="space-y-2 text-sm text-on-surface-variant mb-6">
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
                            <Link href={`/tickets/${heroTicket.ticketId}`} className="px-6 py-2.5 rounded-xl bg-primary-container text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors">
                              Lihat Tiket
                            </Link>
                            {heroTicket.orderNumber && (
                              <Link href={`/orders/${heroTicket.orderNumber}`} className="px-6 py-2.5 rounded-xl border border-brand-border text-on-surface text-sm font-medium hover:bg-white transition-colors">
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
                                {ticket.eventBanner ? (
                                  <Image src={ticket.eventBanner} alt={ticket.event || ""} fill className="object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Ticket size={16} className="text-primary-container/40" />
                                  </div>
                                )}
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
              {ordersLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map((i) => <SkeletonCard key={i} type="order" />)}
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

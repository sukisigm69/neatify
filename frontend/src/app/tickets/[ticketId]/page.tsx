"use client";

import { use, useEffect, useState } from "react";
import { useTicketStore, Ticket } from "@/lib/store";
import { ArrowLeft, CalendarDays, Clock, MapPin, Receipt, User, Mail, Phone, Copy, Check, Download } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventBannerImage } from "@/components/EventBannerImage";
import Image from "next/image";
import Link from "next/link";

export default function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params);
  const { fetchTicketById } = useTicketStore();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTicketById(ticketId).then((data) => {
      setTicket(data);
      setLoading(false);
    });
  }, [ticketId, fetchTicketById]);

  useEffect(() => {
    if (!ticket || new URLSearchParams(window.location.search).get("print") !== "1") {
      return;
    }

    const timeoutId = window.setTimeout(() => window.print(), 500);
    return () => window.clearTimeout(timeoutId);
  }, [ticket]);

  const copyId = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(ticket.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-[72px]">
          <div className="animate-pulse space-y-4 w-full max-w-lg px-4">
            <div className="h-48 bg-surface-container rounded-lg" />
            <div className="h-6 w-2/3 bg-surface-container rounded" />
            <div className="h-4 w-1/2 bg-surface-container rounded" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-[72px]">
          <div className="text-center">
            <p className="text-on-surface font-semibold mb-4">Ticket not found</p>
            <Link href="/tickets" className="px-5 py-2.5 rounded-full bg-primary-container text-white text-sm font-medium">
              Back to Tickets
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
      <style jsx global>{`
        @media print {
          @page {
            margin: 12mm;
          }

          html,
          body {
            min-height: 0 !important;
            background: #fff !important;
          }

          body * {
            visibility: hidden !important;
          }

          .ticket-print-card,
          .ticket-print-card * {
            visibility: visible !important;
          }

          .ticket-print-action {
            display: none !important;
          }

          .ticket-print-card {
            position: absolute !important;
            top: 0 !important;
            left: 50% !important;
            width: min(100%, 520px) !important;
            max-width: 520px !important;
            overflow: visible !important;
            box-shadow: none !important;
            transform: translateX(-50%) !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
      <div className="ticket-print-action"><Navbar /></div>
      <main className="flex-1 pt-[72px]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-10">
          <Link href="/tickets" className="ticket-print-action inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6">
            <ArrowLeft size={16} />
            Back to My Tickets
          </Link>

          <div className="max-w-xl mx-auto">
            <div className="ticket-print-card bg-white rounded-lg border border-brand-border overflow-hidden relative ticket-perforation" style={{ "--perf-y": "62%" } as React.CSSProperties}>
              <div className="h-48 relative">
                <EventBannerImage
                  src={ticket.eventBanner}
                  alt={ticket.event || "Event"}
                  className="h-full w-full object-cover"
                  fallbackClassName="flex h-full w-full items-center justify-center bg-primary-container/20 text-primary/30"
                  iconSize={32}
                />
                {ticket.eventBanner && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </>
                )}
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h1 className="font-display text-xl font-bold">{ticket.event}</h1>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <StatusBadge status={ticket.ticketStatus} />
                  {ticket.ticketCategory && (
                    <span className="px-3 py-1 rounded-full bg-primary-container text-white text-xs font-semibold">
                      {ticket.ticketCategory}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">Date</p>
                    <div className="flex items-center gap-1.5 text-sm text-on-surface">
                      <CalendarDays size={13} className="text-primary-container" />
                      {ticket.startDate
                        ? new Date(ticket.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">Time</p>
                    <div className="flex items-center gap-1.5 text-sm text-on-surface">
                      <Clock size={13} className="text-primary-container" />
                      {ticket.startDate
                        ? `${new Date(ticket.startDate).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}${ticket.endDate ? ` - ${new Date(ticket.endDate).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}` : ""}`
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">Venue</p>
                    <div className="flex items-start gap-1.5 text-sm text-on-surface">
                      <MapPin size={13} className="mt-0.5 flex-shrink-0 text-primary-container" />
                      <div className="min-w-0 break-words">
                        <p>{ticket.venue || "-"}</p>
                        {(ticket.venueAddress || ticket.venueCity || ticket.venueProvince) && (
                          <p className="text-xs text-on-surface-variant">
                            {[ticket.venueAddress, ticket.venueCity, ticket.venueProvince].filter(Boolean).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">Order</p>
                    <div className="flex items-start gap-1.5 break-all text-sm text-on-surface">
                      <Receipt size={13} className="mt-0.5 flex-shrink-0 text-primary-container" />
                      {ticket.orderNumber || "-"}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-2">Attendee</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-on-surface">
                      <User size={14} className="text-primary-container" /> {ticket.attendeeName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface">
                      <Mail size={14} className="text-primary-container" /> {ticket.attendeeEmail}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface">
                      <Phone size={14} className="text-primary-container" /> {ticket.attendeePhone}
                    </div>
                  </div>
                </div>

                {(ticket.unitPrice != null || ticket.itemQuantity != null || ticket.itemSubtotal != null || ticket.purchaseDate) && (
                  <div className="grid grid-cols-2 gap-3 rounded-lg bg-surface-container-low p-4">
                    {ticket.unitPrice != null && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Price / ticket</p>
                        <p className="text-sm font-semibold text-on-surface">Rp {ticket.unitPrice.toLocaleString("id-ID")}</p>
                      </div>
                    )}
                    {ticket.itemQuantity != null && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Tickets in order</p>
                        <p className="text-sm font-semibold text-on-surface">{ticket.itemQuantity}</p>
                      </div>
                    )}
                    {ticket.itemSubtotal != null && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Category subtotal</p>
                        <p className="text-sm font-semibold text-on-surface">Rp {ticket.itemSubtotal.toLocaleString("id-ID")}</p>
                      </div>
                    )}
                    {ticket.purchaseDate && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Purchased</p>
                        <p className="text-sm font-semibold text-on-surface">
                          {new Date(ticket.purchaseDate).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {ticket.artists.length > 0 && (
                  <div className="text-xs text-on-surface-variant">
                    <span className="font-semibold text-on-surface">Artists:</span> {ticket.artists.join(", ")}
                  </div>
                )}

                <div className="border-t border-dashed border-brand-border" />

                <div className="flex flex-col items-center">
                  {ticket.qrImage ? (
                    <Image src={ticket.qrImage} alt="QR Code" width={160} height={160} className="rounded-lg" />
                  ) : (
                    <div className="w-40 h-40 bg-surface-container rounded-lg flex items-center justify-center text-xs text-on-surface-variant">
                      No QR Available
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2">
                    <span className="text-xs text-on-surface-variant font-mono">{ticket.ticketId}</span>
                    <button onClick={copyId} className="p-1 hover:bg-surface-container rounded transition-colors cursor-pointer">
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-on-surface-variant" />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="ticket-print-action flex items-center justify-center gap-2 w-full py-3 rounded-full bg-primary-container text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Download size={16} />
                  Save as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="ticket-print-action"><Footer /></div>
    </div>
  );
}

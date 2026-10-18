"use client";

import { use, useEffect, useState } from "react";
import { useOrderStore, OrderDetail } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  MapPin,
  Receipt,
  Ticket,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { fetchOrderDetail } = useOrderStore();
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderDetail(id)
      .then((data) => setDetail(data))
      .catch(() => setError("Order not found"))
      .finally(() => setLoading(false));
  }, [id, fetchOrderDetail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-[72px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary-container" size={36} />
            <p className="text-on-surface-variant text-sm">Loading order...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-[72px]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-brand-sage/20 flex items-center justify-center mx-auto mb-5">
              <Receipt className="text-primary-container" size={24} />
            </div>
            <p className="text-on-surface font-display font-semibold text-lg mb-1">
              Order not found
            </p>
            <p className="text-on-surface-variant text-sm mb-6">{error}</p>
            <Link
              href="/orders"
              className="px-5 py-2.5 rounded-full bg-primary-container text-white font-semibold text-sm inline-flex items-center gap-2"
            >
              <ArrowLeft size={15} /> Back to Orders
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-10">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-brand-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="font-display text-xl font-bold text-on-surface">
                    Order Details
                  </h1>
                  <StatusBadge status={detail.order.status} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                      Invoice
                    </p>
                    <p className="text-on-surface font-medium font-mono text-xs">
                      {detail.order.invoiceNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                      Date
                    </p>
                    <p className="text-on-surface font-medium">
                      {new Date(detail.order.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                      Total
                    </p>
                    <p className="text-on-surface font-display font-bold">
                      Rp {Number(detail.order.totalAmount).toLocaleString()}
                    </p>
                  </div>
                  {detail.payment && (
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                        Payment
                      </p>
                      <StatusBadge status={detail.payment.status} />
                    </div>
                  )}
                </div>
              </div>

              {detail.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-brand-border p-6"
                >
                  <div className="flex gap-4 mb-4">
                    {item.event?.banner ? (
                      <div className="w-20 h-20 rounded-lg overflow-hidden relative flex-shrink-0">
                        <Image
                          src={item.event.banner}
                          alt={item.event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                        <Ticket className="text-on-surface-variant" size={24} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-bold text-on-surface truncate">
                        {item.event?.title || "Event"}
                      </h3>
                      {item.event?.venue && (
                        <div className="flex flex-col gap-1 mt-1 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1.5">
                            <Calendar
                              size={12}
                              className="text-primary-container"
                            />
                            {new Date(
                              item.event.startDate
                            ).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin
                              size={12}
                              className="text-primary-container"
                            />
                            {item.event.venue.name}, {item.event.venue.city}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-[#F8F7F2] rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">
                        {item.ticketCategory.name}
                      </span>
                      <span className="text-on-surface font-medium">
                        {item.quantity}x Rp{" "}
                        {Number(item.ticketCategory.price).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-brand-border pt-2">
                      <span className="font-semibold text-on-surface">
                        Subtotal
                      </span>
                      <span className="font-bold text-on-surface">
                        Rp {item.subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {item.tickets.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-2">
                        Tickets
                      </p>
                      <div className="space-y-2">
                        {item.tickets.map((t) => (
                          <Link
                            key={t.id}
                            href={`/tickets/${t.id}`}
                            className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <User
                                size={14}
                                className="text-primary-container"
                              />
                              <div>
                                <p className="text-sm font-medium text-on-surface">
                                  {t.attendeeName}
                                </p>
                                <p className="text-xs text-on-surface-variant">
                                  {t.attendeeEmail}
                                </p>
                              </div>
                            </div>
                            <StatusBadge status={t.status} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div>
              <div className="sticky top-[88px] bg-white rounded-lg border border-brand-border p-6">
                <h3 className="font-display text-base font-bold text-on-surface mb-4">
                  Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Status</span>
                    <StatusBadge status={detail.order.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Items</span>
                    <span className="font-medium text-on-surface">
                      {detail.orderItems.reduce(
                        (sum, i) => sum + i.quantity,
                        0
                      )}{" "}
                      ticket
                      {detail.orderItems.reduce(
                        (sum, i) => sum + i.quantity,
                        0
                      ) > 1
                        ? "s"
                        : ""}
                    </span>
                  </div>
                  <div className="border-t border-brand-border pt-3 flex justify-between">
                    <span className="font-semibold text-on-surface">Total</span>
                    <span className="font-display text-xl font-bold text-primary-container">
                      Rp{" "}
                      {Number(detail.order.totalAmount).toLocaleString()}
                    </span>
                  </div>
                </div>

                {detail.payment?.paid_at && (
                  <div className="mt-4 bg-brand-cream p-4 rounded-lg text-xs text-on-surface-variant">
                    Paid on{" "}
                    {new Date(detail.payment.paid_at).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

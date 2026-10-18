"use client";

import Script from "next/script";
import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, Event, TicketCategory, useAuthStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft,
  BadgePercent,
  Calendar,
  Check,
  Loader2,
  Lock,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Tag,
  Ticket,
} from "lucide-react";

type OrderResponse = {
  id: string;
  invoice_number: string;
  total_amount: string;
  status: string;
  expires_at: string;
};

type SnapResult = {
  order_id?: string;
  transaction_status?: string;
  payment_type?: string;
  transaction_id?: string;
  status_message?: string;
};

const feeRate = 0.03;
const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

const STEPS = ["Select Ticket", "Checkout", "Payment", "Confirmation"];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const completed = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={label} className="flex items-center">
            {i > 0 && (
              <div
                className={`w-8 sm:w-12 h-[2px] ${
                  completed ? "bg-primary-container" : "bg-surface-container-high"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  completed
                    ? "bg-primary-container text-white"
                    : active
                    ? "border-2 border-primary-container text-primary-container bg-white"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {completed ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                  completed || active ? "text-primary-container" : "text-on-surface-variant"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { token, checkAuth, loading: authLoading } = useAuthStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [voucher, setVoucher] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [refreshingOrder, setRefreshingOrder] = useState(false);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [snapToken, setSnapToken] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "pending" | "failed" | "expired">("idle");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${slug}`);
        if (res.data.success) {
          setEvent(res.data.data);
          const firstAvailable = res.data.data.ticket_categories.find((c: TicketCategory) => c.quota - c.sold > 0);
          if (firstAvailable) setSelectedTicketId(firstAvailable.id);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push(`/login?redirect=/checkout/${slug}`);
    }
  }, [authLoading, router, slug, token]);

  const selectedTicket = useMemo(
    () => event?.ticket_categories.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [event, selectedTicketId]
  );

  const subtotal = selectedTicket ? Number(selectedTicket.price) * quantity : 0;
  const serviceFee = Math.round(subtotal * feeRate);
  const total = subtotal + serviceFee;
  const remaining = selectedTicket ? selectedTicket.quota - selectedTicket.sold : 0;

  const refreshOrder = async (orderId: string) => {
    setRefreshingOrder(true);
    try {
      const res = await api.get(`/orders/${orderId}`);
      if (res.data.success) {
        setOrder(res.data.data);
        if (res.data.data.status === "EXPIRED") setPaymentStatus("expired");
        if (res.data.data.status === "CONFIRMED") setPaymentStatus("success");
        if (res.data.data.status === "CANCELLED") setPaymentStatus("failed");
      }
    } finally {
      setRefreshingOrder(false);
    }
  };

  const handleSnapStatus = async (status: "success" | "pending" | "failed" | "expired", orderId: string) => {
    setPaymentStatus(status);
    await refreshOrder(orderId);
  };

  const openSnap = (tokenValue: string, orderId: string) => {
    if (!window.snap) {
      setMessage("Midtrans Snap is still loading. Please try again.");
      return;
    }

    window.snap.pay(tokenValue, {
      onSuccess: () => handleSnapStatus("success", orderId),
      onPending: () => handleSnapStatus("pending", orderId),
      onError: () => handleSnapStatus("failed", orderId),
      onClose: () => refreshOrder(orderId),
    });
  };

  const applyCode = (kind: "voucher" | "promo") => {
    const value = kind === "voucher" ? voucher : promoCode;
    if (!value.trim()) {
      setMessage(`Enter ${kind === "voucher" ? "voucher" : "promo code"} first.`);
      return;
    }
    setMessage("Voucher and promo code backend is not available yet. Price unchanged.");
  };

  const checkout = async () => {
    if (!event || !selectedTicket) return;
    setCheckingOut(true);
    setMessage("");
    try {
      const orderRes = await api.post("/orders/checkout", {
        eventId: event.id,
        items: [{ ticketCategoryId: selectedTicket.id, quantity }],
      });
      const createdOrder = orderRes.data.data as OrderResponse;
      setOrder(createdOrder);

      const paymentRes = await api.post("/payments/snap", { orderId: createdOrder.id });
      if (paymentRes.data.success) {
        const tokenValue = paymentRes.data.data.snapToken;
        setSnapToken(tokenValue);
        setPaymentUrl(paymentRes.data.data.snapUrl);
        openSnap(tokenValue, createdOrder.id);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: { message: string }[] } } };
      setMessage(error.response?.data?.errors?.[0]?.message || error.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading || authLoading) {
    return <LoadingScreen text="Preparing checkout..." />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-heading font-semibold text-lg mb-2">Event not found</p>
          <Link href="/events/search" className="text-primary-container font-semibold text-sm hover:underline">Browse events</Link>
        </div>
      </div>
    );
  }

  if (order) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
        {midtransClientKey && <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={midtransClientKey} strategy="afterInteractive" />}
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 pt-[72px]">
          <div className="max-w-[1200px] mx-auto w-full py-10">
            <StepIndicator currentStep={paymentStatus === "success" ? 3 : paymentStatus === "idle" ? 2 : 2} />
            <div className="max-w-md w-full mx-auto bg-white rounded-lg border border-brand-border p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-brand-cream flex items-center justify-center mx-auto mb-5">
                {refreshingOrder ? <Loader2 className="animate-spin text-primary-container" size={24} /> : <Check className="text-primary-container" size={24} />}
              </div>
              <h1 className="font-display text-xl font-bold text-brand-heading mb-1">{paymentStatus === "idle" ? "Order Created" : paymentTitle(paymentStatus)}</h1>
              <p className="text-on-surface-variant text-xs mb-5">Invoice {order.invoice_number}</p>
              <div className="bg-brand-cream p-6 rounded-lg mb-5 text-left space-y-2">
                <SummaryRow label="Order Status" value={order.status} />
                <SummaryRow label="Payment Status" value={paymentStatus === "idle" ? "WAITING" : paymentStatus.toUpperCase()} />
                <SummaryRow label="Total" value={`Rp ${Number(order.total_amount).toLocaleString()}`} />
              </div>
              {paymentStatusMessage(paymentStatus) && <p className="text-xs text-on-surface-variant mb-5">{paymentStatusMessage(paymentStatus)}</p>}
              {snapToken ? (
                <button onClick={() => openSnap(snapToken, order.id)} className="w-full h-[44px] rounded-full bg-primary-container text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity">
                  Open Snap Payment
                </button>
              ) : paymentUrl ? (
                <a href={paymentUrl} className="w-full h-[44px] rounded-full bg-primary-container text-white font-semibold text-sm flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                  Continue Payment
                </a>
              ) : (
                <p className="text-xs text-on-surface-variant">Payment unavailable.</p>
              )}
              <button onClick={() => refreshOrder(order.id)} className="block w-full mt-4 text-xs text-primary-container font-semibold hover:underline cursor-pointer">
                {refreshingOrder ? "Refreshing..." : "Refresh order"}
              </button>
              <Link href={`/events/${event.slug}`} className="block mt-3 text-xs text-on-surface-variant font-medium hover:text-primary-container">Back to event</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
      {midtransClientKey && <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={midtransClientKey} strategy="afterInteractive" />}
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-8 pt-[72px]">
        <div className="flex items-center justify-between mt-6 mb-2">
          <Link href={`/events/${event.slug}`} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary-container transition-colors">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-1.5 text-primary-container">
            <Lock size={14} />
            <span className="text-sm font-semibold">Secure Checkout</span>
          </div>
        </div>

        <StepIndicator currentStep={0} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-10">
          <section className="md:col-span-8 space-y-4">
            <div className="bg-white rounded-lg border border-brand-border p-6">
              <div className="flex gap-4">
                {event.banner ? (
                  <img src={event.banner} alt={event.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                    <Ticket className="text-on-surface-variant" size={24} />
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-bold text-brand-heading truncate">{event.title}</h2>
                  <div className="flex flex-col gap-1 mt-2 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-2"><Calendar size={13} className="text-primary-container flex-shrink-0" /> {new Date(event.start_date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                    <span className="flex items-center gap-2"><MapPin size={13} className="text-primary-container flex-shrink-0" /> {event.venues.name}, {event.venues.city}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-brand-border p-6">
              <h2 className="font-display text-base font-bold text-brand-heading mb-4 flex items-center gap-2">
                <Ticket size={16} className="text-primary-container" /> Select Ticket
              </h2>
              <div className="space-y-3">
                {event.ticket_categories.map((ticket) => {
                  const available = ticket.quota - ticket.sold;
                  const selected = selectedTicketId === ticket.id;
                  return (
                    <button
                      key={ticket.id}
                      onClick={() => { setSelectedTicketId(ticket.id); setQuantity(1); }}
                      disabled={available <= 0}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selected
                          ? "bg-brand-sage/10 border-primary-container"
                          : "bg-white border-brand-border hover:border-on-surface-variant"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-sm text-brand-heading">{ticket.name}</p>
                          <p className="text-[11px] text-on-surface-variant mt-0.5">{available} tickets left</p>
                        </div>
                        <p className="font-bold text-sm text-brand-heading whitespace-nowrap">Rp {Number(ticket.price).toLocaleString()}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-brand-border p-6">
              <h2 className="font-display text-base font-bold text-brand-heading mb-4">Quantity</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-[44px] h-[44px] rounded-full border border-brand-border text-brand-heading hover:bg-surface-container-high flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="w-14 h-[44px] rounded-lg bg-[#F8F7F2] border border-brand-border flex items-center justify-center font-bold text-sm text-brand-heading">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(Math.min(Math.min(5, remaining), quantity + 1))}
                  className="w-[44px] h-[44px] rounded-full border border-brand-border text-brand-heading hover:bg-surface-container-high flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Plus size={16} />
                </button>
                <p className="text-xs text-on-surface-variant">Max 5 per order</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CodeBox title="Voucher" icon={<Tag size={16} className="text-primary-container" />} value={voucher} setValue={setVoucher} placeholder="Enter voucher" onApply={() => applyCode("voucher")} />
              <CodeBox title="Promo Code" icon={<BadgePercent size={16} className="text-primary-container" />} value={promoCode} setValue={setPromoCode} placeholder="Enter promo code" onApply={() => applyCode("promo")} />
            </div>

            {message && <div className="bg-brand-cream p-6 rounded-lg text-xs text-brand-heading">{message}</div>}
          </section>

          <aside className="md:col-span-4">
            <div className="sticky top-[96px] bg-white rounded-lg border border-brand-border p-6">
              <h2 className="font-display text-base font-bold text-brand-heading mb-4">Order Summary</h2>
              <div className="space-y-3 mb-5">
                <SummaryRow label="Ticket" value={selectedTicket?.name || "Select ticket"} />
                <SummaryRow label="Price" value={selectedTicket ? `Rp ${Number(selectedTicket.price).toLocaleString()}` : "-"} />
                <SummaryRow label="Quantity" value={`${quantity}x`} />
                <SummaryRow label="Subtotal" value={`Rp ${subtotal.toLocaleString()}`} />
                <SummaryRow label="Service Fee (3%)" value={`Rp ${serviceFee.toLocaleString()}`} />
                <div className="border-t border-brand-border pt-3 flex items-center justify-between">
                  <span className="font-semibold text-sm text-brand-heading">Total</span>
                  <span className="font-display text-xl font-bold text-brand-heading">Rp {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={checkout}
                disabled={!selectedTicket || checkingOut || remaining <= 0 || !midtransClientKey}
                className="w-full h-[44px] rounded-full bg-primary-container text-white font-semibold text-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-90"
              >
                {checkingOut && <Loader2 className="animate-spin" size={15} />}
                Create Transaction
              </button>

              {!midtransClientKey && (
                <div className="text-[11px] text-error mt-2.5 text-center">
                  <p>Missing NEXT_PUBLIC_MIDTRANS_CLIENT_KEY</p>
                </div>
              )}

              <div className="bg-brand-cream p-6 rounded-lg mt-5 flex items-start gap-2.5">
                <ShieldCheck className="text-primary-container flex-shrink-0 mt-0.5" size={15} />
                <p className="text-[11px] text-brand-heading leading-normal">Order expires in 15 minutes. Final payment status is saved by Midtrans webhook.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function LoadingScreen({ text }: { text: string }) {
  return (
    <div className="min-h-screen bg-[#F8F7F2] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-primary-container" size={36} />
        <p className="text-on-surface-variant text-sm">{text}</p>
      </div>
    </div>
  );
}

function paymentTitle(status: "idle" | "success" | "pending" | "failed" | "expired") {
  if (status === "success") return "Payment Successful";
  if (status === "pending") return "Payment Pending";
  if (status === "failed") return "Payment Failed";
  if (status === "expired") return "Payment Expired";
  return "Order Created";
}

function paymentStatusMessage(status: "idle" | "success" | "pending" | "failed" | "expired") {
  if (status === "success") return "Payment complete. Order is refreshing automatically.";
  if (status === "pending") return "Payment is pending. Complete payment before the order expires.";
  if (status === "failed") return "Payment failed. You can reopen Snap and try again.";
  if (status === "expired") return "Payment session expired. Create a new order to continue.";
  return "";
}

function CodeBox({ title, icon, value, setValue, placeholder, onApply }: { title: string; icon: React.ReactNode; value: string; setValue: (value: string) => void; placeholder: string; onApply: () => void }) {
  return (
    <div className="bg-white rounded-lg border border-brand-border p-6">
      <h2 className="font-display text-sm font-bold text-brand-heading mb-3 flex items-center gap-1.5">{icon} {title}</h2>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          placeholder={placeholder}
          className="flex-1 px-3 h-[44px] rounded-full border border-brand-border bg-[#F8F7F2] focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container focus:outline-none transition-all text-xs font-semibold placeholder:text-on-surface-variant/40"
        />
        <button onClick={onApply} className="px-4 h-[44px] rounded-full bg-primary-container text-white font-semibold text-xs cursor-pointer hover:opacity-90 transition-opacity">Apply</button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-semibold text-brand-heading text-right">{value}</span>
    </div>
  );
}

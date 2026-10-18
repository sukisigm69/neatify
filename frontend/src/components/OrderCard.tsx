import React from "react";
import { Order } from "@/lib/store";
import { Calendar, CreditCard, ReceiptText, Ticket } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border/50 shadow-card hover:shadow-card-hover transition-all duration-200 p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-brand-muted flex items-center justify-center">
              <ReceiptText size={16} className="text-brand-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-brand-heading text-sm">{order.invoiceNumber}</h3>
              <p className="text-xs text-brand-paragraph line-clamp-1">{order.eventSummary || "Concert ticket purchase"}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-brand-paragraph">
            <span className="flex items-center gap-2">
              <Calendar size={13} className="text-brand-secondary" />
              {new Date(order.purchaseDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="flex items-center gap-2">
              <CreditCard size={13} className="text-brand-secondary" />
              {order.paymentMethod || "-"}
            </span>
            <span className="flex items-center gap-2">
              <Ticket size={13} className="text-brand-secondary" />
              {order.totalTicket} ticket{order.totalTicket > 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-3 lg:min-w-64 lg:justify-end">
          <div className="flex gap-1.5">
            <StatusBadge status={order.orderStatus} />
            <StatusBadge status={order.paymentStatus} />
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[10px] text-brand-paragraph">Grand Total</p>
            <p className="text-base font-bold text-brand-heading">Rp {order.grandTotal.toLocaleString("id-ID")}</p>
          </div>
          <Link
            href={`/orders/${order.invoiceNumber}`}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-semibold hover:bg-brand-primary-dark transition-colors cursor-pointer"
          >
            View Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

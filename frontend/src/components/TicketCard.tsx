import React from "react";
import { Ticket } from "@/lib/store";
import { Calendar, MapPin, Ticket as TicketIcon } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import Image from "next/image";

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  return (
    <div className="group bg-brand-surface rounded-xl overflow-hidden border border-brand-border/50 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5">
      <div className="h-40 bg-brand-muted relative overflow-hidden flex items-center justify-center">
        {ticket.eventBanner ? (
          <Image
            src={ticket.eventBanner}
            alt={ticket.event || "Event"}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <TicketIcon size={28} className="text-brand-primary/30" />
        )}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-md p-1 shadow-sm">
          <StatusBadge status={ticket.ticketStatus} />
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-base text-brand-heading line-clamp-1 mb-1">
          {ticket.event}
        </h3>
        <p className="text-brand-primary text-xs font-semibold uppercase tracking-wider mb-4">
          {ticket.ticketCategory}
        </p>
        <div className="space-y-2 text-sm text-brand-paragraph mb-5">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-brand-secondary flex-shrink-0" />
            <span className="line-clamp-1">
              {ticket.startDate
                ? new Date(ticket.startDate).toLocaleDateString("id-ID", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-brand-secondary flex-shrink-0" />
            <span className="line-clamp-1">{ticket.venue || "-"}</span>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Link
            href={`/tickets/${ticket.ticketId}`}
            className="flex-1 py-2 bg-brand-primary text-white text-center rounded-lg font-semibold text-xs hover:bg-brand-primary-dark hover:shadow-brand transition-all duration-200 cursor-pointer"
          >
            View Detail
          </Link>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/tickets/${ticket.ticketId}/download`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 border border-brand-border text-brand-heading rounded-lg font-semibold text-xs hover:bg-brand-muted transition-colors flex items-center justify-center cursor-pointer"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

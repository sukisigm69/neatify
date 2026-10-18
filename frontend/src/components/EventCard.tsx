import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { Event } from "@/lib/store";
import { EventBannerImage } from "@/components/EventBannerImage";

export function EventCard({ event }: { event: Event }) {
  const lowestPrice = event.ticket_categories?.length > 0
    ? Math.min(...event.ticket_categories.map((c) => Number(c.price)))
    : 0;

  return (
    <Link href={`/events/${event.slug}`} className="group bg-white rounded-xl overflow-hidden border border-brand-border shadow-subtle hover:shadow-card-hover flex flex-col transition-all duration-200 hover:-translate-y-0.5">
      <div className="h-48 bg-surface-variant relative flex items-center justify-center overflow-hidden">
        <EventBannerImage
          src={event.banner}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          fallbackClassName="flex h-full w-full items-center justify-center bg-surface-variant text-primary-container/30"
          iconSize={28}
        />
        {event.status === "PUBLISHED" && (
          <span className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-0.5 rounded-md text-[11px] font-semibold">
            On Sale
          </span>
        )}
        {event.status === "SOLD_OUT" && (
          <span className="absolute top-3 right-3 bg-error text-white px-2.5 py-0.5 rounded-md text-[11px] font-semibold">
            Sold Out
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-base font-semibold text-on-surface mb-3 leading-snug line-clamp-2">{event.title}</h3>
        <div className="mt-auto space-y-2 text-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-primary-container flex-shrink-0" />
            {new Date(event.start_date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-primary-container flex-shrink-0" />
            {event.venues.name}, {event.venues.city}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-brand-border/50">
          {lowestPrice > 0 ? (
            <span className="font-display font-bold text-primary-container text-base">Rp {lowestPrice.toLocaleString("id-ID")}</span>
          ) : (
            <span className="text-sm font-medium text-emerald-600">Gratis</span>
          )}
          <span className="text-sm font-medium text-primary group-hover:text-primary-container transition-colors">
            Beli Tiket
          </span>
        </div>
      </div>
    </Link>
  );
}

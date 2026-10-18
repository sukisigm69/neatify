"use client";

import { useEffect, useState } from "react";
import { api, Event, Organizer } from "@/lib/store";
import { use } from "react";
import Link from "next/link";
import { Calendar, MapPin, Music, Ticket, ArrowRight, ArrowLeft, Loader2, Globe, Mail, Users } from "lucide-react";

export default function OrganizerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await api.get("/events", { params: { limit: 100 } });
        if (eventsRes.data.success) {
          const orgEvents = eventsRes.data.data.events.filter((e: Event) => e.organizers.id === id);
          setEvents(orgEvents);
          if (orgEvents.length > 0) {
            setOrganizer(orgEvents[0].organizers);
          }
        }
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-brand-primary" size={36} />
          <p className="text-brand-paragraph text-sm">Loading organizer...</p>
        </div>
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-brand-muted flex items-center justify-center mx-auto mb-5">
            <Users className="text-brand-primary" size={24} />
          </div>
          <p className="text-brand-heading font-display font-semibold text-lg mb-1">Organizer not found</p>
          <p className="text-brand-paragraph text-sm mb-6">This organizer does not exist or has no published events</p>
          <Link href="/events/search" className="px-5 py-2.5 gradient-brand text-white rounded-lg font-semibold shadow-brand text-sm inline-flex items-center gap-2 cursor-pointer">
            <ArrowLeft size={15} /> Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/50 px-6 lg:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2 rounded-lg hover:bg-brand-muted transition-colors text-brand-paragraph cursor-pointer" aria-label="Go back">
            <ArrowLeft size={18} />
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white font-display font-bold text-base">K</div>
            <span className="font-display font-bold text-xl tracking-tight text-brand-heading hidden sm:inline">Konsera</span>
          </Link>
        </div>
      </header>

      <div className="bg-brand-heading py-14 px-6 lg:px-12 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-6">
            {organizer.logo ? (
              <img src={organizer.logo} alt={organizer.org_name} className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border-2 border-white/20 shadow-brand-lg" />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/10 flex items-center justify-center text-white font-display font-bold text-2xl shadow-brand-lg border-2 border-white/20">
                {organizer.org_name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold">{organizer.org_name}</h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap text-white/60">
                {organizer.users && (
                  <span className="text-sm flex items-center gap-1.5">
                    <Mail size={13} /> {organizer.users.email}
                  </span>
                )}
                {organizer.website && (
                  <a href={organizer.website} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1.5 hover:text-white transition-colors">
                    <Globe size={13} /> Website
                  </a>
                )}
              </div>
              {organizer.is_approved && (
                <span className="inline-flex items-center gap-1 mt-3 bg-white/10 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Verified Organizer
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10">
        {organizer.description && (
          <div className="bg-brand-surface rounded-xl p-6 lg:p-7 border border-brand-border/50 shadow-card mb-8">
            <h2 className="font-display text-base font-bold text-brand-heading mb-2.5">About</h2>
            <p className="text-brand-paragraph text-sm leading-relaxed whitespace-pre-line">{organizer.description}</p>
          </div>
        )}

        <div className="mb-6">
          <h2 className="font-display text-xl md:text-2xl font-bold text-brand-heading flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-muted flex items-center justify-center">
              <Music className="text-brand-primary" size={18} />
            </div>
            Events by {organizer.org_name}
          </h2>
          <p className="text-brand-paragraph mt-1 text-sm">{events.length} events</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-xl bg-brand-muted flex items-center justify-center mx-auto mb-5">
              <Music className="text-brand-primary" size={24} />
            </div>
            <p className="text-brand-heading font-display font-semibold text-lg mb-1">No events yet</p>
            <p className="text-brand-paragraph text-sm">This organizer hasn&apos;t published any events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const lowestPrice = event.ticket_categories?.length > 0
                ? Math.min(...event.ticket_categories.map((c) => Number(c.price)))
                : 0;

              return (
                <Link key={event.id} href={`/events/${event.slug}`} className="group bg-brand-surface rounded-xl overflow-hidden shadow-card hover:shadow-card-hover border border-brand-border/50 flex flex-col transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                  <div className="h-48 bg-brand-muted relative flex items-center justify-center overflow-hidden">
                    {event.banner ? (
                      <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-brand-muted flex items-center justify-center">
                        <Music size={24} className="text-brand-primary/30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-brand-primary text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {event.status}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-base text-brand-heading mb-1 leading-snug line-clamp-2">{event.title}</h3>
                    <p className="text-brand-paragraph text-sm line-clamp-2 mb-4 leading-relaxed">{event.description}</p>
                    <div className="mt-auto space-y-2 text-sm text-brand-paragraph">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-brand-secondary flex-shrink-0" />
                        {new Date(event.start_date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-brand-secondary flex-shrink-0" />
                        {event.venues.name}, {event.venues.city}
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between pt-4 border-t border-brand-border/50">
                      {lowestPrice > 0 ? (
                        <span className="font-display font-bold text-brand-heading text-sm">Rp {lowestPrice.toLocaleString()}</span>
                      ) : (
                        <span className="text-sm text-brand-paragraph">Free</span>
                      )}
                      <span className="text-sm font-semibold text-brand-primary group-hover:text-brand-primary-dark flex items-center gap-1 transition-colors">
                        Get Tickets <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-brand-surface border-t border-brand-border/50 py-8 px-6 lg:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center text-white font-display font-bold text-xs">K</div>
            <span className="font-display font-semibold text-brand-heading text-sm">Konsera</span>
          </div>
          <p className="text-sm text-brand-paragraph">&copy; {new Date().getFullYear()} Konsera. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

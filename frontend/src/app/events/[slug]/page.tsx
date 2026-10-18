"use client";

import { useEffect, useState, use } from "react";
import { api, useAuthStore, useFavoriteStore, Event } from "@/lib/store";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventBannerImage } from "@/components/EventBannerImage";
import {
  Calendar, MapPin, Clock, Users, Music, Ticket, ArrowRight, ArrowLeft,
  Loader2, Heart, Share2, ExternalLink, Star, Copy, Check, Minus, Plus, Tag
} from "lucide-react";

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { token, checkAuth } = useAuthStore();
  const { isFavorite, toggle, load: loadFavorites } = useFavoriteStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [bookingLoading] = useState(false);
  const [bookingSuccess] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${slug}`);
        if (res.data.success) {
          setEvent(res.data.data);
          if (res.data.data.ticket_categories?.length > 0) {
            setSelectedCategory(res.data.data.ticket_categories[0].id);
          }
        }
      } catch {
        setError("Event tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
    checkAuth();
    loadFavorites();
  }, [slug, checkAuth, loadFavorites]);

  const handleBookTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      window.location.href = `/login?redirect=/checkout/${slug}`;
      return;
    }
    window.location.href = `/checkout/${slug}`;
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: event?.title, text: event?.description, url });
      } catch { /* cancelled */ }
    } else {
      setShowShare(true);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-primary-container" size={32} />
          <p className="text-on-surface-variant text-sm">Memuat event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center mx-auto mb-4">
            <Music className="text-primary-container" size={24} />
          </div>
          <p className="text-on-surface font-display font-semibold text-lg mb-1">Event tidak ditemukan</p>
          <p className="text-on-surface-variant text-sm mb-6">{error}</p>
          <Link href="/events/search" className="px-5 py-2.5 rounded-xl bg-primary-container text-white font-semibold text-sm inline-flex items-center gap-2">
            <ArrowLeft size={15} /> Jelajahi Event
          </Link>
        </div>
      </div>
    );
  }

  const lowestPrice = event.ticket_categories.length > 0
    ? Math.min(...event.ticket_categories.map((c) => Number(c.price)))
    : 0;

  const selectedCat = event.ticket_categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />

      <div className="pt-[72px]">
        <div className="relative w-full">
          <div className="grid md:grid-cols-12 max-w-[1200px] mx-auto">
            <div className="md:col-span-7 relative h-[320px] md:h-[420px] overflow-hidden">
              {event.banner ? (
                <>
                  <EventBannerImage
                    src={event.banner}
                    alt={event.title}
                    className="h-full w-full object-cover"
                    fallbackClassName="flex h-full w-full items-center justify-center bg-on-surface text-white/30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </>
              ) : (
                <EventBannerImage
                  src={event.banner}
                  alt={event.title}
                  className="h-full w-full object-cover"
                  fallbackClassName="flex h-full w-full items-center justify-center bg-on-surface text-white/30"
                />
              )}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Link href="/events/search" className="w-[44px] h-[44px] rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <ArrowLeft size={18} />
                </Link>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!token) {
                      window.location.href = "/login";
                      return;
                    }
                    toggle(event.id);
                  }}
                  className={`w-[44px] h-[44px] rounded-xl backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer ${isFavorite(event.id) ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"}`}
                  aria-label="Tambah ke favorit"
                >
                  <Heart size={18} fill={isFavorite(event.id) ? "currentColor" : "none"} />
                </button>
                <button onClick={handleShare} className="w-[44px] h-[44px] rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer" aria-label="Bagikan">
                  <Share2 size={18} />
                </button>
              </div>
              <div className="absolute bottom-6 left-6 right-6 md:hidden">
                {event.status === "PUBLISHED" && (
                  <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-md text-[11px] font-semibold">On Sale</span>
                )}
                <h1 className="font-display text-2xl font-extrabold text-white leading-tight mt-2">{event.title}</h1>
              </div>
            </div>

            <div className="md:col-span-5 bg-brand-cream hidden md:flex flex-col justify-center px-8 lg:px-10 py-8">
              {event.status === "PUBLISHED" && (
                <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block w-fit mb-4">On Sale</span>
              )}
              {event.status === "SOLD_OUT" && (
                <span className="bg-error text-white px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block w-fit mb-4">Sold Out</span>
              )}
              <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-on-surface leading-tight mb-4">{event.title}</h1>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Calendar size={16} className="text-primary-container flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {new Date(event.start_date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Clock size={16} className="text-primary-container flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {new Date(event.start_date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} — {new Date(event.end_date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <MapPin size={16} className="text-primary-container flex-shrink-0" />
                  <span className="text-sm font-medium">{event.venues.name}, {event.venues.city}</span>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs text-on-surface-variant mb-1">Mulai dari</p>
                <p className="font-display text-2xl font-bold text-on-surface">Rp {lowestPrice.toLocaleString("id-ID")}</p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-6">
              <div className="bg-white rounded-xl border border-brand-border p-6">
                <h2 className="font-display text-lg font-bold text-on-surface mb-3">Tentang Event</h2>
                <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-brand-border p-4">
                  <div className="w-9 h-9 rounded-lg bg-primary-container/10 flex items-center justify-center mb-3">
                    <Calendar size={16} className="text-primary-container" />
                  </div>
                  <p className="text-xs font-semibold uppercase text-on-surface-variant tracking-wide mb-1">Tanggal</p>
                  <p className="text-sm font-semibold text-on-surface">
                    {new Date(event.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-brand-border p-4">
                  <div className="w-9 h-9 rounded-lg bg-primary-container/10 flex items-center justify-center mb-3">
                    <Clock size={16} className="text-primary-container" />
                  </div>
                  <p className="text-xs font-semibold uppercase text-on-surface-variant tracking-wide mb-1">Waktu</p>
                  <p className="text-sm font-semibold text-on-surface">
                    {new Date(event.start_date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-brand-border p-4">
                  <div className="w-9 h-9 rounded-lg bg-primary-container/10 flex items-center justify-center mb-3">
                    <MapPin size={16} className="text-primary-container" />
                  </div>
                  <p className="text-xs font-semibold uppercase text-on-surface-variant tracking-wide mb-1">Venue</p>
                  <p className="text-sm font-semibold text-on-surface leading-tight">{event.venues.name}</p>
                </div>
                <div className="bg-white rounded-xl border border-brand-border p-4">
                  <div className="w-9 h-9 rounded-lg bg-primary-container/10 flex items-center justify-center mb-3">
                    <Tag size={16} className="text-primary-container" />
                  </div>
                  <p className="text-xs font-semibold uppercase text-on-surface-variant tracking-wide mb-1">Kategori</p>
                  <p className="text-sm font-semibold text-on-surface">{event.ticket_categories.length} tipe</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-brand-border p-6">
                <h2 className="font-display text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                  <Ticket size={18} className="text-primary-container" /> Pilih Tiket
                </h2>
                <div className="space-y-3">
                  {event.ticket_categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const available = cat.quota - cat.sold;
                    const isSoldOut = available <= 0;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          if (!isSoldOut) {
                            setSelectedCategory(cat.id);
                            setQuantity(1);
                          }
                        }}
                        className={`rounded-xl border p-4 transition-all ${
                          isSoldOut
                            ? "bg-surface-container-low/50 border-brand-border/60 opacity-60 cursor-not-allowed"
                            : isSelected
                            ? "bg-primary-container/5 border-2 border-primary-container cursor-pointer"
                            : "bg-white border-brand-border hover:border-primary-container/50 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm text-on-surface">{cat.name}</h3>
                              {available <= 10 && available > 0 && (
                                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-md text-[10px] font-semibold">Sisa {available}</span>
                              )}
                              {isSoldOut && (
                                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-[10px] font-semibold">Habis</span>
                              )}
                            </div>
                            <p className="text-primary-container font-bold text-base mt-1">Rp {Number(cat.price).toLocaleString("id-ID")}</p>
                          </div>
                          {isSelected && available > 0 && (
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setQuantity((q) => Math.max(1, q - 1)); }}
                                className="w-[44px] h-[44px] rounded-xl border border-brand-border flex items-center justify-center hover:bg-surface-container-low transition-colors cursor-pointer"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-on-surface font-bold text-lg w-6 text-center">{quantity}</span>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setQuantity((q) => Math.min(Math.min(5, available), q + 1)); }}
                                className="w-[44px] h-[44px] rounded-xl border border-brand-border flex items-center justify-center hover:bg-surface-container-low transition-colors cursor-pointer"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {event.event_artists.length > 0 && (
                <div className="bg-white rounded-xl border border-brand-border p-6">
                  <h2 className="font-display text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                    <Star size={16} className="text-primary-container" /> Artis Tampil
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.event_artists.map((ea) => (
                      <div key={ea.artists.id} className="flex items-center gap-3.5 p-3 rounded-xl bg-brand-bg border border-brand-border">
                        {ea.artists.image ? (
                          <img src={ea.artists.image} alt={ea.artists.name} className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center flex-shrink-0">
                            <Music size={18} className="text-primary-container" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm text-on-surface">{ea.artists.name}</p>
                          {ea.artists.genre && <p className="text-[11px] text-on-surface-variant mt-0.5 uppercase tracking-wider">{ea.artists.genre}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-brand-border p-6">
                <h2 className="font-display text-lg font-bold text-on-surface mb-4">Detail Venue</h2>
                <div className="flex items-start gap-4">
                  {event.venues.image ? (
                    <img src={event.venues.image} alt={event.venues.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-primary-container/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={22} className="text-primary-container" />
                    </div>
                  )}
                  <div>
                    <p className="font-display font-semibold text-on-surface text-base leading-snug">{event.venues.name}</p>
                    <p className="text-on-surface-variant text-sm mt-1">{event.venues.address}</p>
                    <p className="text-on-surface-variant text-sm">{event.venues.city}, {event.venues.province}</p>
                    <div className="flex items-center gap-1.5 mt-2.5 text-xs text-on-surface-variant">
                      <Users size={12} /> Kapasitas: {event.venues.capacity.toLocaleString("id-ID")}
                    </div>
                    {event.venues.map_url && (
                      <a href={event.venues.map_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary-container font-semibold hover:underline mt-2.5">
                        <ExternalLink size={12} /> Lihat di Peta
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <Link
                href={`/organizer/${event.organizers.id}`}
                className="block bg-white rounded-xl border border-brand-border p-5 hover:shadow-card-hover transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {event.organizers.logo ? (
                    <img src={event.organizers.logo} alt={event.organizers.org_name} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-white font-display font-bold text-base flex-shrink-0">
                      {event.organizers.org_name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase text-on-surface-variant tracking-wider">Diselenggarakan oleh</p>
                    <p className="font-semibold text-sm text-on-surface">{event.organizers.org_name}</p>
                  </div>
                  <ArrowRight size={16} className="text-on-surface-variant" />
                </div>
              </Link>
            </div>

            <div className="md:col-span-4">
              <div className="sticky top-[88px]">
                <div className="bg-white rounded-xl border border-brand-border p-6">
                  <h3 className="font-display text-base font-bold text-on-surface mb-4">Ringkasan Pesanan</h3>

                  {bookingSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                      <p className="text-emerald-700 font-semibold text-sm flex items-center gap-2"><Check size={16} /> Booking Berhasil</p>
                      <p className="text-emerald-600 text-xs mt-1">{bookingSuccess}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBookTicket} className="space-y-4">
                      {selectedCat && (
                        <div className="space-y-3">
                          <div className="bg-brand-bg rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-on-surface">{selectedCat.name}</span>
                              <span className="text-sm text-on-surface-variant">x{quantity}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-on-surface-variant">Rp {Number(selectedCat.price).toLocaleString("id-ID")} /tiket</span>
                              <span className="text-sm font-bold text-on-surface">Rp {(Number(selectedCat.price) * quantity).toLocaleString("id-ID")}</span>
                            </div>
                          </div>

                          <div className="border-t border-brand-border pt-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-on-surface">Total</span>
                              <span className="font-display text-xl font-bold text-primary-container">Rp {(Number(selectedCat.price) * quantity).toLocaleString("id-ID")}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {!selectedCat && (
                        <p className="text-sm text-on-surface-variant text-center py-4">Pilih kategori tiket</p>
                      )}

                      <button
                        type="submit"
                        disabled={bookingLoading || event.ticket_categories.length === 0 || !selectedCat}
                        className="w-full py-3 rounded-xl bg-primary-container text-white font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-brand-primary-dark"
                      >
                        <Ticket size={15} /> {token ? "Pesan Sekarang" : "Login untuk Pesan"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showShare && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowShare(false)}>
          <div className="bg-white rounded-xl p-5 max-w-sm w-full border border-brand-border" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-base font-bold text-on-surface mb-3">Bagikan Event</h3>
            <div className="flex items-center gap-2 bg-brand-bg rounded-xl p-2.5 border border-brand-border">
              <input type="text" readOnly value={typeof window !== "undefined" ? window.location.href : ""} className="flex-1 bg-transparent text-xs text-on-surface outline-none truncate" />
              <button onClick={copyLink} className="p-2 rounded-lg bg-primary-container text-white flex-shrink-0 cursor-pointer">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-2.5 text-center">{copied ? "Link disalin!" : "Salin link untuk membagikan event"}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

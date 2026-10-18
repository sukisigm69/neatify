"use client";

import { useEffect, useState } from "react";
import { api, useAuthStore, Event } from "@/lib/store";
import { Search, Loader2, MapPin, Calendar, Ticket, Music, Clock } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";

const previewEvents = [
  {
    title: "Konsera Music Festival 2026",
    city: "Jakarta",
    venue: "GBK Stadium",
    date: "15 November 2026",
    price: "Rp 500.000",
    tone: "bg-brand-cream",
  },
  {
    title: "Tulus Intimate Concert",
    city: "Tangerang",
    venue: "ICE BSD",
    date: "20 Desember 2026",
    price: "Rp 350.000",
    tone: "bg-surface-container-low",
  },
  {
    title: "Indie Night Vol. 3",
    city: "Jakarta",
    venue: "Senayan",
    date: "10 Januari 2027",
    price: "Rp 180.000",
    tone: "bg-white/70",
  },
];

export default function Home() {
  const { checkAuth } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      if (res.data.success) {
        setEvents(res.data.data.events);
      }
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    queueMicrotask(fetchEvents);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/events/search?q=${encodeURIComponent(search)}`;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />

      <section className="relative pt-[72px] overflow-hidden">
        <div className="absolute inset-x-0 top-[72px] h-[420px] bg-brand-cream" />
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-16 py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_460px] gap-12 items-center">
            <div className="animate-reveal-soft">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card text-xs font-semibold text-primary-container mb-5">
                <Music size={14} /> Tiket konser Indonesia
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-[60px] font-extrabold text-on-surface leading-[1.05] tracking-tight mb-5">
                Panggung favoritmu,<br />
                <span className="text-primary-container">satu tiket lagi.</span>
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8 max-w-md">
                Cari konser, pilih kategori tiket, bayar, lalu simpan QR tiket langsung di akun Konsera.
              </p>
              <form onSubmit={handleSearch} className="max-w-md relative mb-5">
                <input
                  type="text"
                  placeholder="Cari konser, artis, atau kota..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full glass-card text-on-surface pl-12 pr-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-[15px] placeholder:text-on-surface-variant/50 transition-smooth"
                />
                <Search className="absolute left-4 top-4 text-on-surface-variant/50" size={18} />
              </form>
              <div className="flex flex-wrap gap-3">
                <Link href="/events/search" className="inline-flex px-7 py-3 rounded-xl bg-primary-container text-white text-sm font-semibold hover:bg-brand-primary-dark transition-smooth">
                  Cari Tiket Konser
                </Link>
                <Link href="/register" className="inline-flex px-7 py-3 rounded-xl glass-card text-on-surface text-sm font-semibold hover:-translate-y-0.5 transition-smooth">
                  Jadi Organizer
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block h-[420px]">
              <div className="absolute right-0 top-6 w-[340px] rounded-[28px] glass-card overflow-hidden animate-float-soft scan-light" style={{ "--float-rotate": "1deg" } as React.CSSProperties}>
                <div className="h-48 bg-primary-container flex items-center justify-center text-white">
                  <Music size={52} />
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold text-primary-container uppercase tracking-widest mb-2">Featured</p>
                  <h3 className="font-display text-xl font-bold text-on-surface mb-3">Konsera Music Festival</h3>
                  <div className="space-y-2 text-sm text-on-surface-variant">
                    <p className="flex items-center gap-2"><Calendar size={14} className="text-primary-container" /> 15 November 2026</p>
                    <p className="flex items-center gap-2"><MapPin size={14} className="text-primary-container" /> GBK Stadium, Jakarta</p>
                  </div>
                </div>
              </div>
              <div className="absolute left-4 bottom-4 w-[260px] rounded-2xl glass-card p-5 animate-float-soft" style={{ "--float-rotate": "-1deg", animationDelay: "0.6s" } as React.CSSProperties}>
                <Ticket className="text-primary-container mb-3" size={26} />
                <p className="font-display font-bold text-on-surface mb-1">QR Ticket Ready</p>
                <p className="text-sm text-on-surface-variant">Tiket tersimpan setelah pembayaran berhasil.</p>
              </div>
              <div className="absolute left-20 top-0 w-16 h-16 rounded-2xl bg-brand-warm/30 animate-float-soft" style={{ "--float-rotate": "8deg", animationDelay: "1s" } as React.CSSProperties} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-16 py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-on-surface">Event Mendatang</h2>
              <p className="text-on-surface-variant mt-1.5 text-[15px]">Konser yang segera diselenggarakan</p>
            </div>
            <Link href="/events/search" className="text-sm font-semibold text-primary hover:text-primary-container transition-smooth whitespace-nowrap">
              Lihat Semua
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="animate-spin text-primary-container" size={32} />
              <p className="text-on-surface-variant text-sm">Memuat event...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {previewEvents.map((event, index) => (
                <div key={event.title} className={`glass-card rounded-2xl overflow-hidden animate-reveal-soft ${event.tone}`} style={{ animationDelay: `${index * 70}ms` }}>
                  <div className="h-40 relative overflow-hidden bg-primary-container">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.34),transparent_32%),linear-gradient(135deg,#468189,#77ACA2)]" />
                    <div className="absolute inset-x-6 bottom-5 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center px-4 gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white"><Music size={20} /></div>
                      <div>
                        <p className="text-white text-xs font-semibold">Live concert</p>
                        <p className="text-white/70 text-[11px]">{event.city}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                  <p className="text-[11px] font-semibold text-primary-container uppercase tracking-widest mb-2">Preview event</p>
                  <h3 className="font-display text-lg font-bold text-on-surface mb-3">{event.title}</h3>
                  <div className="space-y-2 text-sm text-on-surface-variant mb-5">
                    <p className="flex items-center gap-2"><Calendar size={14} className="text-primary-container" /> {event.date}</p>
                    <p className="flex items-center gap-2"><MapPin size={14} className="text-primary-container" /> {event.venue}, {event.city}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-brand-border/60">
                    <span className="font-display font-bold text-primary-container">{event.price}</span>
                    <span className="text-xs text-on-surface-variant">Data seed</span>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 6).map((event, index) => (
                <div key={event.id} className="animate-reveal-soft" style={{ animationDelay: `${index * 55}ms` }}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 md:px-16 py-6 pb-16">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-5">
          <div className="glass-card rounded-2xl p-6 md:col-span-2">
            <Clock className="text-primary-container mb-4" size={26} />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-on-surface mb-3">Buat konsermu siap dijual lebih cepat</h2>
            <p className="text-on-surface-variant max-w-xl">Organizer bisa membuat event, menambahkan kategori tiket, lalu submit untuk approval admin.</p>
          </div>
          <div className="bg-brand-cream rounded-2xl p-6 border border-brand-border">
            <h3 className="font-display font-bold text-on-surface mb-2">Untuk Organizer</h3>
            <p className="text-sm text-on-surface-variant mb-5">Kelola event dan validasi tiket dari satu dashboard.</p>
            <Link href="/register" className="inline-flex px-5 py-2.5 rounded-xl bg-primary-container text-white text-sm font-semibold hover:bg-brand-primary-dark transition-smooth">
              Daftar Organizer
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

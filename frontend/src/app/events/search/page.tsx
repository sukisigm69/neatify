"use client";

import { useEffect, useState } from "react";
import { api, Event } from "@/lib/store";
import { Search, Loader2, ArrowLeft, ArrowRight, X, ChevronDown, MapPin, Calendar } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";

export default function SearchPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [city, setCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);

  const fetchEvents = async (p = 1, q = search, c = city) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: p, limit: 12 };
      if (q) params.search = q;
      const res = await api.get("/events", { params });
      if (res.data.success) {
        let evts: Event[] = res.data.data.events;
        if (c) {
          evts = evts.filter((e) => e.venues.city.toLowerCase() === c.toLowerCase());
        }
        setEvents(evts);
        setTotal(res.data.data.total);
        setTotalPages(res.data.data.totalPages);
        setPage(res.data.data.page);

        if (cities.length === 0) {
          const allCities = res.data.data.events.map((e: Event) => e.venues.city);
          setCities([...new Set<string>(allCities)].sort());
        }
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => fetchEvents());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents(1, search, city);
  };

  const clearFilters = () => {
    setSearch("");
    setCity("");
    fetchEvents(1, "", "");
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />

      <div className="pt-[72px]">
        <div className="bg-white border-b border-brand-border px-4 md:px-16 py-4">
          <div className="max-w-[1200px] mx-auto flex flex-wrap items-center gap-3">
            <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Cari event, artis, venue..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white text-on-surface pl-10 pr-4 h-[40px] rounded-xl border border-brand-border focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm placeholder:text-on-surface-variant/50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={16} />
            </form>

            <div className="relative">
              <select
                value={city}
                onChange={(e) => { setCity(e.target.value); fetchEvents(1, search, e.target.value); }}
                className="h-[40px] pl-9 pr-8 rounded-xl border border-brand-border bg-white text-on-surface-variant text-sm font-medium hover:bg-surface-container-low transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Semua Lokasi</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={14} />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={14} />
            </div>
          </div>

          {(search || city) && (
            <div className="max-w-[1200px] mx-auto flex flex-wrap items-center gap-2 mt-3">
              {search && (
                <span className="bg-primary-container/10 text-primary-container px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                  {search}
                  <button onClick={() => { setSearch(""); fetchEvents(1, "", city); }} className="cursor-pointer hover:text-primary-container/70">
                    <X size={12} />
                  </button>
                </span>
              )}
              {city && (
                <span className="bg-primary-container/10 text-primary-container px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                  {city}
                  <button onClick={() => { setCity(""); fetchEvents(1, search, ""); }} className="cursor-pointer hover:text-primary-container/70">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-on-surface-variant font-medium hover:text-primary cursor-pointer ml-1">
                Hapus semua
              </button>
            </div>
          )}
        </div>

        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-16 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface">Jelajahi Event</h1>
              <p className="text-on-surface-variant mt-1 text-sm">{total} event ditemukan</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="animate-spin text-primary-container" size={32} />
              <p className="text-on-surface-variant text-sm">Memuat event...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center mx-auto mb-4">
                <Search className="text-primary-container" size={24} />
              </div>
              <p className="text-on-surface font-display font-semibold text-lg mb-1">Tidak ada event ditemukan</p>
              <p className="text-on-surface-variant text-sm mb-6">Coba kata kunci lain atau hapus filter</p>
              <button onClick={clearFilters} className="px-5 py-2.5 bg-primary-container text-white rounded-xl font-semibold text-sm cursor-pointer hover:bg-brand-primary-dark transition-colors">
                Hapus Filter
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => fetchEvents(page - 1, search, city)}
                    disabled={page <= 1}
                    className="p-2 rounded-lg border border-brand-border bg-white hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-on-surface-variant cursor-pointer"
                    aria-label="Halaman sebelumnya"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchEvents(p, search, city)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all cursor-pointer ${p === page ? "bg-primary-container text-white" : "border border-brand-border bg-white text-on-surface-variant hover:bg-surface-container-low"}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => fetchEvents(page + 1, search, city)}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg border border-brand-border bg-white hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-on-surface-variant cursor-pointer"
                    aria-label="Halaman berikutnya"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

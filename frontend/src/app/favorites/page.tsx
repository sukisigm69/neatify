"use client";

import { useEffect, useState } from "react";
import { api, useAuthStore, useFavoriteStore, Event } from "@/lib/store";
import { Heart, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import Link from "next/link";

export default function FavoritesPage() {
  const { token, checkAuth, loading: authLoading } = useAuthStore();
  const { favorites, load } = useFavoriteStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    load();
  }, []);

  useEffect(() => {
    if (favorites.size === 0) return;
    const fetchFavoriteEvents = async () => {
      setLoading(true);
      try {
        const res = await api.get("/events", { params: { limit: 100 } });
        if (res.data.success) {
          const favEvents = res.data.data.events.filter((e: Event) => favorites.has(e.id));
          setEvents(favEvents);
        }
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    };
    fetchFavoriteEvents();
  }, [favorites]);

  if (!authLoading && !token) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-[72px]">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center mx-auto mb-4">
              <Heart className="text-primary-container" size={24} />
            </div>
            <p className="font-display font-semibold text-lg text-on-surface mb-1">Masuk untuk melihat favorit</p>
            <p className="text-on-surface-variant text-sm mb-6">Simpan event favoritmu dan akses kapan saja</p>
            <Link href="/login" className="px-6 py-2.5 rounded-xl bg-primary-container text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors inline-block">
              Masuk
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-10">
          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface">Favorit Saya</h1>
            <p className="text-on-surface-variant mt-1.5 text-sm">Event yang kamu simpan</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="animate-spin text-primary-container" size={32} />
              <p className="text-on-surface-variant text-sm">Memuat favorit...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary-container" size={24} />
              </div>
              <p className="font-display font-semibold text-lg text-on-surface mb-1">Belum ada favorit</p>
              <p className="text-on-surface-variant text-sm mb-6">Jelajahi event dan simpan yang kamu suka</p>
              <Link href="/events/search" className="px-6 py-2.5 rounded-xl bg-primary-container text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors inline-flex items-center gap-1.5">
                Jelajahi Event
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <FavoriteEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FavoriteEventCard({ event }: { event: Event }) {
  const { toggle, isFavorite } = useFavoriteStore();

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.preventDefault(); toggle(event.id); }}
        className="absolute top-3 left-3 z-10 p-2 rounded-lg bg-white/95 backdrop-blur-sm text-red-500 shadow-sm hover:bg-white transition-all cursor-pointer"
        aria-label="Hapus dari favorit"
      >
        <Heart size={14} fill={isFavorite(event.id) ? "currentColor" : "none"} />
      </button>
      <EventCard event={event} />
    </div>
  );
}

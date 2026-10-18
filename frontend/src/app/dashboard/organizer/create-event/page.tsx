"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/RoleGuard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api, Artist, Venue, useAuthStore } from "@/lib/store";
import { Calendar, Loader2, Plus, Trash2, UserRoundPlus } from "lucide-react";

const navItems = [
  { label: "Buat Event", icon: <Calendar size={18} /> },
];

type TicketInput = {
  name: string;
  price: string;
  quota: string;
};

function CreateEventContent() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [venueId, setVenueId] = useState("");
  const [artistIds, setArtistIds] = useState<string[]>([]);
  const [showArtistForm, setShowArtistForm] = useState(false);
  const [artistName, setArtistName] = useState("");
  const [artistGenre, setArtistGenre] = useState("");
  const [savingArtist, setSavingArtist] = useState(false);
  const [artistError, setArtistError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tickets, setTickets] = useState<TicketInput[]>([{ name: "Regular", price: "", quota: "" }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      const errors: string[] = [];

      try {
        const venueRes = await api.get("/venues", { params: { limit: 100 } });
        if (venueRes.data.success) {
          setVenues(venueRes.data.data.venues ?? venueRes.data.data);
        }
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        errors.push(error.response?.data?.message || "Venue gagal dimuat");
      }

      try {
        const artistRes = await api.get("/artists", { params: { limit: 100 } });
        if (artistRes.data.success) {
          setArtists(artistRes.data.data.artists ?? artistRes.data.data);
        }
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        errors.push(error.response?.data?.message || "Artis gagal dimuat");
      }

      if (errors.length > 0) {
        setError(errors.join(". "));
      }
      setLoading(false);
    };
    loadOptions();
  }, []);

  const toggleArtist = (id: string) => {
    setArtistIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const createArtist = async () => {
    setArtistError("");

    if (artistName.trim().length < 2) {
      setArtistError("Nama artis minimal 2 karakter.");
      return;
    }

    setSavingArtist(true);
    try {
      const response = await api.post("/artists", {
        name: artistName.trim(),
        ...(artistGenre.trim() ? { genre: artistGenre.trim() } : {}),
      });
      const artist = response.data.data as Artist;
      setArtists((current) => [artist, ...current]);
      setArtistIds((current) => [...current, artist.id]);
      setArtistName("");
      setArtistGenre("");
      setShowArtistForm(false);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setArtistError(error.response?.data?.message || "Artis gagal ditambahkan. Coba lagi.");
    } finally {
      setSavingArtist(false);
    }
  };

  const updateTicket = (index: number, key: keyof TicketInput, value: string) => {
    setTickets((current) => current.map((ticket, i) => i === index ? { ...ticket, [key]: value } : ticket));
  };

  const addTicket = () => {
    setTickets((current) => [...current, { name: "", price: "", quota: "" }]);
  };

  const removeTicket = (index: number) => {
    setTickets((current) => current.length === 1 ? current : current.filter((_, i) => i !== index));
  };

  const submitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!venueId || !title.trim() || !description.trim() || !startDate || !endDate) {
      setError("Lengkapi data event utama.");
      return;
    }

    const ticketCategories = tickets
      .filter((ticket) => ticket.name.trim() && ticket.price && ticket.quota)
      .map((ticket) => ({
        name: ticket.name.trim(),
        price: Number(ticket.price),
        quota: Number(ticket.quota),
      }));

    if (ticketCategories.length === 0) {
      setError("Tambahkan minimal satu kategori tiket.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        venueId,
        title: title.trim(),
        description: description.trim(),
        ...(banner.trim() ? { banner: banner.trim() } : {}),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        artistIds,
        ticketCategories,
      };
      await api.post("/events", payload);
      router.push("/dashboard/organizer");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string; errors?: { field: string; message: string }[] } } };
      const details = error.response?.data?.errors?.map((item) => `${item.field}: ${item.message}`).join(". ");
      setError(details || error.response?.data?.message || "Gagal membuat event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[860px]">
      <div className="mb-8">
        <h2 className="font-display text-xl font-bold text-on-surface">Buat Event Baru</h2>
        <p className="text-sm text-on-surface-variant mt-0.5">Isi detail event, tiket, venue, dan artis tampil.</p>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Loader2 className="animate-spin text-primary-container mx-auto mb-3" size={32} />
          <p className="text-sm text-on-surface-variant">Memuat data...</p>
        </div>
      ) : (
        <form onSubmit={submitEvent} className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-semibold text-on-surface">Informasi Event</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Judul Event</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm" placeholder="Contoh: Tulus Live in Jakarta" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Deskripsi</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm" placeholder="Ceritakan detail event, lineup, dan informasi penting." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Mulai</label>
                <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Selesai</label>
                <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Banner URL (Opsional)</label>
                <input value={banner} onChange={(e) => setBanner(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm" placeholder="https://..." />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-semibold text-on-surface">Venue dan Artis</h3>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Venue</label>
              <select value={venueId} onChange={(e) => setVenueId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm cursor-pointer">
                <option value="">Pilih venue</option>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>{venue.name}, {venue.city}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Artis</label>
                <button
                  type="button"
                  onClick={() => {
                    setArtistError("");
                    setShowArtistForm((visible) => !visible);
                  }}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-border bg-white/70 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-white"
                >
                  <UserRoundPlus size={16} />
                  Tambah artis
                </button>
              </div>
              {showArtistForm && (
                <div role="group" aria-labelledby="new-artist-heading" className="mb-4 rounded-xl border border-brand-border bg-white/70 p-4">
                  <p id="new-artist-heading" className="mb-3 text-sm font-semibold text-on-surface">Artis baru akan ditambahkan ke lineup event ini.</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="new-artist-name" className="mb-1.5 block text-xs font-semibold text-on-surface-variant">Nama artis</label>
                      <input
                        id="new-artist-name"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        maxLength={100}
                        required
                        className="w-full rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Nama artis atau band"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-artist-genre" className="mb-1.5 block text-xs font-semibold text-on-surface-variant">Genre (opsional)</label>
                      <input
                        id="new-artist-genre"
                        value={artistGenre}
                        onChange={(e) => setArtistGenre(e.target.value)}
                        maxLength={50}
                        className="w-full rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Contoh: Pop"
                      />
                    </div>
                  </div>
                  {artistError && <p role="alert" className="mt-3 text-sm text-error">{artistError}</p>}
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowArtistForm(false)}
                      disabled={savingArtist}
                      className="min-h-11 rounded-xl px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-white disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => void createArtist()}
                      disabled={savingArtist}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-container px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-dark disabled:opacity-50"
                    >
                      {savingArtist && <Loader2 size={15} className="animate-spin" />}
                      Simpan artis
                    </button>
                  </div>
                </div>
              )}
              {artists.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {artists.map((artist) => (
                    <button
                      key={artist.id}
                      type="button"
                      aria-pressed={artistIds.includes(artist.id)}
                      onClick={() => toggleArtist(artist.id)}
                      className={`min-h-11 rounded-xl border px-3 py-2 text-sm transition-colors ${artistIds.includes(artist.id) ? "border-primary-container bg-primary-container text-white" : "border-brand-border bg-white/70 text-on-surface-variant hover:bg-white"}`}
                    >
                      {artist.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-brand-border px-4 py-3 text-sm text-on-surface-variant">
                  Belum ada artis. Tambahkan artis baru untuk lineup event ini.
                </p>
              )}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-on-surface">Kategori Tiket</h3>
              <button type="button" onClick={addTicket} className="px-3 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-brand-primary-dark transition-colors flex items-center gap-1.5 cursor-pointer">
                <Plus size={14} /> Tambah
              </button>
            </div>
            <div className="space-y-3">
              {tickets.map((ticket, index) => (
                <div key={index} className="grid md:grid-cols-[1fr_140px_120px_44px] gap-3 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Nama</label>
                    <input value={ticket.name} onChange={(e) => updateTicket(index, "name", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm" placeholder="Regular" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Harga</label>
                    <input type="number" value={ticket.price} onChange={(e) => updateTicket(index, "price", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm" placeholder="150000" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Kuota</label>
                    <input type="number" value={ticket.quota} onChange={(e) => updateTicket(index, "quota", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm" placeholder="100" />
                  </div>
                  <button type="button" onClick={() => removeTicket(index)} className="h-[42px] rounded-xl border border-brand-border text-error hover:bg-error-container/40 transition-colors flex items-center justify-center cursor-pointer" aria-label="Hapus tiket">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => router.push("/dashboard/organizer")} className="px-5 py-2.5 rounded-xl border border-brand-border bg-white/70 text-sm font-semibold text-on-surface hover:bg-white transition-colors cursor-pointer">Batal</button>
            <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-xl bg-primary-container text-white text-sm font-semibold hover:bg-brand-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer">
              {submitting && <Loader2 className="animate-spin" size={16} />}
              Simpan Event
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function CreateEventPage() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <RoleGuard allow={["ORGANIZER", "ADMIN", "SUPER_ADMIN"]}>
      <DashboardLayout title="Buat Event" subtitle="Organizer" navItems={navItems}>
        <CreateEventContent />
      </DashboardLayout>
    </RoleGuard>
  );
}

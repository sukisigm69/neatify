"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { LogOut, Menu, X, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

export function Navbar() {
  const { user, token, logout, loading } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  const isAuthed = mounted && !!token;
  const role = user?.roles?.name;
  const showDashboard = role === "ORGANIZER" || role === "ADMIN" || role === "SUPER_ADMIN";

  const dashboardHref =
    role === "SUPER_ADMIN" ? "/dashboard/super-admin" :
    role === "ADMIN" ? "/dashboard/admin" :
    role === "ORGANIZER" ? "/dashboard/organizer" : "/";

  return (
    <header className="fixed top-0 w-full glass border-b border-white/40 z-50">
      <div className="flex justify-between items-center px-4 md:px-16 py-3 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-primary">
            Konsera
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/events/search" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
              Concerts
            </Link>
            {isAuthed && (
              <Link href="/favorites" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
                Favorites
              </Link>
            )}
            {isAuthed && (
              <Link href="/tickets" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
                My Tickets
              </Link>
            )}
            {isAuthed && showDashboard && (
              <Link href={dashboardHref} className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5">
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {mounted && !loading && (
            user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-on-surface">{user.name}</span>
                </Link>
                <button onClick={() => setShowLogoutDialog(true)} className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant cursor-pointer" aria-label="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
                  Masuk
                </Link>
                <Link href="/register" className="px-5 py-2 rounded-xl bg-primary-container text-white text-sm font-medium hover:bg-brand-primary-dark transition-colors">
                  Daftar
                </Link>
              </div>
            )
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface cursor-pointer" aria-label="Toggle menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-brand-border/50 px-4 py-4 space-y-1 animate-slide-down">
          <Link href="/events/search" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">Concerts</Link>
          {isAuthed && <Link href="/favorites" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">Favorites</Link>}
          {isAuthed && <Link href="/tickets" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">My Tickets</Link>}
          {isAuthed && <Link href="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">Profile</Link>}
          {isAuthed && showDashboard && <Link href={dashboardHref} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-surface-container-low transition-colors">Dashboard</Link>}
        </div>
      )}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Keluar"
        message="Yakin ingin keluar? Kamu perlu login kembali untuk mengakses tiket dan pesanan."
        confirmText="Keluar"
        cancelText="Batal"
        danger
      />
    </header>
  );
}

"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-[72px] px-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="relative mx-auto mb-8 w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-brand-sage/20 animate-pulse-slow" />
            <div className="absolute inset-3 rounded-full bg-brand-cream flex items-center justify-center">
              <span className="font-display text-5xl font-extrabold text-primary-container">404</span>
            </div>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface mb-3">
            Page not found
          </h1>
          <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-full bg-primary-container text-white text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <Home size={15} /> Go Home
            </Link>
            <Link
              href="/events/search"
              className="px-6 py-2.5 rounded-full border border-brand-border bg-white text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors inline-flex items-center gap-2"
            >
              <Search size={15} /> Browse Events
            </Link>
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-5 text-sm text-on-surface-variant hover:text-primary-container transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={14} /> Go back
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

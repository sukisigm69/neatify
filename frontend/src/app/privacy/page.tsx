import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px] px-4 md:px-16 py-12 animate-slide-up">
        <div className="max-w-[800px] mx-auto bg-white border border-brand-border rounded-2xl p-6 md:p-10 shadow-subtle">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-container mb-3">Legal</p>
          <h1 className="font-display text-3xl font-bold text-on-surface mb-4">Privacy Policy</h1>
          <p className="text-on-surface-variant leading-relaxed mb-6">Konsera protects your account, booking, and payment-related data. We only collect information needed to provide event discovery, ticket booking, order history, and customer support.</p>
          <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
            <p>We do not sell your personal information. Payment details are handled by trusted payment providers and are not stored directly by Konsera.</p>
            <p>You can update your profile information from your account page. Contact support if you need account or data assistance.</p>
          </div>
          <Link href="/" className="inline-flex mt-8 px-5 py-2.5 rounded-full bg-primary-container text-white text-sm font-medium hover:opacity-90 transition-opacity">Back Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

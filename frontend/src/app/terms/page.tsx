import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px] px-4 md:px-16 py-12 animate-slide-up">
        <div className="max-w-[800px] mx-auto bg-white border border-brand-border rounded-2xl p-6 md:p-10 shadow-subtle">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-container mb-3">Legal</p>
          <h1 className="font-display text-3xl font-bold text-on-surface mb-4">Terms of Service</h1>
          <p className="text-on-surface-variant leading-relaxed mb-6">By using Konsera, you agree to these terms. Konsera is a platform for discovering and booking live concert tickets.</p>
          <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
            <div>
              <p className="font-semibold text-on-surface mb-1">User Accounts</p>
              <p>You are responsible for keeping your login credentials confidential. You must provide accurate information when registering.</p>
            </div>
            <div>
              <p className="font-semibold text-on-surface mb-1">Ticket Purchases</p>
              <p>Tickets are non-transferable unless stated otherwise. Refunds are subject to event organizer policy. Konsera is not responsible for cancellations or changes made by organizers.</p>
            </div>
            <div>
              <p className="font-semibold text-on-surface mb-1">Limitation of Liability</p>
              <p>Konsera provides the platform as-is. We are not liable for missed events, technical issues, or organizer actions beyond our control.</p>
            </div>
          </div>
          <Link href="/" className="inline-flex mt-8 px-5 py-2.5 rounded-full bg-primary-container text-white text-sm font-medium hover:opacity-90 transition-opacity">Back Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MessageCircle, Mail, Phone, Clock } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px] px-4 md:px-16 py-12 animate-slide-up">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white border border-brand-border rounded-2xl p-6 md:p-10 shadow-subtle mb-6">
            <h1 className="font-display text-3xl font-bold text-on-surface mb-2">Help & Support</h1>
            <p className="text-on-surface-variant">Get assistance with your Konsera account and ticket bookings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-brand-border rounded-xl p-5 shadow-subtle hover:shadow-card-hover transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center mb-3">
                <Mail size={18} className="text-primary-container" />
              </div>
              <h3 className="font-semibold text-on-surface mb-1">Email Support</h3>
              <p className="text-sm text-on-surface-variant">support@konsera.id</p>
              <p className="text-xs text-on-surface-variant mt-2">Response within 24 hours</p>
            </div>

            <div className="bg-white border border-brand-border rounded-xl p-5 shadow-subtle hover:shadow-card-hover transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center mb-3">
                <MessageCircle size={18} className="text-primary-container" />
              </div>
              <h3 className="font-semibold text-on-surface mb-1">Live Chat</h3>
              <p className="text-sm text-on-surface-variant">Available on the website</p>
              <p className="text-xs text-on-surface-variant mt-2">Mon-Fri 9 AM - 6 PM</p>
            </div>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-6 md:p-10 shadow-subtle">
            <h2 className="font-display text-xl font-bold text-on-surface mb-4">FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-on-surface mb-1">How do I reset my password?</h3>
                <p className="text-sm text-on-surface-variant">Click "Forgot password" on the login page and follow the instructions sent to your email.</p>
              </div>
              <div>
                <h3 className="font-semibold text-on-surface mb-1">Can I transfer my ticket to someone else?</h3>
                <p className="text-sm text-on-surface-variant">Ticket transferability depends on the organizer. Check the event details or contact support.</p>
              </div>
              <div>
                <h3 className="font-semibold text-on-surface mb-1">What payment methods are accepted?</h3>
                <p className="text-sm text-on-surface-variant">We accept credit/debit cards, bank transfers, and e-wallets via our payment partner Midtrans.</p>
              </div>
              <div>
                <h3 className="font-semibold text-on-surface mb-1">How do I use my ticket?</h3>
                <p className="text-sm text-on-surface-variant">Go to "My Tickets" after purchase. Present the QR code at the event venue for entry.</p>
              </div>
            </div>
          </div>

          <Link href="/" className="inline-flex mt-8 px-5 py-2.5 rounded-full bg-primary-container text-white text-sm font-medium hover:opacity-90 transition-opacity">Back Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

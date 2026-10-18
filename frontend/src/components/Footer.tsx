import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-brand-border/50 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-16 py-8 max-w-[1200px] mx-auto w-full gap-6">
        <div className="text-center md:text-left">
          <div className="font-display text-base font-bold text-primary mb-1">Konsera</div>
          <p className="text-sm text-on-surface-variant">&copy; {new Date().getFullYear()} Konsera. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link href="/privacy" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="/help" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Help Center</Link>
        </div>
      </div>
    </footer>
  );
}

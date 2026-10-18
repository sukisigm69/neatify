import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg flex">
      <div className="hidden lg:flex lg:w-1/2 bg-brand-heading relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white font-display font-bold text-base">K</div>
            <span className="font-display font-bold text-xl text-white tracking-tight">Konsera</span>
          </Link>
          <div className="flex-1 flex flex-col justify-center max-w-sm">
            <h2 className="font-display text-4xl font-extrabold text-white leading-tight mb-4">
              Temukan. Pesan.<br />
              <span className="text-brand-accent">Rasakan.</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed">
              Akses ribuan konser terbaik di seluruh Indonesia.
            </p>
          </div>
          <p className="text-white/25 text-sm">&copy; {new Date().getFullYear()} Konsera</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="lg:hidden p-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white font-display font-bold text-base">K</div>
            <span className="font-display font-bold text-xl text-brand-heading tracking-tight">Konsera</span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}

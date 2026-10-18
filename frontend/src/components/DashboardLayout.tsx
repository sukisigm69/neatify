"use client";

import { useAuthStore } from "@/lib/store";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  tab?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  navItems: NavItem[];
}

export function DashboardLayout({ children, title, subtitle, navItems }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(navItems[0]?.tab ?? navItems[0]?.label ?? "");

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass border-r border-white/40 flex flex-col transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-brand-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-white font-display font-bold text-sm">K</div>
            <span className="font-display font-bold text-lg text-primary tracking-tight">Konsera</span>
          </div>
        </div>

        <div className="px-3 py-4">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-2">{subtitle}</p>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  item.onClick?.();
                  if (item.tab) {
                    setActiveTab(item.tab);
                    window.dispatchEvent(new CustomEvent("dashboard-tab-change", { detail: item.tab }));
                  } else {
                    setActiveTab(item.label);
                  }
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${(item.active ?? activeTab === (item.tab ?? item.label)) ? "bg-primary-container/10 text-primary-container" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-brand-border">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{user.name}</p>
                <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
              </div>
              <button onClick={() => setShowLogoutDialog(true)} className="p-1.5 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant cursor-pointer" aria-label="Logout">
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 glass border-b border-white/40 px-4 md:px-8 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface cursor-pointer" aria-label="Open sidebar">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="font-display text-lg font-bold text-on-surface">{title}</h1>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>

      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Keluar"
        message="Yakin ingin keluar dari dashboard?"
        confirmText="Keluar"
        cancelText="Batal"
        danger
      />
    </div>
  );
}

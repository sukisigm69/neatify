import React from "react";

interface EmptyStateProps {
  title: string;
  message: string;
  icon: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon }) => {
  return (
    <div className="text-center py-20 bg-brand-surface rounded-xl border border-brand-border/50 p-6 shadow-card">
      <div className="w-14 h-14 rounded-xl bg-brand-muted flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <p className="font-display font-semibold text-lg text-brand-heading mb-1">{title}</p>
      <p className="text-brand-paragraph text-sm max-w-sm mx-auto">{message}</p>
    </div>
  );
};

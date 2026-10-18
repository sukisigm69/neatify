import React from "react";

interface SkeletonCardProps {
  type: "ticket" | "order";
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ type }) => {
  return (
    <div className={`animate-pulse bg-brand-surface rounded-xl border border-brand-border/50 ${type === "ticket" ? "h-80" : "h-28"} p-5`}>
      <div className={`w-full ${type === "ticket" ? "h-36" : "h-8"} bg-brand-muted rounded-lg mb-5`}></div>
      <div className="space-y-2">
        <div className="w-2/3 h-4 bg-brand-muted rounded"></div>
        <div className="w-1/2 h-3.5 bg-brand-muted rounded"></div>
      </div>
    </div>
  );
};

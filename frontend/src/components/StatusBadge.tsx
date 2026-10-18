import React from "react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getColors = (st: string) => {
    switch (st.toUpperCase()) {
      case "ACTIVE":
      case "CONFIRMED":
      case "PAID":
      case "SETTLEMENT":
      case "SUCCESS":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "PENDING":
      case "WAITING":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "CANCELLED":
      case "FAILED":
      case "DENY":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      case "EXPIRED":
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
      case "REFUNDED":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getColors(status)}`}>
      {status.toUpperCase()}
    </span>
  );
};

import React from "react";

const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
  trend,
  showAccent = true,
}) => {
  return (
    <div
      className={`glass-card relative overflow-hidden p-5 sm:p-6 hover:scale-[1.02] active:scale-[0.99] group ${
        showAccent ? "gold-accent-line" : ""
      }`}
    >
      {/* Background radial highlight */}
      <div className="absolute -right-12 -top-12 w-24 h-24 bg-silgate-tertiary/5 rounded-full blur-2xl group-hover:bg-silgate-tertiary/10 transition-all duration-300" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="p-3 bg-silgate-primary/[0.04] border border-silgate-primary/[0.06] rounded-xl group-hover:bg-silgate-tertiary/10 group-hover:border-silgate-tertiary/20 transition-all duration-300">
          <Icon
            size={18}
            className="text-silgate-secondary group-hover:text-silgate-tertiary transition-colors duration-300"
          />
        </div>

        {trend !== undefined && (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-all duration-300 ${
              trend > 0
                ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/50"
                : "bg-rose-50/80 text-rose-700 border-rose-200/50"
            }`}
          >
            <span className="text-[9px]">{trend > 0 ? "▲" : "▼"}</span>
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-bold tracking-[0.2em] text-silgate-secondary uppercase mb-1.5 transition-colors duration-300 group-hover:text-silgate-secondary/80">
          {label}
        </p>

        <p className="text-2xl sm:text-3xl font-extrabold text-silgate-primary tracking-tight mb-2 group-hover:text-silgate-primary/90 transition-colors duration-300">
          {value}
        </p>

        {description && (
          <p className="text-[11px] text-silgate-secondary/70 font-medium leading-relaxed mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-silgate-tertiary/60 shrink-0" />
            <span className="truncate">{description}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;

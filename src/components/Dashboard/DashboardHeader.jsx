import React from "react";
import { Users, ClipboardList, Calendar, RefreshCw } from "lucide-react";

const DashboardHeader = ({ role, onRefresh, isLoading }) => {
  const isSuperadmin = role === "superadmin";

  return (
    <div className="bg-gradient-to-r from-[#091426] via-[#0f2e5c] to-[#12284c] rounded-2xl p-6 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8 shadow-lg relative overflow-hidden select-none border border-[#091f3f]/50">
      {/* Glossy premium radial overlays */}
      <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -top-12 w-48 h-48 bg-[#ffb95f]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Left section: Icons & Titles */}
      <div className="flex items-center gap-4.5 relative z-10">
        <div className="flex gap-2 shrink-0">
          <div className="w-10 h-10 border border-white/15 rounded-xl flex items-center justify-center bg-white/10 shadow-inner">
            <Users size={18} className="text-white" />
          </div>
          <div className="w-10 h-10 border border-white/15 rounded-xl flex items-center justify-center bg-white/10 shadow-inner">
            <ClipboardList size={18} className="text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-wider uppercase leading-tight bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
            RECRUITMENT PROGRESSIVE REPORT
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f] animate-pulse" />
            <p className="text-[10px] md:text-xs text-white/70 font-semibold tracking-wide uppercase">
              {isSuperadmin ? "Summary Dashboard (Superadmin Access)" : "Summary Dashboard"}
            </p>
          </div>
        </div>
      </div>

      {/* Right section: Calendar Info & Refresh trigger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0 lg:self-center relative z-10">
        <div className="flex items-center gap-3 bg-white/10 border border-white/10 px-4.5 py-2.5 rounded-xl shadow-sm">
          <Calendar size={16} className="text-[#ffb95f] shrink-0" />
          <div className="text-[10px] md:text-xs text-left">
            <p className="font-semibold text-white/90 leading-tight">
              Report Date: <span className="font-extrabold text-[#ffb95f]">{new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </p>
            <p className="font-medium text-white/60 mt-1 leading-none">
              Data Source: <span className="font-semibold text-white/90">Recruitment Database</span>
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0f2e5c] text-xs font-bold hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer shadow-sm border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed shrink-0 font-sans"
        >
          <RefreshCw
            size={13}
            className={`transition-transform duration-500 shrink-0 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;

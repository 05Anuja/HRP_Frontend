import React, { useState } from "react";
import { Users, FileText, User, Briefcase, Send, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Label,
} from "recharts";

const DashboardSkeletonCard = () => (
  <div className="glass-card relative overflow-hidden p-6 border border-silgate-outline-variant/15 rounded-xl">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
      <div className="w-12 h-5 rounded-full skeleton-shimmer" />
    </div>
    <div className="w-24 h-3.5 rounded-md skeleton-shimmer mb-3" />
    <div className="w-16 h-8 rounded-lg skeleton-shimmer mb-3.5" />
    <div className="w-36 h-3 rounded-md skeleton-shimmer" />
  </div>
);

const chartColors = [
  "#0f2e5c", // Deep Blue
  "#0d9488", // Teal
  "#7c3aed", // Purple
  "#ea580c", // Orange
  "#0284c7", // Sky Blue
  "#e11d48", // Rose
];

// Premium Custom Chart Tooltips matching Silgate solutions styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f2e5c]/95 backdrop-blur-md text-white border border-[#091f3f] px-3.5 py-2.5 rounded-xl text-[11px] shadow-2xl select-none font-sans">
        <p className="font-extrabold uppercase text-[9px] tracking-wider text-silgate-tertiary mb-1">{label}</p>
        <p className="font-semibold text-white/90">
          Shared: <span className="font-extrabold text-white">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomDesigTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f2e5c]/95 backdrop-blur-md text-white border border-[#091f3f] px-3.5 py-2.5 rounded-xl text-[11px] shadow-2xl select-none font-sans">
        <p className="font-extrabold uppercase text-[9px] tracking-wider text-silgate-tertiary mb-1">
          {payload[0].payload.designation}
        </p>
        <p className="font-medium text-white/90">
          Profiles: <span className="font-extrabold text-white">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const StatsGrid = ({ role, data, isLoading, selectedFilters }) => {
  const isSuperadmin = role === "superadmin";
  const isSilgate = selectedFilters?.projectId === "silgate";

  // Interactive UI Linkage States
  const [activeHr, setActiveHr] = useState(null);
  const [activeDesig, setActiveDesig] = useState(null);
  const [activeSource, setActiveSource] = useState(null);

  if (isLoading && !data) {
    const cardCount = isSuperadmin ? 5 : 4;
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSuperadmin ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-6 mb-8`}>
        {[...new Array(cardCount)].map((_, i) => (
          <DashboardSkeletonCard key={`stat-skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const reportStats = data.reportStats || {
    totalProfilesShared: 0,
    totalHRs: 0,
    totalDesignations: 0,
    resumeSent: 0,
    resumeNotSent: 0,
    silgateInterested: 0,
    silgateNotInterested: 0,
    hrWiseSummary: [],
    designationWiseSummary: [],
    sourceWiseSummary: []
  };

  // KPI metadata with exact matching color schemes and left accent borders
  const kpiCards = [
    {
      label: "TOTAL PROFILES SHARED",
      value: reportStats.totalProfilesShared,
      icon: Users,
      iconBg: "bg-blue-50/80 border-blue-200/50",
      iconColor: "text-blue-600",
      textColor: "text-blue-700",
      valueColor: "text-blue-900",
      borderL: "border-l-4 border-l-blue-500"
    },
    ...(isSuperadmin ? [{
      label: "TOTAL HRs",
      value: reportStats.totalHRs,
      icon: User,
      iconBg: "bg-emerald-50/80 border-emerald-200/50",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-700",
      valueColor: "text-emerald-900",
      borderL: "border-l-4 border-l-emerald-500"
    }] : []),
    {
      label: "TOTAL DESIGNATIONS",
      value: reportStats.totalDesignations,
      icon: Briefcase,
      iconBg: "bg-purple-50/80 border-purple-200/50",
      iconColor: "text-purple-600",
      textColor: "text-purple-700",
      valueColor: "text-purple-900",
      borderL: "border-l-4 border-l-purple-500"
    },
    {
      label: isSilgate ? "LINEUP INTERESTED" : "RESUME SENT",
      value: isSilgate ? reportStats.silgateInterested : reportStats.resumeSent,
      icon: Send,
      iconBg: "bg-orange-50/80 border-orange-200/50",
      iconColor: "text-orange-500",
      textColor: "text-orange-600",
      valueColor: "text-orange-800",
      borderL: "border-l-4 border-l-orange-500"
    },
    {
      label: isSilgate ? "OTHER DISPOSITION" : "RESUME NOT SENT",
      value: isSilgate ? reportStats.silgateNotInterested : reportStats.resumeNotSent,
      icon: FileText,
      iconBg: "bg-teal-50/80 border-teal-200/50",
      iconColor: "text-teal-500",
      textColor: "text-teal-600",
      valueColor: "text-teal-800",
      borderL: "border-l-4 border-l-teal-500"
    }
  ];

  return (
    <div className="space-y-6 mb-6 fade-in-slide">
      {/* KPI Stat Cards Row matching screenshot layout */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${isSuperadmin ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-4`}>
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`group bg-white rounded-xl border border-silgate-outline-variant/15 p-5 flex items-center gap-4.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left select-none ${card.borderL}`}
            >
              {/* Circular Icon Frame with micro-zoom interaction */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${card.iconBg} border shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={20} className={card.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${card.textColor} truncate`}>
                  {card.label}
                </span>
                <span className={`text-2xl font-extrabold block mt-0.5 ${card.valueColor || card.textColor}`}>
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3-Column Recruitment progressive Report Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: HR WISE SUMMARY */}
        <div className="bg-white border border-silgate-outline-variant/15 rounded-xl shadow-sm flex flex-col overflow-hidden text-left">
          {/* Header Banner matching screenshot */}
          <div className="bg-[#0f2e5c] text-white text-center font-bold text-[11px] uppercase tracking-wider py-2 select-none shrink-0 border-b border-[#0a2040]">
            1. HR WISE SUMMARY
          </div>

          <div className="p-4 flex flex-col justify-center min-h-[420px]">
            {/* Vertical Bar Chart - expanded to fill card height */}
            <div className="h-[380px] w-full shrink-0">
              {reportStats.hrWiseSummary.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No operator stats logged
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reportStats.hrWiseSummary}
                    margin={{ top: 25, right: 10, left: -10, bottom: 25 }}
                    onMouseMove={(state) => {
                      if (state && state.activeTooltipIndex !== undefined && reportStats.hrWiseSummary[state.activeTooltipIndex]) {
                        setActiveHr(reportStats.hrWiseSummary[state.activeTooltipIndex].hrName);
                      } else {
                        setActiveHr(null);
                      }
                    }}
                    onMouseLeave={() => setActiveHr(null)}
                  >
                    <defs>
                      <linearGradient id="hrBarGradBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.85} />
                        <stop offset="100%" stopColor="#0f2e5c" stopOpacity={0.95} />
                      </linearGradient>
                      <linearGradient id="hrBarGradTeal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.85} />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity={0.95} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(117,119,125,0.06)" />
                    <XAxis dataKey="hrName" fontSize={9} stroke="#75777d" tickLine={false}>
                      <Label
                        value="HR List"
                        position="insideBottom"
                        offset={-5}
                        style={{ textAnchor: "middle", fontSize: 10, fontWeight: "bold", fill: "#0f2e5c" }}
                      />
                    </XAxis>
                    <YAxis fontSize={9} stroke="#75777d" tickLine={false}>
                      <Label
                        value="Submission"
                        angle={-90}
                        position="insideLeft"
                        offset={-2}
                        style={{ textAnchor: "middle", fontSize: 10, fontWeight: "bold", fill: "#0f2e5c" }}
                      />
                    </YAxis>
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(15,46,92,0.02)" }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={35}>
                      {reportStats.hrWiseSummary.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index % 2 === 0 ? "url(#hrBarGradBlue)" : "url(#hrBarGradTeal)"}
                          fillOpacity={activeHr === null || activeHr === entry.hrName ? 1 : 0.35}
                          style={{ transition: "fill-opacity 0.2s ease" }}
                        />
                      ))}
                      <LabelList dataKey="count" position="top" fontSize={10} fontWeight="bold" fill="#0f2e5c" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: TOP DESIGNATIONS */}
        <div className="bg-white border border-silgate-outline-variant/15 rounded-xl shadow-sm flex flex-col overflow-hidden text-left">
          {/* Header Banner matching screenshot */}
          <div className="bg-[#0f2e5c] text-white text-center font-bold text-[11px] uppercase tracking-wider py-2 select-none shrink-0 border-b border-[#0a2040]">
            2. TOP DESIGNATIONS (Profiles Shared)
          </div>

          <div className="p-4 flex flex-col min-h-[420px]">
            {/* Horizontal Bar Chart */}
            <div className="h-[380px] w-full">
              {reportStats.designationWiseSummary.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No designations recorded
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={reportStats.designationWiseSummary.slice(0, 15)}
                    margin={{ top: 5, right: 25, left: 5, bottom: 25 }}
                    onMouseMove={(state) => {
                      const list = reportStats.designationWiseSummary.slice(0, 15);
                      if (state && state.activeTooltipIndex !== undefined && list[state.activeTooltipIndex]) {
                        setActiveDesig(list[state.activeTooltipIndex].designation);
                      } else {
                        setActiveDesig(null);
                      }
                    }}
                    onMouseLeave={() => setActiveDesig(null)}
                  >
                    <defs>
                      <linearGradient id="desigBarGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0f2e5c" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.85} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(117,119,125,0.06)" />
                    <XAxis type="number" fontSize={9} stroke="#75777d" tickLine={false}>
                      <Label
                        value="Profiles Shared"
                        position="insideBottom"
                        offset={-5}
                        style={{ textAnchor: "middle", fontSize: 10, fontWeight: "bold", fill: "#0f2e5c" }}
                      />
                    </XAxis>
                    <YAxis
                      type="category"
                      dataKey="designation"
                      fontSize={9}
                      stroke="#75777d"
                      tickLine={false}
                      width={125}
                    />
                    <Tooltip content={<CustomDesigTooltip />} cursor={{ fill: "rgba(15,46,92,0.02)" }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={12}>
                      {reportStats.designationWiseSummary.slice(0, 15).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill="url(#desigBarGrad)"
                          fillOpacity={activeDesig === null || activeDesig === entry.designation ? 1 : 0.35}
                          style={{ transition: "fill-opacity 0.2s ease" }}
                        />
                      ))}
                      <LabelList dataKey="count" position="right" fontSize={9} fontWeight="bold" fill="#0f2e5c" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: SOURCE WISE SUMMARY */}
        <div className="bg-white border border-silgate-outline-variant/15 rounded-xl shadow-sm flex flex-col overflow-hidden text-left">
          {/* Header Banner matching screenshot */}
          <div className="bg-[#0f2e5c] text-white text-center font-bold text-[11px] uppercase tracking-wider py-2 select-none shrink-0 border-b border-[#0a2040]">
            3. SOURCE WISE SUMMARY
          </div>

          {/* Table directly below heading, flush with card margins */}
          <div className="overflow-x-auto w-full flex-grow">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#0f2e5c] text-white font-bold select-none text-[10px] border-b border-[#0a2040]">
                  <th className="px-4 py-2.5 border-r border-white/10 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-2.5 uppercase tracking-wider text-right">Profiles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-silgate-outline-variant/15">
                {reportStats.sourceWiseSummary.map((item, idx) => (
                  <tr
                    key={idx}
                    onMouseEnter={() => setActiveSource(item.source)}
                    onMouseLeave={() => setActiveSource(null)}
                    className={`transition-all duration-200 cursor-pointer ${activeSource === item.source
                        ? "bg-blue-50/70 scale-[1.005] font-semibold text-[#0f2e5c] border-l-2 border-l-[#0f2e5c]"
                        : idx % 2 === 1
                          ? "bg-slate-50/40 text-slate-700"
                          : "bg-white text-slate-700"
                      }`}
                  >
                    <td className="px-4 py-3 border-r border-silgate-outline-variant/10 flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 shrink-0 border border-white shadow-sm rounded-sm transition-transform duration-200 group-hover:scale-110"
                        style={{ backgroundColor: chartColors[idx % chartColors.length] }}
                      />
                      {item.source}
                    </td>
                    <td className="px-4 py-3 text-right font-bold">
                      {item.count} <span className="text-[10px] text-slate-400 font-normal ml-1">({item.percentage}%)</span>
                    </td>
                  </tr>
                ))}
                {reportStats.sourceWiseSummary.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-4 py-4 text-center text-slate-400">No source data logged</td>
                  </tr>
                )}
                <tr className="bg-[#e8f0fe] font-extrabold text-slate-800 border-t border-silgate-outline-variant/25">
                  <td className="px-4 py-3 border-r border-silgate-outline-variant/10">Total</td>
                  <td className="px-4 py-3 text-right">{reportStats.totalProfilesShared}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* HR Wise Summary Table - Rendered outside the card, below the graphs */}
      {reportStats.hrWiseSummary.length > 0 && (
        <div className="space-y-3 mt-4">
          <div className="text-left mb-2.5 select-none">
            <h3 className="text-xs font-extrabold text-[#0f2e5c] uppercase tracking-wider">
              HR Performance Details
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
              Audit trail of total candidate profiles shared by recruitment personnel.
            </p>
          </div>
          <div className="bg-white border border-silgate-outline-variant/15 rounded-xl shadow-sm overflow-hidden text-left w-full select-none">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#0f2e5c] text-white font-bold select-none text-[10px] border-b border-[#0a2040]">
                  <th className="px-4 py-2.5 border-r border-[#0a2040] uppercase tracking-wider">HR Name</th>
                  <th className="px-4 py-2.5 uppercase tracking-wider text-center w-48">Profiles Shared</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-silgate-outline-variant/15">
                {reportStats.hrWiseSummary.map((item, idx) => (
                  <tr
                    key={idx}
                    onMouseEnter={() => setActiveHr(item.hrName)}
                    onMouseLeave={() => setActiveHr(null)}
                    className={`transition-all duration-250 cursor-pointer ${activeHr === item.hrName
                        ? "bg-blue-50/80 scale-[1.002] font-semibold text-[#0f2e5c] border-l-2 border-l-[#0f2e5c]"
                        : idx % 2 === 1
                          ? "bg-slate-50/50 text-slate-700"
                          : "bg-white text-slate-700"
                      }`}
                  >
                    <td className="px-4 py-2.5 border-r border-silgate-outline-variant/10">
                      {item.hrName}
                    </td>
                    <td className="px-4 py-2.5 text-center font-bold">
                      {item.count}
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#e8f0fe] font-extrabold text-slate-800 border-t border-silgate-outline-variant/25">
                  <td className="px-4 py-2.5 border-r border-silgate-outline-variant/10">Total</td>
                  <td className="px-4 py-2.5 text-center">{reportStats.totalProfilesShared}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footnote matching screenshot */}
      <p className="text-[11px] text-[#0f2e5c] italic text-left mt-2 select-none">
        Note: This report is based on the data logged in the Recruitment System database.
      </p>
    </div>
  );
};

export default StatsGrid;

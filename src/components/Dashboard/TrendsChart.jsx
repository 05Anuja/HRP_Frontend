import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, CalendarDays } from "lucide-react";
import { extractChartKeys } from "@/services/dashboardService";

// Professional curated color palette
const chartColors = [
  "#10b981", // Emerald
  "#0ea5e9", // Sky Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#f59e0b", // Amber
  "#f43f5e", // Rose
];

const getChartColor = (index) => {
  return chartColors[index % chartColors.length];
};

const DashboardChartSkeleton = () => (
  <div className="glass-card relative overflow-hidden p-6 border border-silgate-outline-variant/15 rounded-2xl mb-8">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
        <div className="space-y-1.5">
          <div className="w-40 h-4 rounded skeleton-shimmer" />
          <div className="w-24 h-2.5 rounded skeleton-shimmer" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-16 h-8 rounded-lg skeleton-shimmer" />
        <div className="w-16 h-8 rounded-lg skeleton-shimmer" />
      </div>
    </div>
    <div className="w-full h-80 rounded-xl skeleton-shimmer" />
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-4 rounded-xl shadow-xl border border-silgate-outline-variant/15 text-xs text-left">
        <p className="font-extrabold text-silgate-primary mb-2 tracking-wide uppercase text-[9px] flex items-center gap-1.5">
          <CalendarDays size={11} className="text-silgate-tertiary" />
          Interval: {label}
        </p>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-silgate-secondary font-semibold text-[11px] truncate max-w-[120px]">{item.name}</span>
              </div>
              <span className="font-extrabold text-silgate-primary text-[11px]">{item.value} submissions</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const TrendsChart = ({ data, isLoading, title = "Submission Trends" }) => {
  const [chartType, setChartType] = useState("monthly");

  const trendData = useMemo(() => {
    if (!data) return [];
    
    const rawData = chartType === "monthly"
      ? data.monthlySubmissionTrends || []
      : data.weeklySubmissionTrends || [];

    // Map "Unknown" submissions key to "Vijay" for correct brand visualization
    return rawData.map((item) => {
      const newItem = { ...item };
      if ("Unknown" in newItem) {
        newItem["Vijay"] = newItem["Unknown"];
        delete newItem["Unknown"];
      }
      return newItem;
    });
  }, [data, chartType]);

  const chartKeys = useMemo(
    () => extractChartKeys(trendData, ["month", "week"]),
    [trendData]
  );

  if (isLoading && !data) {
    return <DashboardChartSkeleton />;
  }

  if (!trendData || trendData.length === 0) {
    return (
      <div className="glass-card border border-silgate-outline-variant/15 rounded-2xl p-12 flex items-center justify-center h-80 mb-8">
        <div className="text-center">
          <TrendingUp
            size={36}
            className="text-silgate-secondary/20 mx-auto mb-3"
          />
          <h4 className="text-sm font-bold text-silgate-primary mb-1">No Activity Trends Found</h4>
          <p className="text-xs text-silgate-secondary max-w-xs">No project submissions or review logs have been recorded for this period yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel border border-silgate-outline-variant/15 rounded-2xl overflow-hidden mb-8 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-silgate-outline-variant/15 bg-white/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-silgate-tertiary/10 rounded-xl">
            <TrendingUp size={15} className="text-silgate-tertiary" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold tracking-[0.3em] uppercase text-silgate-secondary block mb-0.5">
              Analytics Center
            </span>
            <h3 className="text-sm font-extrabold text-silgate-primary tracking-tight">{title}</h3>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-1.5 bg-silgate-container-low/50 p-1 rounded-xl border border-silgate-outline-variant/10">
          {["monthly", "weekly"].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                chartType === type
                  ? "bg-silgate-primary text-white shadow-sm"
                  : "text-silgate-secondary hover:text-silgate-primary hover:bg-white/40"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 relative select-none">
        <div className="h-[260px] sm:h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(117, 119, 125, 0.08)"
                vertical={false}
              />
              <XAxis
                dataKey={chartType === "monthly" ? "month" : "week"}
                stroke="#75777d"
                fontSize={10}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#75777d" 
                fontSize={10} 
                fontWeight={600} 
                tickLine={false} 
                axisLine={false} 
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(9, 20, 38, 0.02)" }} />
              {chartKeys.map((key, idx) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={getChartColor(idx)}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Custom Premium Legend */}
      {chartKeys.length > 0 && (
        <div className="px-6 py-4.5 bg-silgate-container-low/20 border-t border-silgate-outline-variant/15 flex flex-wrap gap-x-5 gap-y-2">
          {chartKeys.map((key, idx) => (
            <div key={key} className="flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-default">
              <div
                className="w-2.5 h-2.5 rounded-full shadow-inner"
                style={{ backgroundColor: getChartColor(idx) }}
              />
              <span className="text-[11px] text-silgate-secondary font-bold group-hover:text-silgate-primary transition-colors">
                {key}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendsChart;

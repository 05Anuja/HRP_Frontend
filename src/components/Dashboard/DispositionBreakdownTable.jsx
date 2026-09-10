import React from "react";
import { ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";

const TableSkeleton = () => (
  <div className="glass-card p-6 border border-silgate-outline-variant/15 rounded-2xl mb-8 space-y-4">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
        <div className="w-48 h-4 rounded skeleton-shimmer" />
      </div>
      <div className="w-20 h-7 rounded-lg skeleton-shimmer" />
    </div>
    <div className="space-y-3">
      {[...new Array(4)].map((_, i) => (
        <div
          key={`disposition-skeleton-row-${i}`}
          className="flex gap-4 items-center pt-2"
        >
          <div className="w-[30%] h-8 rounded-lg skeleton-shimmer" />
          <div className="w-[14%] h-8 rounded-lg skeleton-shimmer" />
          <div className="w-[14%] h-8 rounded-lg skeleton-shimmer" />
          <div className="w-[14%] h-8 rounded-lg skeleton-shimmer" />
          <div className="w-[14%] h-8 rounded-lg skeleton-shimmer" />
        </div>
      ))}
    </div>
  </div>
);

// `data` is expected to be the raw response from GET /disposition-breakdown:
// { success, columns: ["hrId","hrName","total", ...dispositionNames], data: [...], grandTotal: {...} }
const DispositionBreakdownTable = ({ data, isLoading, error, pagination, onPageChange }) => {
  
  if (isLoading) {
    return <TableSkeleton />;
  }
  
  if (error) {
    return (
      <div className="glass-card border border-rose-200/40 rounded-2xl p-6 text-center my-8">
        <p className="text-xs text-rose-600 font-semibold">{error}</p>
      </div>
    );
  }
  
  const list = Array.isArray(data?.data) ? data.data : [];
const pageSize = list.length > 0 ? list.length : 1;
const { currentPage = 1, totalPages = 1, totalSubmissions = 0 } = pagination || {};

  // Columns come straight from the backend, in DB creation order, e.g.
  // ["hrId", "hrName", "total", "No Contact", "Not Interested", "Intereted Lineup", "Call Back", ...]
  const allColumns = Array.isArray(data?.columns) ? data.columns : [];

  // hrId/hrName/total are fixed-position columns with special styling —
  // everything else is a dynamic disposition column, rendered in the exact order the backend sent them.
  const dispositionColumns = allColumns.filter(
    (col) => col !== "hrId" && col !== "hrName" && col !== "total"
  );

  const grandTotal = data?.grandTotal || {};

  if (list.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel border border-silgate-outline-variant/15 rounded-2xl overflow-hidden mb-8 transition-all duration-300 fade-in-slide">
      {/* Table Header Container */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-silgate-outline-variant/15 bg-white/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-silgate-primary/5 rounded-xl">
            <ClipboardList size={15} className="text-silgate-secondary" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold tracking-[0.3em] uppercase text-silgate-secondary block mb-0.5">
              Campaign Analytics
            </span>
            <h3 className="text-sm font-extrabold text-silgate-primary tracking-tight">
              HR Disposition Breakdown Ledger
            </h3>
          </div>
        </div>
        <div className="text-[10px] font-extrabold bg-silgate-container-low text-silgate-secondary px-2.5 py-1 rounded-lg border border-silgate-outline-variant/10 shadow-sm">
          {list.length} HR Active
        </div>
      </div>

      {/* Scrollable Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-silgate-outline-variant/15 bg-silgate-container-low/30 select-none">
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80">
                Your Name
              </th>
              {dispositionColumns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-center"
                >
                  {col}
                </th>
              ))}
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-right">
                Grand Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silgate-outline-variant/10">
            {list.map((row) => (
              <tr
                key={row.hrId}
                className="border-b border-silgate-outline-variant/10 hover:bg-silgate-container-low/20 transition-colors group cursor-default"
              >
                <td className="px-6 py-4 font-bold text-silgate-primary text-sm group-hover:text-silgate-primary/80 transition-colors">
                  {row.hrName}
                </td>
                {dispositionColumns.map((col) => (
                  <td
                    key={col}
                    className="px-6 py-4 text-center font-semibold text-slate-700"
                  >
                    {row[col] ?? 0}
                  </td>
                ))}
                <td className="px-6 py-4 text-right font-extrabold text-silgate-primary text-sm">
                  {row.total}
                </td>
              </tr>
            ))}

            {/* Grand Total Row */}
            <tr className="bg-[#e8f0fe]/70 font-extrabold text-slate-800 border-t-2 border-silgate-outline-variant/25">
              <td className="px-6 py-4 text-sm text-[#0f2e5c]">
                Grand Total
              </td>
              {dispositionColumns.map((col) => (
                <td
                  key={col}
                  className="px-6 py-4 text-center text-sm text-[#0f2e5c]"
                >
                  {grandTotal[col] ?? 0}
                </td>
              ))}
              <td className="px-6 py-4 text-right text-sm text-[#0f2e5c] font-black">
                {grandTotal?.total ?? 0}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

       {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 border-t border-silgate-outline-variant/10 bg-white">
        <div className="flex items-center gap-4">
          <p className="text-xs text-silgate-secondary whitespace-nowrap font-semibold">
            Showing {totalSubmissions === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalSubmissions)} of {totalSubmissions}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs text-silgate-secondary whitespace-nowrap font-semibold">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-silgate-container-low/30 hover:bg-silgate-container-low/50 text-xs text-silgate-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer border border-silgate-outline-variant/20"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-silgate-container-low/30 hover:bg-silgate-container-low/50 text-xs text-silgate-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer border border-silgate-outline-variant/20"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispositionBreakdownTable;

import React from 'react'
import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";

const HrDetails = ({ HrReportColumn, HrReport, pagination, onPageChange }) => {
  const { currentPage, totalPages, totalSubmissions } = pagination;
  const pageSize = HrReport.length > 0 ? HrReport.length : 1; // rows actually shown on this page
  console.log(HrReportColumn)
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
              Hr Details Report
            </span>
            <h3 className="text-sm font-extrabold text-silgate-primary tracking-tight">
              Recruiter-wise Disposition Summary
            </h3>
          </div>
        </div>
        {/* <div className="text-[10px] font-extrabold bg-silgate-container-low text-silgate-secondary px-2.5 py-1 rounded-lg border border-silgate-outline-variant/10 shadow-sm">
          {list.length} HR Active
        </div> */}
      </div>

      {/* Scrollable Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-silgate-outline-variant/15 bg-silgate-container-low/30 select-none">
              {/* <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80">
                HR Name
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-center">
                Company Name
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-center">
                Resume Shared
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-center">
                Resume Not Shortlisted
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-center">
                Resume Feedback Pending
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-right">
                1st Round Done
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-right">
                2nd Round Done
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-right">
                Selected
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-right">
                Rejected
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-right">
                On Hold
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-right">
                Not Responding
              </th> */}

              {
                HrReportColumn.map((column, idx) => (
                  <th key={idx} className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-right">
                    {column}
                  </th>
                ))
              }
            </tr>
          </thead>
          {/* <tbody className="divide-y divide-silgate-outline-variant/10"> */}
            {/* {HrReport.map((data) => (
              <tr
                key={data._id}
                className="border-b border-silgate-outline-variant/10 hover:bg-silgate-container-low/20 transition-colors group cursor-default"
              >
                <td className="px-6 py-4 font-bold text-silgate-primary text-sm group-hover:text-silgate-primary/80 transition-colors">
                  {data.hr}
                </td>
                <td className="px-6 py-4 text-center font-semibold text-slate-700">
                  {data.company}
                </td>
                <td className="px-6 py-4 text-center font-semibold text-slate-700">
                  {data["resumeStatus"]}
                </td>
                <td className="px-6 py-4 text-center font-semibold text-slate-700">
                  {data["Resume Not Shortlisted"]}
                </td>
                <td className="px-6 py-4 text-center font-semibold text-slate-700">
                  {data["Resume Feedback Pending"]}
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-silgate-primary text-sm">
                  {data["1st Round Done"]}
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-silgate-primary text-sm">
                  {data["2nd Round Done"]}
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-silgate-primary text-sm">
                  {data.Selected}
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-silgate-primary text-sm">
                  {data.Rejected}
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-silgate-primary text-sm">
                  {data["On Hold"]}
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-silgate-primary text-sm">
                  {data["Not Responding"]}
                </td>
              </tr>
            ))} */}

            {/* Grand Total Row */}
            {/* <tr className="bg-[#e8f0fe]/70 font-extrabold text-slate-800 border-t-2 border-silgate-outline-variant/25">
              <td className="px-6 py-4 text-sm text-[#0f2e5c]">Grand Total</td>
              <td className="px-6 py-4 text-center text-sm text-[#0f2e5c]">
                {grandTotal?.callBack}
              </td>
              <td className="px-6 py-4 text-center text-sm text-[#0f2e5c]">
                {grandTotal?.interestedLineup}
              </td>
              <td className="px-6 py-4 text-center text-sm text-[#0f2e5c]">
                {grandTotal?.noContact}
              </td>
              <td className="px-6 py-4 text-center text-sm text-[#0f2e5c]">
                {grandTotal?.notInterested}
              </td>
              <td className="px-6 py-4 text-right text-sm text-[#0f2e5c] font-black">
                {grandTotal?.total}
              </td>
            </tr> */}
          {/* </tbody> */}
          
           <tbody className="divide-y divide-silgate-outline-variant/10">
            {HrReport.map((item, index) => (
              <tr
                key={index}
                className="border-b border-silgate-outline-variant/10 hover:bg-silgate-container-low/20 transition-colors"
              >
                {HrReportColumn.map((column, idx) => (
                  <td
                    key={column}
                    className={`px-6 py-4 ${idx < 2 ? "text-left" : "text-center"
                      } ${idx === 0
                        ? "font-bold text-silgate-primary"
                        : "font-semibold text-slate-700"
                      }`}
                  >
                    {item[column] ?? 0}
                  </td>
                ))}
              </tr>
            ))}
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
}

export default HrDetails
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Filter, HelpCircle, Layers, FileX, ChevronDown } from "lucide-react";

const StatusBadge = ({ status }) => {
  const isActive = status?.toLowerCase() === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all duration-200 ${
        isActive
          ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/50"
          : "bg-rose-50/80 text-rose-700 border-rose-200/50"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

const DashboardTableSkeleton = () => (
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
          key={`table-skeleton-row-${i}`}
          className="flex gap-4 items-center pt-2"
        >
          <div className="w-[30%] h-8 rounded-lg skeleton-shimmer" />
          <div className="w-[20%] h-8 rounded-lg skeleton-shimmer" />
          <div className="w-[25%] h-8 rounded-lg skeleton-shimmer" />
          <div className="w-[10%] h-8 rounded-lg skeleton-shimmer" />
          <div className="w-[15%] h-8 rounded-lg skeleton-shimmer" />
        </div>
      ))}
    </div>
  </div>
);

const EmptyState = ({
  icon: Icon,
  message,
  description,
  actionText,
  onAction,
}) => (
  <div className="glass-card border border-silgate-outline-variant/15 rounded-2xl p-12 text-center max-w-xl mx-auto my-8 fade-in-slide">
    <div className="w-14 h-14 bg-silgate-container-low/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-silgate-outline-variant/10 shadow-sm">
      <Icon size={22} className="text-silgate-secondary/45" />
    </div>
    <h3 className="text-sm font-extrabold text-silgate-primary mb-1.5">
      {message}
    </h3>
    <p className="text-xs text-silgate-secondary/80 max-w-xs mx-auto mb-5 leading-relaxed">
      {description}
    </p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="inline-flex items-center justify-center px-4.5 py-2 text-xs font-extrabold bg-silgate-primary text-white rounded-xl hover:bg-silgate-primary/95 transition-all shadow-sm cursor-pointer active:scale-[0.98]"
      >
        {actionText}
      </button>
    )}
  </div>
);

const HROverviewTable = ({
  data,
  isLoading,
  onFilterChange,
  selectedFilters,
}) => {
  const navigate = useNavigate();
  const hrs = Array.isArray(data?.hrs) ? data.hrs : [];

  const displayedHrs = useMemo(() => {
    const list = [...hrs];
    if (list.length <= 6) return list;

    // Fisher-Yates shuffle
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list.slice(0, 6);
  }, [hrs]);

  if (isLoading && !data?.hrs) {
    return <DashboardTableSkeleton />;
  }

  if (hrs.length === 0) {
    return (
      <EmptyState
        icon={Users}
        message="No Submission Data Available"
        description="No human resource management records have been logged in the system yet."
        actionText="Refresh Dashboard"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="glass-panel border border-silgate-outline-variant/15 rounded-2xl overflow-hidden mb-8 transition-all duration-300 fade-in-slide">
      {/* Table Header Container */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-silgate-outline-variant/15 bg-white/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-silgate-primary/5 rounded-xl">
            <Users size={15} className="text-silgate-secondary" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold tracking-[0.3em] uppercase text-silgate-secondary block mb-0.5">
              Team Visibility
            </span>
            <h3 className="text-sm font-extrabold text-silgate-primary tracking-tight">
              HR Personnel Performance Ledger
            </h3>
          </div>
        </div>
        <div className="text-[10px] font-extrabold bg-silgate-container-low text-silgate-secondary px-2.5 py-1 rounded-lg border border-silgate-outline-variant/10 shadow-sm">
          Showing {displayedHrs.length} of {hrs.length} listed
        </div>
      </div>

      {/* Desktop View Table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-silgate-outline-variant/15 bg-silgate-container-low/30 select-none">
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80">
                HR Officer Name
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80">
                ECN Code
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80">
                Assigned Projects
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-center">
                Status
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-center">
                Submissions
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-right">
                Quick Filter
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedHrs.map((hr) => (
              <tr
                key={hr._id}
                className="border-b border-silgate-outline-variant/10 hover:bg-silgate-container-low/20 transition-colors group cursor-default"
              >
                <td className="px-6 py-4.5">
                  <div className="font-bold text-silgate-primary text-sm group-hover:text-silgate-primary/80 transition-colors">
                    {hr.name}
                  </div>
                </td>
                <td className="px-6 py-4.5">
                  <span className="font-mono text-xs font-semibold text-silgate-secondary">
                    {hr.ecn}
                  </span>
                </td>
                <td className="px-6 py-4.5 max-w-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(hr.projects) && hr.projects.length > 0 ? (
                      hr.projects.slice(0, 3).map((proj, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold bg-blue-50/50 text-blue-700 border border-blue-200/50 rounded-md"
                        >
                          {typeof proj === "string" ? proj : proj.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-silgate-secondary/40 font-medium">
                        None assigned
                      </span>
                    )}
                    {Array.isArray(hr.projects) && hr.projects.length > 3 && (
                      <span className="text-[9px] bg-silgate-container-low text-silgate-secondary font-bold px-1.5 py-0.5 rounded border border-silgate-outline-variant/10 shadow-sm">
                        +{hr.projects.length - 3} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4.5 text-center">
                  <StatusBadge status={hr.status || "active"} />
                </td>
                <td className="px-6 py-4.5 text-center">
                  <span className="font-extrabold text-silgate-primary text-sm bg-silgate-primary/5 border border-silgate-primary/10 px-3 py-1 rounded-xl">
                    {hr.submissionsCount ?? hr.totalSubmissions ?? hr.submissionCount ?? 0}
                  </span>
                </td>
                <td className="px-6 py-4.5 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      onFilterChange({ ...selectedFilters, hrId: hr._id })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold text-silgate-secondary hover:text-silgate-primary border border-silgate-outline-variant/30 hover:border-silgate-tertiary bg-white hover:bg-silgate-container-low/30 rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.97]"
                  >
                    <Filter size={11} className="text-silgate-tertiary" />
                    Quick Filter
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card-based Transformation Layout */}
      <div className="block md:hidden p-4 space-y-4 bg-white/20 divide-y divide-silgate-outline-variant/15">
        {displayedHrs.map((hr, index) => (
          <div
            key={hr._id}
            className={`pt-4 space-y-3.5 ${index === 0 ? "pt-0" : ""}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-extrabold text-silgate-primary text-sm">
                  {hr.name}
                </h4>
                <p className="font-mono text-[10px] text-silgate-secondary mt-0.5">
                  ECN: {hr.ecn}
                </p>
              </div>
              <StatusBadge status={hr.status || "active"} />
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-silgate-secondary block">
                Campaign Assignments:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(hr.projects) && hr.projects.length > 0 ? (
                  hr.projects.map((proj, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 text-[8.5px] font-bold bg-blue-50/50 text-blue-700 border border-blue-200/50 rounded-md"
                    >
                      {typeof proj === "string" ? proj : proj.name}
                    </span>
                  ))
                ) : (
                  <span className="text-silgate-secondary/40 font-bold text-[10px]">
                    None assigned
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-silgate-secondary">
                  Submissions:
                </span>
                <span className="font-extrabold text-silgate-primary text-xs bg-silgate-primary/5 px-2.5 py-0.5 rounded-lg border border-silgate-primary/10">
                  {hr.submissionsCount ?? hr.totalSubmissions ?? hr.submissionCount ?? 0}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  onFilterChange({ ...selectedFilters, hrId: hr._id })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold text-silgate-secondary hover:text-silgate-primary border border-silgate-outline-variant/35 bg-white rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <Filter size={11} className="text-silgate-tertiary" />
                Quick Filter
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Downward navigation footer button */}
      <div className="flex justify-center border-t border-silgate-outline-variant/15 bg-silgate-container-low/5 py-3.5 hover:bg-silgate-container-low/15 transition-all">
        <button
          type="button"
          onClick={() => navigate("/hr")}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-silgate-secondary hover:text-silgate-primary transition-all cursor-pointer bg-white border border-silgate-outline-variant/35 hover:border-silgate-tertiary px-4 py-2 rounded-xl shadow-sm hover:shadow active:scale-[0.98]"
        >
          View Full User Directory
          <ChevronDown size={14} className="text-silgate-tertiary" />
        </button>
      </div>
    </div>
  );
};

const AssignedHRsTable = ({ data, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading && !data?.assignedHrs && !data?.assignedHRs) {
    return <DashboardTableSkeleton />;
  }

  // Handle both assignedHRs and assignedHrs cases in the API payload dynamically
  const assignedHrs = Array.isArray(data?.assignedHRs) 
    ? data.assignedHRs 
    : (Array.isArray(data?.assignedHrs) ? data.assignedHrs : []);

  if (assignedHrs.length === 0) {
    return (
      <EmptyState
        icon={FileX}
        message="No team member assigned"
        description="There are currently no human resource managers assigned to this active campaign project."
        actionText="Assign Team Members"
        onAction={() => navigate("/hr")}
      />
    );
  }

  return (
    <div className="glass-panel border border-silgate-outline-variant/15 rounded-2xl overflow-hidden mb-8 transition-all duration-300 fade-in-slide">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-silgate-outline-variant/15 bg-white/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-silgate-primary/5 rounded-xl">
            <Users size={15} className="text-silgate-secondary" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold tracking-[0.3em] uppercase text-silgate-secondary block mb-0.5">
              Campaign Staff
            </span>
            <h3 className="text-sm font-extrabold text-silgate-primary tracking-tight">
              Active Assigned Team Members
            </h3>
          </div>
        </div>
        <div className="text-[10px] font-extrabold bg-silgate-container-low text-silgate-secondary px-2.5 py-1 rounded-lg border border-silgate-outline-variant/10 shadow-sm">
          {assignedHrs.length} HR Active
        </div>
      </div>

      {/* Desktop view */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-silgate-outline-variant/15 bg-silgate-container-low/30 select-none">
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80">
                Name
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80">
                ECN Code
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-center">
                Status
              </th>
              <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-silgate-secondary/80 text-center">
                Project Submission Count
              </th>
            </tr>
          </thead>
          <tbody>
            {assignedHrs.map((hr) => (
              <tr
                key={hr._id}
                className="border-b border-silgate-outline-variant/10 hover:bg-silgate-container-low/20 transition-colors group cursor-default"
              >
                <td className="px-6 py-4.5">
                  <div className="font-bold text-silgate-primary text-sm group-hover:text-silgate-primary/80 transition-colors">
                    {hr.name}
                  </div>
                </td>
                <td className="px-6 py-4.5">
                  <span className="font-mono text-xs font-semibold text-silgate-secondary">
                    {hr.ecn}
                  </span>
                </td>
                <td className="px-6 py-4.5 text-center">
                  <StatusBadge status={hr.status || "active"} />
                </td>
                <td className="px-6 py-4.5 text-center">
                  <span className="font-extrabold text-silgate-primary text-sm bg-silgate-primary/5 border border-silgate-primary/10 px-4 py-1 rounded-xl">
                    {hr.submissionsCount ?? hr.totalSubmissions ?? hr.submissionCount ?? 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="block md:hidden p-4 space-y-4 bg-white/20 divide-y divide-silgate-outline-variant/15">
        {assignedHrs.map((hr, index) => (
          <div
            key={hr._id}
            className={`pt-4 space-y-3 ${index === 0 ? "pt-0" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-silgate-primary text-sm">
                  {hr.name}
                </h4>
                <p className="font-mono text-[10px] text-silgate-secondary mt-0.5">
                  ECN: {hr.ecn}
                </p>
              </div>
              <StatusBadge status={hr.status || "active"} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-bold text-silgate-secondary">
                Project Submissions:
              </span>
              <span className="font-extrabold text-silgate-primary text-xs bg-silgate-primary/5 px-2.5 py-0.5 rounded-lg border border-silgate-primary/10">
                {hr.submissionsCount ?? hr.totalSubmissions ?? hr.submissionCount ?? 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DetailTables = ({
  role,
  data,
  isLoading,
  selectedFilters,
  onFilterChange,
}) => {
  if (isLoading && !data) {
    return <DashboardTableSkeleton />;
  }

  if (!data) return null;

  const isSuperadmin = role === "superadmin";
  const isFiltered =
    (selectedFilters?.hrId && selectedFilters.hrId !== "all") ||
    (selectedFilters?.projectId && selectedFilters.projectId !== "null");

  // HR Self-Service View: Hide tables, focus on trends/insights
  if (!isSuperadmin) {
    return null;
  }

  // Case A: Default overview (no filters active) -> Show the HR performance ledger overview table
  if (!isFiltered) {
    return (
      <HROverviewTable
        data={data}
        isLoading={isLoading}
        onFilterChange={onFilterChange}
        selectedFilters={selectedFilters}
      />
    );
  }

  // Case B: Project selected as filter (and HR is all) -> Show the Assigned HRs Table
  if (selectedFilters?.hrId === "all" && selectedFilters?.projectId !== "null") {
    return <AssignedHRsTable data={data} isLoading={isLoading} />;
  }

  // Case C: HR is selected (or both are selected) -> Hide tables
  return null;
};

export default DetailTables;

import React from "react";
import { Filter, Users, Layers, Sparkles, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const projectOptions = [
  { id: "silgate", name: "Silgate" },
  { id: "talent_corner", name: "Talent Corner" }
];

const DashboardFilters = ({
  role,
  selectedFilters,
  hrs,
  projects,
  onFilterChange,
  isLoading,
}) => {
  const isSuperadmin = role === "superadmin";
  const activeHr = hrs.find((h) => h._id === selectedFilters.hrId);
  const activeProject = projectOptions.find(
    (p) => p.id === selectedFilters.projectId,
  );

  const handleClearHr = () => {
    onFilterChange({ ...selectedFilters, hrId: "all" });
  };

  const handleClearProject = () => {
    onFilterChange({ ...selectedFilters, projectId: "null" });
  };

  const handleClearStartDate = () => {
    onFilterChange({ ...selectedFilters, startDate: "" });
  };

  const handleClearEndDate = () => {
    onFilterChange({ ...selectedFilters, endDate: "" });
  };

  const hasActiveFilters =
    selectedFilters.hrId !== "all" ||
    selectedFilters.projectId !== "null" ||
    selectedFilters.startDate ||
    selectedFilters.endDate;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden mb-8 transition-all duration-300">
      {/* Premium Toolbar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-silgate-outline-variant/15 bg-white/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-silgate-primary text-white rounded-xl shadow-md shadow-silgate-primary/5">
            <Filter size={15} />
          </div>
          <div>
            <span className="text-[9px] font-extrabold tracking-[0.3em] uppercase text-silgate-secondary block mb-0.5">
              Control Panel
            </span>
            <h3 className="text-sm font-extrabold text-silgate-primary tracking-tight">
              Performance Filter Console
            </h3>
          </div>
        </div>

        <div className="inline-flex items-center rounded-xl border border-silgate-outline-variant/20 bg-silgate-container-low px-3 py-2 shadow-sm transition-all duration-200 hover:shadow-md hover:border-silgate-primary/30">
          <Link
            to="/talent-corner"
            className="text-[11px] font-bold tracking-wide uppercase text-silgate-secondary transition-colors duration-200 hover:text-silgate-primary"
          >
            Talent Corner
          </Link>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-silgate-tertiary animate-ping" />
            <span className="text-[10px] font-bold text-silgate-secondary/80 tracking-wider uppercase">
              Updating Intelligence...
            </span>
          </div>
        )}
      </div>

      {/* Select Controls Container */}
      <div className={`grid grid-cols-1 ${isSuperadmin ? "md:grid-cols-4" : "md:grid-cols-2"} gap-6 p-6 bg-white/20`}>
        {/* HR Filter Select (Superadmin only) */}
        {isSuperadmin && (
          <div className="relative group">
            <div className="absolute left-3 top-9 text-silgate-secondary/40 group-focus-within:text-silgate-tertiary transition-colors duration-200 pointer-events-none">
              <Users size={14} />
            </div>
            <label className="block text-[11px] font-extrabold tracking-wider text-silgate-secondary uppercase mb-2">
              Filter by HR Officer
            </label>
            <select
              value={selectedFilters.hrId}
              onChange={(e) =>
                onFilterChange({ ...selectedFilters, hrId: e.target.value })
              }
              disabled={isLoading}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold border border-silgate-outline-variant/25 rounded-xl bg-white/80 text-silgate-primary focus:outline-none focus:ring-1 focus:ring-silgate-tertiary focus:border-silgate-tertiary transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:border-silgate-outline-variant/50 cursor-pointer"
            >
              <option value="all">All HR Administrators</option>
              {Array.isArray(hrs) &&
                hrs.map((hr) => (
                  <option key={hr._id} value={hr._id}>
                    {hr.name} ({hr.ecn})
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Project Filter Select (Superadmin only) */}
        {isSuperadmin && (
          <div className="relative group">
            <div className="absolute left-3 top-9 text-silgate-secondary/40 group-focus-within:text-silgate-tertiary transition-colors duration-200 pointer-events-none">
              <Layers size={14} />
            </div>
            <label className="block text-[11px] font-extrabold tracking-wider text-silgate-secondary uppercase mb-2">
              Filter by Campaign
            </label>
            <select
              value={selectedFilters.projectId}
              onChange={(e) =>
                onFilterChange({ ...selectedFilters, projectId: e.target.value })
              }
              disabled={isLoading}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold border border-silgate-outline-variant/25 rounded-xl bg-white/80 text-silgate-primary focus:outline-none focus:ring-1 focus:ring-silgate-tertiary focus:border-silgate-tertiary transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:border-silgate-outline-variant/50 cursor-pointer"
            >
              <option value="null">All Campaign Projects</option>
              {projectOptions.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Start Date Filter */}
        <div className="relative group">
          <div className="absolute left-3 top-9 text-silgate-secondary/40 group-focus-within:text-silgate-tertiary transition-colors duration-200 pointer-events-none">
            <Calendar size={14} />
          </div>
          <label className="block text-[11px] font-extrabold tracking-wider text-silgate-secondary uppercase mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={selectedFilters.startDate || ""}
            onChange={(e) =>
              onFilterChange({ ...selectedFilters, startDate: e.target.value })
            }
            disabled={isLoading}
            className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold border border-silgate-outline-variant/25 rounded-xl bg-white/80 text-silgate-primary focus:outline-none focus:ring-1 focus:ring-silgate-tertiary focus:border-silgate-tertiary transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:border-silgate-outline-variant/50 cursor-pointer"
          />
        </div>

        {/* End Date Filter */}
        <div className="relative group">
          <div className="absolute left-3 top-9 text-silgate-secondary/40 group-focus-within:text-silgate-tertiary transition-colors duration-200 pointer-events-none">
            <Calendar size={14} />
          </div>
          <label className="block text-[11px] font-extrabold tracking-wider text-silgate-secondary uppercase mb-2">
            End Date
          </label>
          <input
            type="date"
            value={selectedFilters.endDate || ""}
            onChange={(e) =>
              onFilterChange({ ...selectedFilters, endDate: e.target.value })
            }
            disabled={isLoading}
            className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold border border-silgate-outline-variant/25 rounded-xl bg-white/80 text-silgate-primary focus:outline-none focus:ring-1 focus:ring-silgate-tertiary focus:border-silgate-tertiary transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:border-silgate-outline-variant/50 cursor-pointer"
          />
        </div>
      </div>

      {/* Dismissible Active Filter Pill Badges */}
      {hasActiveFilters && (
        <div className="px-6 py-3.5 bg-silgate-container-low/40 border-t border-silgate-outline-variant/10 flex items-center gap-3 flex-wrap transition-all duration-300">
          <div className="flex items-center gap-1.5 text-silgate-secondary">
            <Sparkles size={11} className="text-silgate-tertiary" />
            <span className="text-[10px] text-silgate-secondary font-bold uppercase tracking-wider">
              Active Parameters:
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {isSuperadmin && selectedFilters.hrId !== "all" && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50/80 text-blue-700 border border-blue-200/50 shadow-sm hover:bg-blue-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                HR: {activeHr ? activeHr.name : "Selected"}
                <button
                  type="button"
                  onClick={handleClearHr}
                  className="hover:text-blue-900 font-extrabold focus:outline-none cursor-pointer ml-0.5"
                  aria-label="Clear HR Filter"
                >
                  ✕
                </button>
              </span>
            )}

            {isSuperadmin && selectedFilters.projectId !== "null" && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-violet-50/80 text-violet-700 border border-violet-200/50 shadow-sm hover:bg-violet-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                Project: {activeProject ? activeProject.name : "Selected"}
                <button
                  type="button"
                  onClick={handleClearProject}
                  className="hover:text-violet-900 font-extrabold focus:outline-none cursor-pointer ml-0.5"
                  aria-label="Clear Project Filter"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedFilters.startDate && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50/80 text-amber-700 border border-amber-200/50 shadow-sm hover:bg-amber-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Start: {selectedFilters.startDate}
                <button
                  type="button"
                  onClick={handleClearStartDate}
                  className="hover:text-amber-900 font-extrabold focus:outline-none cursor-pointer ml-0.5"
                  aria-label="Clear Start Date"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedFilters.endDate && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50/80 text-amber-700 border border-amber-200/50 shadow-sm hover:bg-amber-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                End: {selectedFilters.endDate}
                <button
                  type="button"
                  onClick={handleClearEndDate}
                  className="hover:text-amber-900 font-extrabold focus:outline-none cursor-pointer ml-0.5"
                  aria-label="Clear End Date"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={() => onFilterChange({ hrId: "all", projectId: "null", startDate: "", endDate: "" })}
              className="text-[9px] font-extrabold uppercase text-silgate-secondary hover:text-silgate-primary px-2.5 py-1 rounded-lg border border-silgate-outline-variant/20 hover:bg-white transition-all cursor-pointer"
            >
              Reset All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardFilters;

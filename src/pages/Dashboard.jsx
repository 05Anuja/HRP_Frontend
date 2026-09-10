import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardFilters from "@/components/Dashboard/DashboardFilters";
import StatsGrid from "@/components/Dashboard/StatsGrid";
import DispositionBreakdownTable from "@/components/Dashboard/DispositionBreakdownTable";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useDispositionBreakdown } from "@/hooks/useDispositionBreakdown";
import { toast } from "react-toastify";
// import {
//   getHrCompanyStatusReport,
//   getCandidateDetailsReport,
//   getCompanyDesignationStatusReport,
// } from "@/services/dashboardService";
// import CompanyReport from "@/components/Dashboard/CompanyReport";
// import CandidateDetailsReport from "@/components/Dashboard/CandidateDetailsReport";
// import HrDetails from "@/components/Dashboard/HrDetails";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    hrId: "all",
    projectId: "null",
    startDate: "",
    endDate: "",
  });

  // HR Disposal Ledger pagination states
  const [hrDisposalPage, setHrDisposalPage] = useState(1);
  const [hrDisposalPagination, setHrDisposalPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSubmissions: 0,
  });

  //Candidate details report pagination states
  // const [candidateDetailsPage, setCandidateDetailsPage] = useState(1);
  // const [candidateDetailsPagination, setCandidateDetailsPagination] = useState({
  //   currentPage: 1,
  //   totalPages: 1,
  //   totalSubmissions: 0,
  // });

  const parsed = JSON.parse(localStorage.getItem("user") || "{}");
  const showBreakdown =
    (parsed?.role === "superadmin" || parsed?.projects?.includes("Silgate")) ??
    false;

  // Keep a master cache of HRs and Projects so dropdowns never shrink/lock when filters are applied
  const [masterHrs, setMasterHrs] = useState([]);
  const [masterProjects, setMasterProjects] = useState([]);

  // Get user role from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(userData);
    setRole(user.role);
  }, [navigate]);

  // Fetch dashboard data
  const { data, loading, error, refetch } = useDashboardStats(
    selectedFilters,
    role !== null,
  );

  // Fetch disposition breakdown data (only if not viewing Talent Corner)
  const showDispositionBreakdown =
    selectedFilters.projectId !== "talent_corner";

  // Memoize so the hook's effect doesn't refire on every render
  // (a new object literal here would be a new reference each render)
  const dispositionFilters = useMemo(
    () => ({ ...selectedFilters, page: hrDisposalPage, limit: 5 }),
    [selectedFilters, hrDisposalPage],
  );

  const {
    data: dispositionData,
    loading: dispositionLoading,
    error: dispositionError,
    refetch: refetchDisposition,
  } = useDispositionBreakdown(
    dispositionFilters,
    showDispositionBreakdown && role !== null,
  );

  // Reset to page 1 whenever filters change, so a stale page number
  // doesn't get applied against a different filtered dataset
  useEffect(() => {
    setHrDisposalPage(1);
  }, [selectedFilters]);

  // Keep pagination state (currentPage/totalPages/totalSubmissions) in
  // sync with whatever the backend returns for the latest fetch.
  // Backend returns these flat on the response root, not nested.
  useEffect(() => {
    if (dispositionData) {
      setHrDisposalPagination({
        currentPage: dispositionData.currentPage ?? 1,
        totalPages: dispositionData.totalPages ?? 1,
        totalSubmissions: dispositionData.totalSubmissions ?? 0,
      });
    }
  }, [dispositionData]);

  const handleRefresh = () => {
    refetch();
    if (showDispositionBreakdown) {
      refetchDisposition();
    }
  };

  const isAnyLoading =
    loading || (showDispositionBreakdown && dispositionLoading);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (dispositionError) {
      toast.error(dispositionError);
    }
  }, [error, dispositionError]);

  // Synchronize and cache master filter options from initial metadata load
  useEffect(() => {
    if (data?.filters?.hrs && data.filters.hrs.length > 0) {
      setMasterHrs(data.filters.hrs);
    }
    if (data?.filters?.projects && data.filters.projects.length > 0) {
      setMasterProjects(data.filters.projects);
    }
  }, [data]);

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-silgate-background bg-dot-grid select-none">
        <div className="text-center relative">
          <div className="inline-block relative">
            {/* Soft pulsing glass circle skeleton */}
            <div className="w-14 h-14 rounded-2xl bg-white border border-silgate-outline-variant/15 flex items-center justify-center shadow-lg skeleton-shimmer" />
          </div>
          <p className="text-xs font-bold text-silgate-secondary tracking-widest uppercase mt-4">
            Loading Security Credentials...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-silgate-background bg-dot-grid px-4 sm:px-6 py-6 sm:py-8 select-none transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Title & Fresh Trigger */}
        <DashboardHeader
          role={role}
          onRefresh={handleRefresh}
          isLoading={isAnyLoading}
        />

        {/* Global Toolbar Filters */}
        <DashboardFilters
          role={role}
          selectedFilters={selectedFilters}
          hrs={masterHrs.length > 0 ? masterHrs : data?.filters?.hrs || []}
          projects={
            masterProjects.length > 0
              ? masterProjects
              : data?.filters?.projects || []
          }
          onFilterChange={setSelectedFilters}
          isLoading={isAnyLoading}
        />

        {/* Dynamic KPI Cards & Insights Grid */}
        <StatsGrid
          role={role}
          data={data}
          isLoading={loading}
          selectedFilters={selectedFilters}
        />

        {/* Disposition Breakdown Table */}
        {showDispositionBreakdown && showBreakdown && (
          <DispositionBreakdownTable
            data={dispositionData}
            isLoading={dispositionLoading}
            error={dispositionError}
            pagination={hrDisposalPagination}
            onPageChange={setHrDisposalPage}
          />
        )}

        {/* Recovery Empty State */}
        {!loading && !data && (
          <div className="glass-card border border-silgate-outline-variant/15 rounded-2xl p-12 text-center max-w-xl mx-auto my-12 fade-in-slide">
            <div className="w-16 h-16 bg-silgate-container-low rounded-2xl flex items-center justify-center mx-auto mb-4 border border-silgate-outline-variant/10 shadow-md">
              <svg
                className="w-8 h-8 text-silgate-secondary/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-extrabold text-silgate-primary mb-1">
              Failed to Connect to Platform Analytics
            </h3>
            <p className="text-xs text-silgate-secondary max-w-xs mx-auto mb-6 leading-relaxed">
              We encountered an issue downloading the performance logs. Please
              ensure your session is active or attempt to refresh.
            </p>
            <button
              onClick={refetch}
              className="px-4.5 py-2.5 text-xs font-bold bg-silgate-primary text-white rounded-xl hover:bg-silgate-primary/95 transition-all shadow-md shadow-silgate-primary/5 active:scale-[0.98] cursor-pointer"
            >
              Retry Synchronizing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "@/utils/axiosConfig";
import {
  Plus,
  RefreshCw,
  Layers,
  ArrowLeft,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Edit,
  Users,
  Check,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { uploadLink } from "../../../constants";

const TalentCornerSubmissions = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [csvDownloading, setCsvDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedHr, setSelectedHr] = useState("");

  const [designations, setDesignations] = useState([]);
  const [hrs, setHrs] = useState([]);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [loadingHrs, setLoadingHrs] = useState(false);

  // ---- Bulk selection & bulk-assign state ----
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAssignHr, setBulkAssignHr] = useState("");
  const [bulkAssigning, setBulkAssigning] = useState(false);
  const selectAllRef = useRef(null);

  const today = new Date().toISOString().slice(0, 10);
  const isLeadNew = (createdAt) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const currentDate = new Date();

    return (
      createdDate.getFullYear() === currentDate.getFullYear() &&
      createdDate.getMonth() === currentDate.getMonth() &&
      createdDate.getDate() === currentDate.getDate()
    );
  };

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role;
  const isSuperadmin = role === "superadmin";
  const isHr = role === "hr";

  const fetchUrl = isSuperadmin ? "/talent/allData" : "/talent/myData";

  // Fetching the all talent corner data/leads
  const fetchSubmissions = async ({
    startDate: fetchStartDate = appliedStartDate,
    endDate: fetchEndDate = appliedEndDate,
    pageToFetch = page,
  } = {}) => {
    setLoading(true);
    try {
      const response = await Axios.get(fetchUrl, {
        params: {
          page: pageToFetch,
          limit: pageSize,
          search: debouncedSearch,
          ...(fetchStartDate ? { startDate: fetchStartDate } : {}),
          ...(fetchEndDate ? { endDate: fetchEndDate } : {}),
          ...(selectedDesignation ? { designation: selectedDesignation } : {}),
          ...(selectedHr ? { hr: selectedHr } : {}),
        },
      });

      const payload = response?.data;
      const list = payload?.submissions || payload?.data || [];
      setSubmissions(list);
      setTotalSubmissions(
        payload?.totalSubmissions || payload?.total || list.length,
      );
      setTotalPages(payload?.totalPages || 1);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to sync Talent Corner dataset.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to download CSV
  const downloadCsv = async () => {
    if (csvDownloading) return;
    setCsvDownloading(true);
    try {
      const response = await Axios.get("/talent/export", {
        params: {
          ...(appliedStartDate ? { startDate: appliedStartDate } : {}),
          ...(appliedEndDate ? { endDate: appliedEndDate } : {}),
          ...(selectedDesignation ? { designation: selectedDesignation } : {}),
          ...(selectedHr ? { hr: selectedHr } : {}),
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        `talent_corner_export_${new Date().toISOString().slice(0, 10)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Download started successfully.");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to download Talent Corner CSV.",
      );
    } finally {
      setCsvDownloading(false);
    }
  };

  // ---- Bulk assign helpers ----
  const toggleRowSelection = (id) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedRows((prev) => {
      if (prev.size === submissions.length) return new Set();
      return new Set(submissions.map((row) => row._id));
    });
  };

  const isAllSelected =
    submissions.length > 0 && selectedRows.size === submissions.length;
  const isSomeSelected =
    selectedRows.size > 0 && selectedRows.size < submissions.length;

  // Keep the "select all" checkbox's indeterminate visual state in sync
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const openBulkModal = () => {
    if (selectedRows.size === 0) return;
    setBulkAssignHr("");
    setShowBulkModal(true);
  };

  const submitBulkAssign = async () => {
    if (!bulkAssignHr) {
      toast.error("Please select an HR to assign.");
      return;
    }

    if (selectedRows.size === 0) {
      toast.error("Please select at least one lead.");
      return;
    }

    setBulkAssigning(true);

    try {
      const response = await Axios.patch("/talent/assign", {
        assignedTo: bulkAssignHr,
        leadIds: Array.from(selectedRows),
      });

      toast.success(
        response?.data?.message || "Selected candidates assigned successfully.",
      );

      setShowBulkModal(false);
      setSelectedRows(new Set());

      await fetchSubmissions({ pageToFetch: page });
    } catch (err) {
      console.error("Bulk Assign Error:", err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to bulk assign candidates.",
      );
    } finally {
      setBulkAssigning(false);
    }
  };

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch designations & HRs on mount
  useEffect(() => {
    const fetchDesignations = async () => {
      setLoadingDesignations(true);
      try {
        const res = await Axios.get("/designations", {
          params: { project: "Talent Corner", limit: 1000 },
        });
        setDesignations(res?.data?.data?.map((d) => d.name) || []);
      } catch (err) {
        console.error("Failed to fetch designations", err);
      } finally {
        setLoadingDesignations(false);
      }
    };
    fetchDesignations();
  }, []);

  // Only superadmin can fetch the HRs
  useEffect(() => {
    // if (isSuperadmin) {
    const fetchHrs = async () => {
      setLoadingHrs(true);
      try {
        const res = await Axios.get("/users/allHR");
        // setHrs(res?.data?.hrUsers || []);
        if (res.data && Array.isArray(res.data.hrUsers)) {
          setHrs(
            res.data.hrUsers.filter((hr) =>
              hr.projects?.includes("Talent Corner"),
            ),
          );
        }
      } catch (err) {
        console.error("Failed to fetch HRs", err);
      } finally {
        setLoadingHrs(false);
      }
    };
    fetchHrs();
    // }
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    appliedStartDate,
    appliedEndDate,
    selectedDesignation,
    selectedHr,
  ]);

  // Fetch when page, size, search or date range changes
  useEffect(() => {
    fetchSubmissions({ pageToFetch: page });
  }, [
    page,
    pageSize,
    debouncedSearch,
    appliedStartDate,
    appliedEndDate,
    selectedDesignation,
    selectedHr,
  ]);

  // Reusable styled checkbox
  const StyledCheckbox = ({ checked, onChange, refProp, ariaLabel }) => (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input
        ref={refProp}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        className="peer appearance-none w-4 h-4 rounded-[5px] border-2 border-silgate-outline-variant/50 bg-white checked:bg-silgate-primary checked:border-silgate-primary indeterminate:bg-silgate-primary indeterminate:border-silgate-primary transition-all duration-150 cursor-pointer hover:border-silgate-primary/60"
      />
      <Check
        size={12}
        strokeWidth={3}
        className="pointer-events-none absolute left-[2px] top-[2px] text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
      />
    </label>
  );

  return (
    <div className="space-y-6 fade-in-slide relative min-h-full">
      {/* Title header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-silgate-secondary hover:text-silgate-primary transition-all cursor-pointer uppercase tracking-wider block mb-1"
          >
            <ArrowLeft size={10} />
            Workspace dashboard
          </button>
          <h1 className="text-xl font-bold tracking-tight text-silgate-primary mt-1">
            Talent Corner Candidate Logs
          </h1>
          <p className="text-xs text-silgate-secondary mt-1">
            Auditing and logging submissions, resume tracking, and operator
            inputs for the Talent Corner campaign.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchSubmissions({ pageToFetch: page })}
            className="p-2.5 bg-white border border-silgate-outline-variant/30 hover:border-silgate-outline rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw size={14} className="text-silgate-secondary" />
          </button>
          {!isSuperadmin && (
            <button
              onClick={() => navigate("/submissions/talent-corner/create")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-silgate-primary text-white text-xs font-bold hover:bg-silgate-primary/95 transition-all shadow-sm active:scale-[0.98] cursor-pointer border border-white/5"
            >
              <Plus size={14} className="text-silgate-tertiary" />
              Add Details
            </button>
          )}
        </div>
      </div>

      {/* Grid: Stat and date filters */}
      <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-5">
        {/* Metric Card */}
        <div className="p-4 rounded-xl bg-white border border-silgate-outline-variant/10 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-silgate-primary/10 rounded-xl">
            <Layers size={18} className="text-silgate-primary" />
          </div>
          <div>
            <span className="text-[10px] text-silgate-secondary uppercase tracking-wider font-semibold block">
              Total Entries
            </span>
            <span className="text-xl font-extrabold text-silgate-primary block mt-0.5">
              {totalSubmissions}
            </span>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <div className="bg-white border border-silgate-outline-variant/25 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col gap-2 px-5 py-4 border-b border-silgate-outline-variant/20 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-silgate-secondary mb-1">
                Filter
              </p>
              <h2 className="text-sm font-semibold text-silgate-primary">
                Advanced Filters
              </h2>
            </div>
            <p className="text-xs text-silgate-secondary max-w-xs">
              Filter candidate logs by date range, designation, or recruiter.
            </p>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {/* Start Date */}
              <div className="grid gap-2">
                <label
                  htmlFor="sheet-start-date-filter"
                  className="text-[11px] font-semibold text-silgate-secondary"
                >
                  Start date
                </label>
                <input
                  id="sheet-start-date-filter"
                  type="date"
                  max={today}
                  value={startDate}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value || value <= today) setStartDate(value);
                  }}
                  className="w-full px-3 py-2 text-xs border border-silgate-outline-variant/30 rounded-lg bg-white text-silgate-primary focus:outline-none focus:ring-1 focus:ring-silgate-tertiary focus:border-silgate-tertiary transition-all"
                />
              </div>

              {/* End Date */}
              <div className="grid gap-2">
                <label
                  htmlFor="sheet-end-date-filter"
                  className="text-[11px] font-semibold text-silgate-secondary"
                >
                  End date
                </label>
                <input
                  id="sheet-end-date-filter"
                  type="date"
                  max={today}
                  value={endDate}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value || value <= today) setEndDate(value);
                  }}
                  className="w-full px-3 py-2 text-xs border border-silgate-outline-variant/30 rounded-lg bg-white text-silgate-primary focus:outline-none focus:ring-1 focus:ring-silgate-tertiary focus:border-silgate-tertiary transition-all"
                />
              </div>

              {/* Designation Filter */}
              <div className="grid gap-2">
                <label
                  htmlFor="designation-filter"
                  className="text-[11px] font-semibold text-silgate-secondary"
                >
                  Designation
                </label>
                <select
                  id="designation-filter"
                  value={selectedDesignation}
                  onChange={(e) => {
                    setSelectedDesignation(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs border border-silgate-outline-variant/30 rounded-lg bg-white text-silgate-primary focus:outline-none focus:ring-1 focus:ring-silgate-tertiary focus:border-silgate-tertiary transition-all font-semibold"
                  disabled={loadingDesignations}
                >
                  <option value="">
                    {loadingDesignations ? "Loading..." : "All Designations"}
                  </option>
                  {designations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* HR Recruiter Filter */}
              {isSuperadmin ? (
                <div className="grid gap-2">
                  <label
                    htmlFor="hr-filter"
                    className="text-[11px] font-semibold text-silgate-secondary"
                  >
                    Recruiter (HR)
                  </label>
                  <select
                    id="hr-filter"
                    value={selectedHr}
                    onChange={(e) => {
                      setSelectedHr(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 text-xs border border-silgate-outline-variant/30 rounded-lg bg-white text-silgate-primary focus:outline-none focus:ring-1 focus:ring-silgate-tertiary focus:border-silgate-tertiary transition-all font-semibold"
                    disabled={loadingHrs}
                  >
                    <option value="">
                      {loadingHrs ? "Loading..." : "All Recruiters"}
                    </option>
                    {hrs.map((hr) => (
                      <option key={hr._id} value={hr._id}>
                        {hr.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid gap-2">
                  <label className="text-[11px] font-semibold text-silgate-secondary">
                    Recruiter (HR)
                  </label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className="w-full px-3 py-2 text-xs border border-silgate-outline-variant/30 rounded-lg bg-silgate-container-low text-silgate-secondary/60 focus:outline-none cursor-not-allowed font-semibold"
                  />
                </div>
              )}
            </div>

            {/* Buttons Row */}
            <div className="flex justify-end gap-2 pt-2 border-t border-silgate-outline-variant/10">
              {(appliedStartDate ||
                appliedEndDate ||
                selectedDesignation ||
                selectedHr ||
                startDate ||
                endDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setAppliedStartDate("");
                    setAppliedEndDate("");
                    setSelectedDesignation("");
                    setSelectedHr("");
                    setPage(1);
                  }}
                  className="h-10 rounded-xl border border-silgate-outline-variant/30 bg-white px-4 text-xs font-semibold text-silgate-secondary hover:bg-silgate-container-low transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <X size={14} />
                  Clear all
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setAppliedStartDate(startDate);
                  setAppliedEndDate(endDate);
                  setPage(1);
                }}
                className="h-10 rounded-xl bg-silgate-primary px-5 text-xs font-semibold text-white hover:bg-silgate-primary/95 transition-all shadow-sm cursor-pointer"
              >
                Apply date range
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silgate-secondary/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search candidate name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-silgate-outline-variant/30 rounded-xl text-xs text-silgate-primary placeholder:text-silgate-secondary/40 focus:outline-none focus:border-silgate-tertiary transition-all"
          />
        </div>
        {isSuperadmin && (
          <button
            type="button"
            onClick={downloadCsv}
            disabled={csvDownloading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-black/90 transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            title="Download CSV"
          >
            <Download size={14} className="text-white/90" />
            {csvDownloading ? "Downloading..." : "Download CSV"}
          </button>
        )}

        {/* {isSuperadmin && ( */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openBulkModal}
            disabled={selectedRows.size === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            <Users size={14} />
            Bulk Assign
            {selectedRows.size > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-white/25 text-[10px] font-extrabold">
                {selectedRows.size}
              </span>
            )}
          </button>
        </div>
        {/* )} */}
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-silgate-outline-variant/25 bg-white shadow-sm overflow-hidden relative">
        {loading && submissions.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 min-h-[300px]">
            <div className="h-6 w-6 rounded-full border-2 border-silgate-tertiary border-t-transparent animate-spin" />
            <span className="text-xs font-medium text-silgate-secondary">
              Compiling candidate log grid...
            </span>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-center min-h-[300px]">
            <Layers className="text-silgate-secondary/40 w-10 h-10" />
            <p className="text-sm font-semibold text-silgate-primary mt-1">
              No Logs Registered
            </p>
            <p className="text-xs text-silgate-secondary">
              {searchQuery
                ? "Try resetting your search query filter."
                : "Click Add Details to log a candidate lineup."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse select-text">
                {/* Table Headings */}
                <thead>
                  <tr className="bg-silgate-container-low/70 border-b border-silgate-outline-variant/20">
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      <StyledCheckbox
                        refProp={selectAllRef}
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        ariaLabel="Select all rows"
                      />
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      Candidate Name
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      Location
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      Company Name
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      Interview Status
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      Designation
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      Source
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      Phone
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      Experience
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      Resume Status
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      Resume
                    </th>
                    {/* {isSuperadmin && ( */}
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      {isSuperadmin ? "Assigned To" : "Submitted By"}
                    </th>
                    {/* )} */}
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      Logged At
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                      Actions
                    </th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody className="divide-y divide-silgate-outline-variant/10 text-xs">
                  {submissions.map((row) => (
                    <tr
                      key={row._id}
                      className={`hover:bg-silgate-container-low/15 transition-all duration-150 group ${
                        selectedRows.has(row._id)
                          ? "bg-silgate-primary/[0.04]"
                          : ""
                      }`}
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-left">
                        <StyledCheckbox
                          checked={selectedRows.has(row._id)}
                          onChange={() => toggleRowSelection(row._id)}
                          ariaLabel={`Select ${row.candidateName}`}
                        />
                      </td>

                      {/* Candidate Name */}
                      <td className="whitespace-nowrap px-6 py-4 text-silgate-primary font-bold">
                        {/* {row.candidateName || "—"} */}
                        <div className="flex items-center gap-2">
                          <span>{row.candidateName}</span>

                          {isLeadNew(row.createdAt) ? (
                            <span
                              className="
          inline-flex
          items-center
          px-2
          py-0.5
          rounded-full
          text-[9px]
          font-extrabold
          uppercase
          tracking-wide
          bg-emerald-50
          text-emerald-700
          border
          border-emerald-200
        "
                            >
                              NEW
                            </span>
                          ) : (
                            <span></span>
                          )}
                        </div>
                      </td>

                      {/* Candidate Location */}
                      <td className="whitespace-nowrap px-6 py-4 text-silgate-secondary">
                        {row.candidateLocation || "—"}
                      </td>

                      {/* Company Name */}
                      <td className="whitespace-nowrap px-6 py-4 text-silgate-secondary">
                        {row.companyName || "—"}
                      </td>

                      {/* Interview Status */}
                      <td className="whitespace-nowrap px-6 py-4 text-silgate-secondary">
                        {row.interviewStatus || "—"}
                      </td>

                      {/* Designation */}
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-silgate-primary">
                        {row.candidateDesignation}
                      </td>

                      {/* Source */}
                      <td className="whitespace-nowrap px-6 py-4 text-silgate-secondary">
                        {row.source || "—"}
                      </td>

                      {/* Candidate Phone */}
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-silgate-secondary">
                        {row.candidatePhone}
                      </td>

                      {/* Experience */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border shadow-sm ${
                            row.experience === "Fresher"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              row.experience === "Fresher"
                                ? "bg-blue-500"
                                : "bg-amber-500"
                            }`}
                          ></span>

                          {row.experience === "Fresher"
                            ? "Fresher"
                            : "Experienced"}
                        </span>
                      </td>

                      {/* Resume Status */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border
                            ${
                              row.resumeStatus === "Sent"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                        >
                          {row.resumeStatus}
                        </span>
                      </td>

                      {/* Resume */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {row.resumeOriginalName ? (
                          <a
                            href={`${uploadLink}/uploads/resumes/${row?.resumeFileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
                          >
                            View
                          </a>
                        ) : (
                          <span>Not Uploaded</span>
                        )}
                      </td>

                      {/* Submitted By */}
                      <td className="whitespace-nowrap px-6 py-4 text-silgate-secondary font-medium">
                        {row.hrId?.name || "System"}
                      </td>

                      {/* Submitted By */}
                      {/* {isSuperadmin && (
                        <td className="whitespace-nowrap px-6 py-4 text-silgate-secondary font-medium">
                          {row.hrId?.name || "System"}
                        </td>
                      )} */}

                      {/* Logged At */}
                      <td className="whitespace-nowrap px-6 py-4 text-silgate-secondary font-medium">
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-6 py-4 text-left">
                        <button
                          onClick={() =>
                            navigate(
                              `/submissions/talent-corner/edit/${row._id}`,
                              { state: row },
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-silgate-outline-variant/30 hover:border-silgate-outline bg-white hover:bg-silgate-container-low/20 rounded-lg text-[10px] font-bold text-silgate-primary transition-all shadow-sm active:scale-[0.97] cursor-pointer"
                        >
                          <Edit size={10} className="text-silgate-tertiary" />
                          Update Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 border-t border-silgate-outline-variant/10 bg-white">
              <div className="flex items-center gap-4">
                <p className="text-xs text-silgate-secondary whitespace-nowrap font-semibold">
                  Showing{" "}
                  {totalSubmissions === 0 ? 0 : (page - 1) * pageSize + 1}–
                  {Math.min(page * pageSize, totalSubmissions)} of{" "}
                  {totalSubmissions}
                </p>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-silgate-secondary whitespace-nowrap font-semibold">
                    Rows:
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="border border-silgate-outline-variant/30 rounded-lg px-2 py-1 bg-white text-silgate-primary font-bold focus:outline-none focus:border-silgate-tertiary"
                  >
                    {[5, 10, 15, 20, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-xs text-silgate-secondary whitespace-nowrap font-semibold">
                  Page {page} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-silgate-container-low/30 hover:bg-silgate-container-low/50 text-xs text-silgate-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer border border-silgate-outline-variant/20"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-silgate-container-low/30 hover:bg-silgate-container-low/50 text-xs text-silgate-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer border border-silgate-outline-variant/20"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bulk Assign Modal */}
      {showBulkModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => !bulkAssigning && setShowBulkModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-silgate-outline-variant/20 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-5 py-4 border-b border-silgate-outline-variant/15">
              <div>
                <h3 className="text-sm font-bold text-silgate-primary">
                  Bulk Assign Candidates
                </h3>
                <p className="text-xs text-silgate-secondary mt-0.5">
                  Assigning {selectedRows.size} selected candidate
                  {selectedRows.size > 1 ? "s" : ""} to an HR.
                </p>
              </div>
              <button
                onClick={() => !bulkAssigning && setShowBulkModal(false)}
                className="p-1.5 rounded-lg hover:bg-silgate-container-low/40 text-silgate-secondary cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid gap-2">
                <label
                  htmlFor="bulk-assign-hr"
                  className="text-[11px] font-semibold text-silgate-secondary"
                >
                  Select HR
                </label>
                <select
                  id="bulk-assign-hr"
                  value={bulkAssignHr}
                  onChange={(e) => setBulkAssignHr(e.target.value)}
                  disabled={loadingHrs}
                  className="w-full px-3 py-2.5 text-xs border border-silgate-outline-variant/30 rounded-lg bg-white text-silgate-primary focus:outline-none focus:ring-1 focus:ring-silgate-tertiary focus:border-silgate-tertiary transition-all font-semibold"
                >
                  <option value="">
                    {loadingHrs ? "Loading..." : "Choose a recruiter"}
                  </option>
                  {hrs.map((hr) => (
                    <option key={hr._id} value={hr._id}>
                      {hr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-5 py-4 border-t border-silgate-outline-variant/15">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                disabled={bulkAssigning}
                className="h-9 rounded-xl border border-silgate-outline-variant/30 bg-white px-4 text-xs font-semibold text-silgate-secondary hover:bg-silgate-container-low transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitBulkAssign}
                disabled={bulkAssigning || !bulkAssignHr}
                className="h-9 rounded-xl bg-silgate-primary px-5 text-xs font-semibold text-white hover:bg-silgate-primary/95 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bulkAssigning ? "Assigning..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default TalentCornerSubmissions;

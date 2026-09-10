import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/axiosConfig";
import {
  Users,
  UserPlus,
  Search,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

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

const HrList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [hrToDelete, setHrToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const triggerDeleteConfirm = (hr) => {
    if (!hr?._id) return;
    setHrToDelete(hr);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!hrToDelete?._id || deleting) return;
    setDeleting(true);
    try {
      await Axios.delete(`/users/delete/${hrToDelete._id}`);
      setDeleteModalOpen(false);
      setHrToDelete(null);
      fetchHrList(currentPage);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete HR user.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const fetchHrList = async (pageToFetch = currentPage) => {
    setLoading(true);
    setError("");
    if (appliedStartDate && appliedEndDate && appliedStartDate > appliedEndDate) {
      setError("Start date cannot be after end date.");
      setRows([]);
      setTotalRows(0);
      setTotalPages(1);
      setLoading(false);
      return;
    }
    try {
      const response = await Axios.get("/users/allHR", {
        params: {
          page: pageToFetch,
          limit: itemsPerPage,
          search: debouncedSearch,
          ...(appliedStartDate ? { startDate: appliedStartDate } : {}),
          ...(appliedEndDate ? { endDate: appliedEndDate } : {}),
        },
      });
      const data = response?.data;
      const list = data?.hrUsers || [];
      setRows(list);
      setTotalRows(data?.totalHRUsers || 0);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load HR list",
      );
      setRows([]);
      setTotalRows(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when search or date filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, appliedStartDate, appliedEndDate]);

  // Fetch data on changes
  useEffect(() => {
    fetchHrList(currentPage);
  }, [currentPage, itemsPerPage, debouncedSearch, appliedStartDate, appliedEndDate]);

  const columns = [
    { key: "name", label: "Name" },
    { key: "ecnNumber", label: "ECN Number" },
    { key: "projects", label: "Projects" },
    { key: "status", label: "Status" },
    { key: "action", label: "Actions" },
  ];

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "HR";

  const avatarColors = [
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
  ];

  const getAvatarColor = (name) => {
    const idx = (name?.charCodeAt(0) || 0) % avatarColors.length;
    return avatarColors[idx];
  };

  return (
    <div className="h-full flex flex-col gap-0">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.15em] text-silgate-tertiary uppercase mb-1">
            Human Resources
          </p>
          <h1 className="text-2xl font-bold text-silgate-primary tracking-tight leading-none">
            HR Management
          </h1>
          <p className="text-xs text-silgate-secondary mt-1.5">
            Manage administrator accounts and project access privileges.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fetchHrList(currentPage)}
            className="h-9 w-9 flex items-center justify-center border border-silgate-outline-variant/40 bg-white rounded-lg hover:bg-silgate-container-low transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={14} className="text-silgate-secondary" />
          </button>
          <button
            type="button"
            onClick={() => navigate("/hr/create")}
            className="h-9 flex items-center gap-2 px-4 rounded-lg bg-silgate-primary text-white text-xs font-semibold hover:bg-silgate-primary/90 transition-all cursor-pointer shadow-sm"
          >
            <UserPlus size={13} />
            Add HR Account
          </button>
        </div>
      </div>

      {/* ── Stat strip + filter ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-3 mb-6">
        <div className="bg-white border border-silgate-outline-variant/25 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
            <Users size={15} />
          </div>
          <div>
            <p className="text-[10px] text-silgate-secondary font-medium">
              Total HR Users
            </p>
            <p className="text-lg font-bold text-silgate-primary leading-tight">
              {totalRows}
            </p>
          </div>
        </div>

        <div className="bg-white border border-silgate-outline-variant/25 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col gap-2 px-5 py-4 border-b border-silgate-outline-variant/20 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-silgate-secondary mb-1">
                Filter
              </p>
              <h2 className="text-sm font-semibold text-silgate-primary">
                Date range
              </h2>
            </div>
            <p className="text-xs text-silgate-secondary max-w-xs">
              Refine HR user results by selecting a date range up to today.
            </p>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-[1fr_1fr_auto] items-end">
            <div className="grid gap-2">
              <label
                htmlFor="start-date-filter"
                className="text-[11px] font-semibold text-silgate-secondary"
              >
                Start date
              </label>
              <input
                id="start-date-filter"
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
            <div className="grid gap-2">
              <label
                htmlFor="end-date-filter"
                className="text-[11px] font-semibold text-silgate-secondary"
              >
                End date
              </label>
              <input
                id="end-date-filter"
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setAppliedStartDate(startDate);
                  setAppliedEndDate(endDate);
                  setCurrentPage(1);
                }}
                className="h-11 rounded-xl bg-silgate-primary px-5 text-xs font-semibold text-white hover:bg-silgate-primary/90 transition-all shadow-sm"
              >
                Apply filter
              </button>
              {(appliedStartDate || appliedEndDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setAppliedStartDate("");
                    setAppliedEndDate("");
                    setCurrentPage(1);
                  }}
                  className="h-11 rounded-xl border border-silgate-outline-variant/30 bg-white px-4 text-xs font-semibold text-silgate-secondary hover:bg-silgate-container-low transition-all shadow-sm cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="flex-1 bg-white border border-silgate-outline-variant/25 rounded-xl overflow-hidden flex flex-col min-h-0">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-3.5 border-b border-silgate-outline-variant/20">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-silgate-secondary/50" />
            <input
              type="text"
              placeholder="Search by name, ECN or role…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-silgate-container-low/60 border border-silgate-outline-variant/30 rounded-lg text-silgate-primary placeholder:text-silgate-secondary/40 focus:outline-none focus:ring-1 focus:ring-silgate-tertiary focus:border-silgate-tertiary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-silgate-secondary">
            <span className="font-medium">{totalRows}</span>
            <span>record{totalRows !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Table body */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-silgate-tertiary border-t-transparent animate-spin" />
              <span className="text-xs text-silgate-secondary">Loading…</span>
            </div>
          ) : error ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-center px-6">
              <AlertCircle className="text-red-400 w-8 h-8" />
              <p className="text-sm font-semibold text-silgate-primary">
                Failed to load data
              </p>
              <p className="text-xs text-silgate-secondary max-w-xs">{error}</p>
              <button
                onClick={() => fetchHrList(currentPage)}
                className="mt-2 px-4 py-1.5 text-xs font-semibold bg-silgate-primary text-white rounded-lg cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : totalRows === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 bg-silgate-container-low rounded-full flex items-center justify-center mb-1">
                <Users className="w-5 h-5 text-silgate-secondary/50" />
              </div>
              <p className="text-sm font-semibold text-silgate-primary">
                No HR users found
              </p>
              <p className="text-xs text-silgate-secondary">
                {searchQuery
                  ? "Try a different search term."
                  : "Create your first HR account."}
              </p>
            </div>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-silgate-container-low/70 border-b border-silgate-outline-variant/20">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="whitespace-nowrap px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const projects = Array.isArray(r?.projects) ? r.projects : [];
                  return (
                    <tr
                      key={r?._id || i}
                      className="border-b border-silgate-outline-variant/10 hover:bg-silgate-container-low/15 transition-all duration-150 group"
                    >
                      {/* Name */}
                      <td className="whitespace-nowrap px-6 py-4 text-left">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${getAvatarColor(r?.name)}`}
                          >
                            {getInitials(r?.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-silgate-primary truncate">
                              {r?.name || "—"}
                            </p>
                            <p className="text-[10px] text-silgate-secondary/60 truncate">
                              ID: {r?._id?.slice(-6) || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ECN */}
                      <td className="whitespace-nowrap px-6 py-4 text-left text-silgate-primary font-semibold">
                        {r?.ecn || "—"}
                      </td>

                      {/* Projects */}
                      <td className="whitespace-nowrap px-6 py-4 text-left">
                        <div className="flex flex-wrap gap-1">
                          {projects.length === 0 ? (
                            <span className="text-[10px] text-silgate-secondary/40">
                              —
                            </span>
                          ) : (
                            projects.slice(0, 3).map((p, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 text-[10px] font-medium"
                              >
                                {p}
                              </span>
                            ))
                          )}
                          {projects.length > 3 && (
                            <span className="text-[10px] text-silgate-secondary font-medium">
                              +{projects.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* status */}
                      <td className="whitespace-nowrap px-6 py-4 text-left">
                        <StatusBadge status={r?.status || "active"} />
                      </td>

                      {/* Action */}
                      <td className="whitespace-nowrap px-6 py-4 text-left">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/hr/create/${r?._id}`, { state: r })
                            }
                            className="px-3.5 py-1.5 border border-silgate-outline-variant/30 hover:border-silgate-outline bg-white hover:bg-silgate-container-low/20 rounded-lg text-[10px] font-bold text-silgate-primary transition-all shadow-sm active:scale-[0.97] cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerDeleteConfirm(r)}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-red-100 bg-white hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer text-red-500 shadow-sm active:scale-[0.97]"
                            title="Delete"
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Pagination ── */}
        {!loading && totalRows > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-silgate-outline-variant/20 bg-white shrink-0">
            <div className="flex items-center gap-3 text-xs text-silgate-secondary">
              <span>
                Showing{" "}
                <span className="font-semibold text-silgate-primary">
                  {totalRows === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
                  {Math.min(currentPage * itemsPerPage, totalRows)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-silgate-primary">
                  {totalRows}
                </span>
              </span>
              <div className="flex items-center gap-1.5">
                <span>Rows:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-silgate-outline-variant/30 rounded-md px-1.5 py-0.5 bg-white text-silgate-primary font-semibold focus:outline-none text-xs"
                >
                  {[5, 10, 15, 20, 50].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="h-7 w-7 flex items-center justify-center rounded-md border border-silgate-outline-variant/30 bg-white hover:bg-silgate-container-low text-silgate-secondary disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) page = i + 1;
                  else if (currentPage >= totalPages - 2)
                    page = totalPages - 4 + i;
                  else page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-7 w-7 text-xs rounded-md border transition cursor-pointer font-medium
                      ${
                        page === currentPage
                          ? "bg-silgate-primary text-white border-silgate-primary"
                          : "border-silgate-outline-variant/30 bg-white text-silgate-secondary hover:bg-silgate-container-low"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="h-7 w-7 flex items-center justify-center rounded-md border border-silgate-outline-variant/30 bg-white hover:bg-silgate-container-low text-silgate-secondary disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => (deleting ? null : setDeleteModalOpen(false))}
            />
            <div className="relative w-full max-w-md rounded-2xl bg-white border border-silgate-outline-variant/25 shadow-2xl overflow-hidden z-10">
              <div className="px-6 py-4 border-b border-silgate-outline-variant/20">
                <p className="text-sm font-semibold text-silgate-primary">
                  Confirm deletion
                </p>
                <p className="text-xs text-silgate-secondary mt-1">
                  Delete{" "}
                  <span className="font-semibold text-silgate-primary">
                    {hrToDelete?.name || "this HR user"}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
              <div className="px-6 py-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-silgate-outline-variant/30 bg-white hover:bg-silgate-container-low/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default HrList;

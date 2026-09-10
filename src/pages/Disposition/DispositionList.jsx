import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "@/utils/axiosConfig";
import {
  Layers,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Briefcase,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Trash,
} from "lucide-react";
import { toast } from "react-toastify";

const DispositionList = () => {
  const navigate = useNavigate();

  // States for disposition listing
  const [dispositions, setDispositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectFilter, setProjectFilter] = useState(""); // empty string means all
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDispositions, setTotalDispositions] = useState(0);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dispositionToDelete, setDispositionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch dispositions from backend
  const fetchDispositions = async (pageToFetch = page) => {
    setLoading(true);
    try {
      const response = await Axios.get("/disposition", {
        params: {
          page: pageToFetch,
          limit: pageSize,
          project: projectFilter || undefined,
        },
      });
      const resData = response?.data;
      if (resData) {
        setDispositions(resData.data || []);
        setPage(resData.currentPage || 1);
        setTotalPages(resData.totalPages || 1);
        setTotalDispositions(resData.totalDispositions || 0);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch dispositions.",
      );
      setDispositions([]);
      setTotalDispositions(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  console.log(dispositions)

  // Reset page when project filter changes
  useEffect(() => {
    setPage(1);
  }, [projectFilter]);

  // Fetch dispositions on parameters change
  useEffect(() => {
    fetchDispositions(page);
  }, [page, pageSize, projectFilter]);

  // Trigger delete confirmation
  const confirmDelete = (disposition) => {
    setDispositionToDelete(disposition);
    setDeleteModalOpen(true);
  };

  // Execute deletion
  const handleDelete = async () => {
    if (!dispositionToDelete || deleting) return;
    setDeleting(true);
    try {
      await Axios.delete(`/disposition/${dispositionToDelete._id}`);
      toast.success("Disposition deleted successfully.");
      setDeleteModalOpen(false);
      setDispositionToDelete(null);
      // Fetch dispositions again (handle edge case where we delete the last item on the page)
      const isLastItemOnPage = dispositions.length === 1 && page > 1;
      const nextPage = isLastItemOnPage ? page - 1 : page;
      fetchDispositions(nextPage);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete disposition.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 fade-in-slide relative min-h-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <span className="text-[10px] tracking-widest text-silgate-tertiary font-bold uppercase">
            Administrative Settings
          </span>
          <h1 className="text-xl font-bold tracking-tight text-silgate-primary mt-1 flex items-center gap-2">
            <Layers className="w-5 h-5 text-silgate-tertiary" />
            Disposition Directory
          </h1>
          <p className="text-xs text-silgate-secondary mt-1">
            Configure candidate dispositions and filter permissions across
            the Silgate platform.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => fetchDispositions(page)}
            className="p-2.5 bg-white border border-silgate-outline-variant/30 hover:border-silgate-outline rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            title="Refresh Directory"
          >
            <RefreshCw size={14} className="text-silgate-secondary" />
          </button>

          <button
            onClick={() => navigate("/disposition/create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-silgate-primary text-white text-xs font-semibold hover:bg-silgate-primary/95 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Plus size={14} className="text-silgate-tertiary" />
            <span>Add Disposition</span>
          </button>
        </div>
      </div>

      {/* FILTERS CONTAINER */}
      <div className="bg-white rounded-2xl border border-silgate-outline-variant/20 shadow-sm p-4 flex items-center justify-start">
        {/* Campaign Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-silgate-secondary uppercase shrink-0">
            Filter Campaign:
          </span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full sm:w-44 text-xs text-silgate-primary bg-white border border-silgate-outline-variant/30 rounded-xl px-3 py-2 focus:outline-none focus:border-silgate-tertiary cursor-pointer"
          >
            <option value="">All Campaigns</option>
            <option value="Silgate">Silgate Only</option>
          </select>
        </div>
      </div>

      {/* TABLE AND PAGINATION */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-silgate-outline-variant/20 shadow-sm">
          <div className="h-6 w-6 rounded-full border-2 border-silgate-tertiary border-t-transparent animate-spin" />
          <span className="text-xs font-medium text-silgate-secondary">
            Syncing dispositions...
          </span>
        </div>
      ) : totalDispositions === 0 ? (
        <div className="p-16 flex flex-col items-center justify-center gap-2 text-center bg-white rounded-2xl border border-silgate-outline-variant/20 shadow-sm">
          <Layers className="text-silgate-secondary/40 w-10 h-10" />
          <p className="text-sm font-semibold text-silgate-primary mt-1">
            No Dispositions Found
          </p>
          <p className="text-xs text-silgate-secondary max-w-xs mx-auto">
            {projectFilter
              ? "Try adjusting your filter tags."
              : "Start by registering your first disposition by clicking the Add Disposition button."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-silgate-outline-variant/20 shadow-sm overflow-hidden animate-in fade-in duration-200">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-silgate-container-low/70 border-b border-silgate-outline-variant/20">
                  <th className="whitespace-nowrap px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                    Disposition Name
                  </th>
                  <th className="whitespace-nowrap px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                    Assigned Campaigns
                  </th>
                  <th className="whitespace-nowrap px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                    Created By
                  </th>
                  <th className="whitespace-nowrap px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-silgate-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-silgate-outline-variant/10 text-xs">
                {dispositions.map((disposition) => (
                  <tr
                    key={disposition._id}
                    className="hover:bg-silgate-container-low/15 transition-all duration-150 group"
                  >
                    {/* Disposition Name */}
                    <td className="px-5 py-3.5 font-bold text-silgate-primary text-left">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-silgate-container-low flex items-center justify-center border border-silgate-outline-variant/15 text-silgate-primary">
                          <Briefcase size={12} />
                        </div>
                        <span className="tracking-wide">
                          {disposition.disposition}
                        </span>
                      </div>
                    </td>

                    {/* Associated Projects/Campaigns */}
                    <td className="px-5 py-3.5 text-left">
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(disposition.project) ? (
                          disposition.project.map((proj) => {
                            const isSilgate = proj === "Silgate";
                            return (
                              <span
                                key={proj}
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                                  isSilgate
                                    ? "bg-blue-50 text-blue-700 border-blue-200/50"
                                    : "bg-indigo-50 text-indigo-700 border-indigo-200/50"
                                }`}
                              >
                                {proj}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </div>
                    </td>

                    {/* Operator who created */}
                    <td className="whitespace-nowrap px-5 py-3.5 text-silgate-secondary font-semibold text-left">
                      <div className="flex items-center gap-1.5">
                        <UserCheck
                          size={12}
                          className="text-silgate-secondary/60"
                        />
                        <span>{disposition.createdBy?.name || "System"}</span>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="whitespace-nowrap px-5 py-3.5 text-right font-medium">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() =>
                            navigate(`/disposition/edit/${disposition._id}`, {
                              state: disposition,
                            })
                          }
                          className="p-1.5 text-silgate-secondary hover:text-silgate-primary hover:bg-silgate-container-low rounded-lg transition-all cursor-pointer"
                          title="Edit disposition"
                        >
                          <Edit size={13} />
                        </button>

                        <button
                          onClick={() => confirmDelete(disposition)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Delete disposition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION PANEL */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 border-t border-silgate-outline-variant/10 bg-white">
            <div className="flex items-center gap-4">
              <p className="text-xs text-silgate-secondary whitespace-nowrap font-semibold">
                Showing{" "}
                {totalDispositions === 0 ? 0 : (page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, totalDispositions)} of{" "}
                {totalDispositions}
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
                  className="border border-silgate-outline-variant/30 rounded-lg px-2 py-1 bg-white text-silgate-primary font-bold focus:outline-none focus:border-silgate-tertiary cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
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
                  className="px-3 py-1 rounded-lg bg-silgate-container-low/30 hover:bg-silgate-container-low/50 text-xs text-silgate-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer border border-silgate-outline-variant/20"
                >
                  Prev
                </button>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-lg bg-silgate-container-low/30 hover:bg-silgate-container-low/50 text-xs text-silgate-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer border border-silgate-outline-variant/20"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE DIALOG MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-silgate-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-silgate-outline-variant/30 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <AlertCircle size={18} />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="text-sm font-bold text-silgate-primary">
                  Delete Disposition
                </h3>
                <p className="text-xs text-silgate-secondary">
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-silgate-primary">
                    "{dispositionToDelete?.disposition}"
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDispositionToDelete(null);
                }}
                disabled={deleting}
                className="px-4 py-2 border border-silgate-outline-variant/40 rounded-lg text-xs font-semibold text-silgate-secondary hover:bg-silgate-container-low transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                {deleting ? (
                  <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispositionList;
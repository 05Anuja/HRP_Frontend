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
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { uploadLink } from "../../../constants";

const TalentCornerHeader = ({
    filters,
    onFiltersChange,
    companyTotal = 0,
    candidateTotal = 0,
    hrTotal = 0,
}) => {

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
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedHr, setSelectedHr] = useState("");

    const [designations, setDesignations] = useState([]);
    const [hrs, setHrs] = useState([]);
    const [loadingDesignations, setLoadingDesignations] = useState(false);
    const [loadingHrs, setLoadingHrs] = useState(false);

    // CSV Downloading States
    const [companyCsvDownloading, setCompanyCsvDownloading] = useState(false);
    const [candidateCsvDownloading, setCandidateCsvDownloading] = useState(false);
    const [hrCsvDownloading, setHrCsvDownloading] = useState(false);

    // Guards against stale/out-of-order responses overwriting newer ones
    const fetchSeq = useRef(0);

    const today = new Date().toISOString().slice(0, 10);
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const role = user?.role;
    const isSuperadmin = role === "superadmin";
    const isHr = role === "hr";
    const fetchUrl = isSuperadmin ? "/silgate/allData" : "/silgate/myData";

    // Languages
    const COMMON_LANGUAGES = [
        "English",
        "Hindi",
        "Marathi",
        "Gujarati",
        "Telugu",
        "Tamil",
        "Kannada",
        "Bengali",
        "Malayalam",
        "Punjabi",
    ];

    // Retrieves submission data with pagination, search, and filter parameters,
    // then updates the UI state with the latest results.
    const fetchSubmissions = async ({
        startDate: fetchStartDate = appliedStartDate,
        endDate: fetchEndDate = appliedEndDate,
        pageToFetch = page,
    } = {}) => {
        const seq = ++fetchSeq.current;
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
                    ...(selectedLanguage ? { language: selectedLanguage } : {}),
                    ...(selectedHr ? { hr: selectedHr } : {}),
                },
            });

            // A newer request has already fired since this one started — ignore this response
            if (seq !== fetchSeq.current) return;

            const payload = response?.data;
            // Handle array or pagination wrappers
            const list = payload?.submissions || payload?.data || [];
            setSubmissions(list);
            setTotalSubmissions(
                payload?.totalSubmissions ?? payload?.total ?? list.length,
            );
            setTotalPages(payload?.totalPages || 1);
        } catch (err) {
            if (seq === fetchSeq.current) {
                toast.error(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to sync Silgate dataset.",
                );
            }
        } finally {
            if (seq === fetchSeq.current) setLoading(false);
        }
    };

    // Actual CSV downloader
    const triggerCsvDownload = (data, filenamePrefix) => {
        const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute(
            "download",
            `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    };

    // Download Company Data in CSV
    const downloadCompanyCsv = async () => {
        if (companyCsvDownloading) return;
        setCompanyCsvDownloading(true);
        try {
            const response = await Axios.get("/dashboard/company-designation-report/export", {
                params: {
                    ...(filters?.hrId && filters.hrId !== "all" ? { hrId: filters.hrId } : {}),
                    ...(filters?.startDate ? { startDate: filters.startDate } : {}),
                    ...(filters?.endDate ? { endDate: filters.endDate } : {}),
                    ...(filters?.designation ? { designation: filters.designation } : {}),
                    ...(filters?.language ? { language: filters.language } : {}),
                },
                responseType: "blob",
            });
            triggerCsvDownload(response.data, "company_designation_report");
            toast.success("Download started successfully.");
        } catch (err) {
            toast.error(
                err?.response?.data?.message || err?.message || "Failed to download Company Report CSV.",
            );
        } finally {
            setCompanyCsvDownloading(false);
        }
    };

    // Download Candidate Data in CSV
    const downloadCandidateCsv = async () => {
        if (candidateCsvDownloading) return;
        setCandidateCsvDownloading(true);
        try {
            const response = await Axios.get("/dashboard/candidate-details-report/export", {
                params: {
                    ...(filters?.hrId && filters.hrId !== "all" ? { hrId: filters.hrId } : {}),
                    ...(filters?.startDate ? { startDate: filters.startDate } : {}),
                    ...(filters?.endDate ? { endDate: filters.endDate } : {}),
                    ...(filters?.designation ? { designation: filters.designation } : {}),
                    ...(filters?.language ? { language: filters.language } : {}),
                },
                responseType: "blob",
            });
            triggerCsvDownload(response.data, "candidate_details_report");
            toast.success("Download started successfully.");
        } catch (err) {
            toast.error(
                err?.response?.data?.message || err?.message || "Failed to download Candidate Report CSV.",
            );
        } finally {
            setCandidateCsvDownloading(false);
        }
    };

    // Download HR Data in CSV
    const downloadHrCsv = async () => {
        if (hrCsvDownloading) return;
        setHrCsvDownloading(true);
        try {
            const response = await Axios.get("/dashboard/hr-company-status-report/export", {
                params: {
                    ...(filters?.hrId && filters.hrId !== "all" ? { hrId: filters.hrId } : {}),
                    ...(filters?.startDate ? { startDate: filters.startDate } : {}),
                    ...(filters?.endDate ? { endDate: filters.endDate } : {}),
                    ...(filters?.designation ? { designation: filters.designation } : {}),
                    ...(filters?.language ? { language: filters.language } : {}),
                },
                responseType: "blob",
            });
            triggerCsvDownload(response.data, "hr_company_status_report");
            toast.success("Download started successfully.");
        } catch (err) {
            toast.error(
                err?.response?.data?.message || err?.message || "Failed to download HR Report CSV.",
            );
        } finally {
            setHrCsvDownloading(false);
        }
    };

    // Fetch designations & HRs on mount
    useEffect(() => {
        const fetchDesignations = async () => {
            setLoadingDesignations(true);
            try {
                const res = await Axios.get("/designations", {
                    params: { project: "Silgate", limit: 1000 },
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

    useEffect(() => {
        if (isSuperadmin) {
            const fetchHrs = async () => {
                setLoadingHrs(true);
                try {
                    const res = await Axios.get("/users/allHR");
                    setHrs(res?.data?.hrUsers || []);
                } catch (err) {
                    console.error("Failed to fetch HRs", err);
                } finally {
                    setLoadingHrs(false);
                }
            };
            fetchHrs();
        }
    }, [isSuperadmin]);

    // Debounce the raw search input into debouncedSearch
    useEffect(() => {
        const handle = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400);
        return () => clearTimeout(handle);
    }, [searchQuery]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [
        debouncedSearch,
        appliedStartDate,
        appliedEndDate,
        selectedDesignation,
        selectedLanguage,
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
        selectedLanguage,
        selectedHr,
    ]);

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
                        Silgate Candidate Logs
                    </h1>
                    <p className="text-xs text-silgate-secondary mt-1">
                        Auditing and logging submissions, disposition states, and operator
                        inputs for the Silgate campaign.
                    </p>
                </div>

                {/* <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => fetchSubmissions({ pageToFetch: page })}
                        className="p-2.5 bg-white border border-silgate-outline-variant/30 hover:border-silgate-outline rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                        title="Refresh logs"
                    >
                        <RefreshCw size={14} className="text-silgate-secondary" />
                    </button>
                    {!isSuperadmin && (
                        <button
                            onClick={() => navigate("/submissions/silgate/create")}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-silgate-primary text-white text-xs font-bold hover:bg-silgate-primary/95 transition-all shadow-sm active:scale-[0.98] cursor-pointer border border-white/5"
                        >
                            <Plus size={14} className="text-silgate-tertiary" />
                            Add Details
                        </button>
                    )}
                </div> */}
            </div>

            {/* Grid: Stat cards and date filters */}
            <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-5">
                {/* Metric Cards || total count — one total per table */}
                <div className="flex flex-col gap-3">
                    <div className="p-4 rounded-xl bg-white border border-silgate-outline-variant/10 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-silgate-primary/10 rounded-xl">
                            <Layers size={18} className="text-silgate-primary" />
                        </div>
                        <div>
                            <span className="text-[10px] text-silgate-secondary uppercase tracking-wider font-semibold block">
                                Company Report
                            </span>
                            <span className="text-xl font-extrabold text-silgate-primary block mt-0.5">
                                {companyTotal}
                            </span>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-silgate-outline-variant/10 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-silgate-primary/10 rounded-xl">
                            <Layers size={18} className="text-silgate-primary" />
                        </div>
                        <div>
                            <span className="text-[10px] text-silgate-secondary uppercase tracking-wider font-semibold block">
                                Candidate Report
                            </span>
                            <span className="text-xl font-extrabold text-silgate-primary block mt-0.5">
                                {candidateTotal}
                            </span>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-silgate-outline-variant/10 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-silgate-primary/10 rounded-xl">
                            <Layers size={18} className="text-silgate-primary" />
                        </div>
                        <div>
                            <span className="text-[10px] text-silgate-secondary uppercase tracking-wider font-semibold block">
                                HR Report
                            </span>
                            <span className="text-xl font-extrabold text-silgate-primary block mt-0.5">
                                {hrTotal}
                            </span>
                        </div>
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
                            Filter candidate logs by date range, designation, language, or
                            recruiter.
                        </p>
                    </div>

                    <div className="p-5 space-y-4">
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
                                        const value = e.target.value;
                                        setSelectedDesignation(value);
                                        setPage(1);
                                        onFiltersChange((prev) => ({ ...prev, designation: value }));
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

                            {/* Language Filter */}
                            <div className="grid gap-2">
                                <label
                                    htmlFor="language-filter"
                                    className="text-[11px] font-semibold text-silgate-secondary"
                                >
                                    Language
                                </label>
                                <select
                                    id="language-filter"
                                    value={selectedLanguage}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedLanguage(value);
                                        setPage(1);
                                        onFiltersChange((prev) => ({ ...prev, language: value }));
                                    }}
                                    className="w-full px-3 py-2 text-xs border border-silgate-outline-variant/30 rounded-lg bg-white text-silgate-primary focus:outline-none focus:ring-1 focus:ring-silgate-tertiary focus:border-silgate-tertiary transition-all font-semibold"
                                >
                                    <option value="">All Languages</option>
                                    {COMMON_LANGUAGES.map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang}
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
                                            const value = e.target.value;
                                            setSelectedHr(value);
                                            setPage(1);
                                            onFiltersChange((prev) => ({ ...prev, hrId: value }));
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
                                selectedLanguage ||
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
                                            setSelectedLanguage("");
                                            setSelectedHr("");
                                            setPage(1);
                                            onFiltersChange({
                                                startDate: "",
                                                endDate: "",
                                                designation: "",
                                                language: "",
                                                hrId: "",
                                            });
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
                                    onFiltersChange((prev) => ({ ...prev, startDate, endDate }));
                                }}
                                className="h-10 rounded-xl bg-silgate-primary px-5 text-xs font-semibold text-white hover:bg-silgate-primary/95 transition-all shadow-sm cursor-pointer"
                            >
                                Apply date range
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSV Download buttons — one per report table */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Company CSV download button */}
                <button
                    type="button"
                    onClick={downloadCompanyCsv}
                    disabled={companyCsvDownloading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-black/90 transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    title="Download Company Report CSV"
                >
                    <Download size={14} className="text-white/90" />
                    {companyCsvDownloading ? "Downloading..." : "Company Report CSV"}
                </button>

                {/* Candidate CSV download button */}
                <button
                    type="button"
                    onClick={downloadCandidateCsv}
                    disabled={candidateCsvDownloading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-black/90 transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    title="Download Candidate Report CSV"
                >
                    <Download size={14} className="text-white/90" />
                    {candidateCsvDownloading ? "Downloading..." : "Candidate Report CSV"}
                </button>

                {/* HR CSV download button */}
                <button
                    type="button"
                    onClick={downloadHrCsv}
                    disabled={hrCsvDownloading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-black/90 transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    title="Download HR Report CSV"
                >
                    <Download size={14} className="text-white/90" />
                    {hrCsvDownloading ? "Downloading..." : "HR Report CSV"}
                </button>
            </div>
        </div>
    );
};

export default TalentCornerHeader;
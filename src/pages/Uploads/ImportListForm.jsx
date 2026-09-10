import Axios from "@/utils/axiosConfig";
import { ArrowLeft, UploadCloud, Download, FileText, Users, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ImportListForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const list = location.state?.list || null;
  const listId = list?._id || list?.id || "";
  const campaign = list?.campaign || "";

  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Users States
  const [users, setUsers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const usersRef = useRef(null);

  const [downloadingSample, setDownloadingSample] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (usersRef.current && !usersRef.current.contains(e.target)) {
        setUsersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch HR users for the auto-fetched campaign
  useEffect(() => {
    if (!campaign) return;
    const fetchAllHrUsers = async () => {
      setLoadingUsers(true);
      try {
        let page = 1;
        let totalPages = 1;
        let allUsers = [];

        do {
          const response = await Axios.get("/users/allHR", {
            params: { campaign, project: campaign, page, limit: 100 },
          });
          const data = response?.data;
          const listUsers = data?.hrUsers || [];
          allUsers = allUsers.concat(listUsers);
          totalPages = data?.totalPages || 1;
          page += 1;
        } while (page <= totalPages);

        setUserOptions(
          allUsers.map((u) => ({
            id: u._id ?? u.id,
            name: u.name ?? u.fullName ?? u.email ?? "Unnamed",
          }))
        );
      } catch (err) {
        console.error("Failed to fetch HR users", err);
        setUserOptions([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchAllHrUsers();
  }, [campaign]);

  const resetForm = () => {
    setFile(null);
    setUsers([]);
    setUsersOpen(false);
    setErrors({});
  };

  const handleFileSelect = (f) => {
    if (!f) return;
    setFile(f);
    setErrors((e) => ({ ...e, file: undefined }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  const toggleUser = (userId) => {
    setUsers((prev) =>
      prev.includes(userId) ? prev.filter((u) => u !== userId) : [...prev, userId]
    );
  };

  // Download sample data from backend /isample sending campaign parameter
  const handleDownloadSample = async () => {
    if (!campaign) {
      setErrors((prev) => ({
        ...prev,
        sample: "Campaign is missing from list. Cannot download sample data.",
      }));
      return;
    }

    setDownloadingSample(true);
    setErrors((prev) => ({ ...prev, sample: undefined }));

    try {
      // Send GET /isample with campaign as query parameter
      const response = await Axios.get("/lists/sample", {
        params: { campaign },
        responseType: "blob",
      });

      let filename = `${campaign.toLowerCase().replace(/\s+/g, "_")}_sample.csv`;
      const disposition = response.headers?.["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, "");
        }
      }

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.warn("GET /isample failed, attempting POST fallback...", err);
      try {
        // Fallback to POST /isample with campaign body if backend expects POST
        const postRes = await Axios.post(
          "/lists/sample",
          { campaign },
          { responseType: "blob" }
        );
        const blob = new Blob([postRes.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute(
          "download",
          `${campaign.toLowerCase().replace(/\s+/g, "_")}_sample.csv`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (fallbackErr) {
        console.error("Failed to download sample from backend", fallbackErr);
        setErrors((prev) => ({
          ...prev,
          sample: "Failed to download sample data from backend /isample.",
        }));
      }
    } finally {
      setDownloadingSample(false);
    }
  };

  const validate = () => {
    const next = {};
    if (!file) next.file = "Please upload a file to import";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleImportLeads = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setErrors((e) => ({ ...e, submit: undefined }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("listId", listId);
      formData.append("campaign", campaign);
      formData.append("project", campaign);
      // formData.append("users", JSON.stringify(users));
      formData.append("selectedUserIds", JSON.stringify(users));

      await Axios.post("/lists/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/uploads");
    } catch (err) {
      console.error("Failed to import leads", err);
      setErrors((e) => ({
        ...e,
        submit: err.response?.data?.message || "Failed to import leads. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedUserNames = userOptions
    .filter((u) => users.includes(u.id))
    .map((u) => u.name);

  return (
    <div className="fade-in-slide max-w-4xl mx-auto py-4">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/uploads")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-all cursor-pointer mb-6"
      >
        <ArrowLeft size={14} />
        Back to Uploads
      </button>

      {/* Header */}
      <div className="mb-7 text-left">
        <p className="text-[11px] font-semibold tracking-wider text-indigo-600 uppercase mb-1">
          Import Leads
        </p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Import Leads to List
        </h1>

        {/* Auto-fetched Campaign & List info badge */}
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          {list?.name && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-800">
              List: <strong className="font-semibold text-gray-900">{list.name}</strong>
              {listId && <span className="text-gray-400">({listId})</span>}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-800">
            Auto-fetched Campaign:
            <strong className="font-bold text-indigo-600">
              {campaign || "None"}
            </strong>
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Step 1: Download sample data from backend */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">1. Download Sample Data</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Download the backend sample template matching the campaign{" "}
                <span className="font-semibold text-indigo-600">
                  {campaign || "(Not Specified)"}
                </span>
                .
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadSample}
              disabled={downloadingSample || !campaign}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
            >
              {downloadingSample ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                  <span>Downloading Sample...</span>
                </>
              ) : (
                <>
                  <Download size={15} />
                  <span>Download {campaign || ""} Sample</span>
                </>
              )}
            </button>
          </div>
          {errors.sample && (
            <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={13} /> {errors.sample}
            </p>
          )}
        </div>

        <div className="my-6 border-b border-gray-100" />

        {/* Step 2: File upload */}
        <div>
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-gray-900">2. File Upload</h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Upload your CSV, XLSX, or XLS file containing leads.
          </p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={
              "mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors " +
              (dragActive
                ? "border-indigo-500 bg-indigo-50"
                : "border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70")
            }
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow">
              <UploadCloud size={22} />
            </div>
            {file ? (
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-indigo-900">{file.name}</span>
                <span className="text-xs text-gray-500 mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB — Click or drag another file to replace
                </span>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-800">
                  Click or drag your file here to upload
                </p>
                <p className="mt-1 text-xs text-gray-500">Supports CSV, XLSX, or XLS</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />
          </div>
          {errors.file && <p className="mt-1.5 text-xs text-red-500">{errors.file}</p>}
        </div>

        <div className="my-6 border-b border-gray-100" />

        {/* Step 3: Assign Users */}
        <div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-gray-900">3. Assign Users (Optional)</h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Select one or more team members to assign these imported leads to.
          </p>

          <div className="mt-3 relative max-w-md" ref={usersRef}>
            <button
              type="button"
              onClick={() => setUsersOpen((o) => !o)}
              disabled={loadingUsers}
              className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-left text-sm disabled:opacity-60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <span
                className={
                  "truncate " +
                  (selectedUserNames.length ? "text-gray-900 font-medium" : "text-gray-400")
                }
              >
                {loadingUsers
                  ? "Loading users..."
                  : selectedUserNames.length
                    ? selectedUserNames.join(", ")
                    : "Select users"}
              </span>
              <span className="text-gray-400 ml-1 shrink-0">▾</span>
            </button>
            {usersOpen && !loadingUsers && (
              <div className="absolute top-full left-0 mt-1 z-20 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
                {userOptions.length === 0 && (
                  <p className="px-3.5 py-2 text-xs text-gray-400">No users found</p>
                )}
                {userOptions.map((u) => (
                  <label
                    key={u.id}
                    className="flex cursor-pointer items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={users.includes(u.id)}
                      onChange={() => toggleUser(u.id)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="truncate">{u.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {errors.submit && (
          <div className="mt-5 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600 flex items-center gap-1.5">
            <AlertCircle size={14} />
            {errors.submit}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={resetForm}
            className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            Reset Form
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/uploads")}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImportLeads}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  <span>Import Leads</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportListForm;
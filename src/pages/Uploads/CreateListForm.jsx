import Axios from "@/utils/axiosConfig";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const CAMPAIGN_OPTIONS = ["Silgate", "Talent Corner"];

const CreateListForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    listId: id || "",
    name: "",
    description: "",
    campaign: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit && !location.state?.list);

  useEffect(() => {
    if (isEdit) {
      if (location.state?.list) {
        const item = location.state.list;
        setForm({
          listId: item.id ?? id,
          name: item.name ?? "",
          description: item.description === "N/A" ? "" : item.description ?? "",
          campaign: item.campaign ?? "",
        });
      } else {
        const fetchList = async () => {
          setLoading(true);
          try {
            const res = await Axios.get("/lists");
            const found = (res.data?.lists || []).find((l) => l.id === id);
            if (found) {
              setForm({
                listId: found.id,
                name: found.name || "",
                description: found.description === "N/A" ? "" : found.description || "",
                campaign: found.campaign || "",
              });
            }
          } catch (err) {
            console.error("Failed to load list details", err);
          } finally {
            setLoading(false);
          }
        };
        fetchList();
      }
    }
  }, [id, isEdit, location.state]);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (isEdit && !form.listId.trim()) next.listId = "List ID is required";
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.campaign) next.campaign = "Campaign is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isEdit) {
        await Axios.put(`/lists/${form.listId || id}`, form);
      } else {
        await Axios.post("/lists", form);
      }
    } catch (err) {
      console.error("List submission error:", err);
    } finally {
      setSubmitting(false);
      navigate("/uploads");
    }
  };

  return (
    <div className="fade-in-slide max-w-5xl mx-auto py-4">
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
          {isEdit ? "Edit List" : "New List"}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {isEdit ? "Update List Details" : "Create New List"}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {isEdit
            ? `Modify list configuration and target campaign settings for ${id}.`
            : "Define a new target list and associate it with an active campaign."}
        </p>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="h-6 w-6 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <span className="text-xs font-medium text-gray-500">Retrieving list details...</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {/* List ID */}
              {/* <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  List ID<span className="text-red-500">*</span>
                  {isEdit && (
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      (Identifier cannot be modified)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={form.listId}
                  disabled={isEdit}
                  onChange={handleChange("listId")}
                  placeholder="Enter unique list ID"
                  className={
                    "w-full rounded-lg border px-3.5 py-2.5 text-sm " +
                    (isEdit
                      ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                      : "text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 " +
                        (errors.listId ? "border-red-400" : "border-gray-300"))
                  }
                />
                {errors.listId && <p className="mt-1 text-xs text-red-500">{errors.listId}</p>}
              </div> */}

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Enter list name"
                  className={
                    "w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 " +
                    (errors.name ? "border-red-400" : "border-gray-300")
                  }
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Campaign */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Campaign<span className="text-red-500">*</span>
                </label>
                <select
                  value={form.campaign}
                  onChange={handleChange("campaign")}
                  className={
                    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 " +
                    (form.campaign ? "text-gray-900" : "text-gray-400") +
                    " " +
                    (errors.campaign ? "border-red-400" : "border-gray-300")
                  }
                >
                  <option value="" disabled>
                    Select a campaign
                  </option>
                  {CAMPAIGN_OPTIONS.map((c) => (
                    <option key={c} value={c} className="text-gray-900">
                      {c}
                    </option>
                  ))}
                  {form.campaign && !CAMPAIGN_OPTIONS.includes(form.campaign) && (
                    <option value={form.campaign} className="text-gray-900">
                      {form.campaign}
                    </option>
                  )}
                </select>
                {errors.campaign && <p className="mt-1 text-xs text-red-500">{errors.campaign}</p>}
              </div>


              {/* Description */}
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={handleChange("description")}
                  placeholder="Enter optional description or notes about this list"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={() => navigate("/uploads")}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60 transition-colors cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : isEdit ? (
                  <>
                    <Save size={16} />
                    <span>Update List</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Create List</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateListForm;
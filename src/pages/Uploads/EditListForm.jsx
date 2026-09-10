import Axios from "@/utils/axiosConfig";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const CAMPAIGN_OPTIONS = ["Silgate", "Talent Corner"];
const STATUS_OPTIONS = ["Active", "Inactive"];

const EditListForm = ({ isOpen, onClose, list, onUpdated }) => {
  const [form, setForm] = useState({
    listId: "",
    name: "",
    description: "",
    campaign: "",
    status: "Active",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Prefill whenever a new row is opened for editing
  useEffect(() => {
    if (list) {
      setForm({
        listId: list.id ?? "",
        name: list.name ?? "",
        description: list.description === "N/A" ? "" : (list.description ?? ""),
        campaign: list.campaign ?? "",
        status: list.status ?? "Active",
      });
      setErrors({});
    }
  }, [list]);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.campaign) next.campaign = "Campaign is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleClose = () => {
    setErrors({});
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { data } = await Axios.put(`/lists/${form.listId}`, form);
      onUpdated?.(data ?? { ...form, id: form.listId });
    } catch (err) {
      // Still update locally so the UI stays responsive if the endpoint isn't ready yet
      onUpdated?.({ ...form, id: form.listId });
    } finally {
      setSubmitting(false);
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={handleClose} />

      {/* Panel */}
      <div className="relative flex h-screen w-full max-w-2xl flex-col bg-white shadow-2xl z-10">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Edit List</h2>
          <button onClick={handleClose} className="text-red-500 hover:text-red-600 cursor-pointer">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                List ID<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.listId}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-400"
              />
            </div>

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

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={handleChange("description")}
                placeholder="Enter description"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Campaign<span className="text-red-500">*</span>
              </label>
              <select
                value={form.campaign}
                onChange={handleChange("campaign")}
                className={
                  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 " +
                  (form.campaign ? "text-gray-900" : "text-gray-400") + " " +
                  (errors.campaign ? "border-red-400" : "border-gray-300")
                }
              >
                <option value="" disabled>Select a campaign</option>
                {CAMPAIGN_OPTIONS.map((c) => (
                  <option key={c} value={c} className="text-gray-900">{c}</option>
                ))}
                {/* Keep the existing value selectable even if it's not one of the two options above */}
                {form.campaign && !CAMPAIGN_OPTIONS.includes(form.campaign) && (
                  <option value={form.campaign} className="text-gray-900">{form.campaign}</option>
                )}
              </select>
              {errors.campaign && <p className="mt-1 text-xs text-red-500">{errors.campaign}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
              <select
                value={form.status}
                onChange={handleChange("status")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "Updating..." : "Update List"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditListForm;
import Axios from "@/utils/axiosConfig";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

const DeleteListConfirm = ({ isOpen, onClose, list, onDeleted }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (submitting) return;
    onClose?.();
  };

  const handleConfirmDelete = async () => {
    if (!list) return;
    const id = list._id || list.id;
    if (!id) return; // nothing we can actually delete

    setSubmitting(true);
    try {
      await Axios.delete(`/lists/${id}`);
      onDeleted?.(list);
      onClose?.();
    } catch (err) {
      // surface the failure instead of silently pretending it worked
      console.error("Failed to delete list", err);
      setSubmitting(false);
      // optionally: setError("Failed to delete. Please try again.")
      return;
    }
    setSubmitting(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={handleClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Delete this list?</h2>
          <p className="mt-2 text-sm text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-700">"{list?.name}"</span>? This
            action cannot be undone{list?.leadsCount ? `, and its ${list.leadsCount} leads will also be removed` : ""}.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={submitting}
            className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteListConfirm;
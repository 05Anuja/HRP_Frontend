import React, { useState, useEffect } from "react";
import Axios from "@/utils/axiosConfig";
import {
  Save,
  AlertCircle,
  Briefcase,
  Check,
  ClipboardList,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FIELD_META = {
  text: { icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50" },
};

const FieldWrapper = ({ label, error, required, type = "text", children }) => {
  const meta = FIELD_META[type] || FIELD_META.text;
  const Icon = meta.icon;

  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-[11px] font-semibold text-silgate-secondary/80">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div
        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border bg-white transition-all duration-150
          ${
            error
              ? "border-red-400 ring-1 ring-red-100"
              : "border-silgate-outline-variant/40 focus-within:border-silgate-primary/60 focus-within:ring-1 focus-within:ring-silgate-primary/15"
          }`}
      >
        <div
          className={`w-6 h-6 rounded-md ${meta.bg} ${meta.color} flex items-center justify-center shrink-0`}
        >
          <Icon size={12} />
        </div>
        {children}
      </div>
      {error && (
        <p className="text-[10px] font-medium text-red-500 flex items-center gap-1 mt-0.5 animate-pulse">
          <AlertCircle size={10} className="shrink-0" /> {error}
        </p>
      )}
    </div>
  );
};

const SourceForm = ({ initialData, onClose, onSuccess }) => {
  const isEdit = Boolean(initialData);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    sourceName: "",
    project: [], // Array of strings e.g. ["Silgate", "Talent Corner"]
  });

  // useEffect to store the stored data into states
  useEffect(() => {
    if (initialData) {
      setFormData({
        sourceName: initialData.sourceName || "",
        project: Array.isArray(initialData.project)
          ? initialData.project
          : initialData.project
            ? [initialData.project]
            : [],
      });
    } else {
      setFormData({
        sourceName: "",
        project: [],
      });
    }
    setErrors({});
  }, [initialData]);

  // Function to handle chackbox
  const handleProjectCheckboxChange = (projName) => {
    const currentProjects = formData.project;
    let nextProjects;
    if (currentProjects.includes(projName)) {
      nextProjects = currentProjects.filter((p) => p !== projName);
    } else {
      nextProjects = [...currentProjects, projName];
    }
    setFormData((prev) => ({ ...prev, project: nextProjects }));
    if (errors.project) {
      setErrors((prev) => ({ ...prev, project: "" }));
    }
  };

  // Function to validate values
  const validate = () => {
    const errs = {};
    if (!formData.sourceName.trim()) {
      errs.sourceName = "Source name is required.";
    }
    if (formData.project.length === 0) {
      errs.project = "At least one campaign must be selected.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Function to handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        sourceName: formData.sourceName.trim(),
        project: formData.project,
      };

      if (isEdit && initialData?._id) {
        await Axios.patch(`/sources/${initialData._id}`, payload);
        toast.success("Source updated successfully.");
      } else {
        await Axios.post("/sources", payload);
        toast.success("Source created successfully.");
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-silgate-outline-variant/25 rounded-2xl overflow-hidden shadow-sm">
      {/* Card Header matching screenshot */}
      <div className="px-6 py-4.5 border-b border-silgate-outline-variant/20 flex items-center justify-between bg-silgate-container-low/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-silgate-outline-variant/15">
            <ClipboardList size={15} className="text-silgate-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-silgate-primary">
              Entry Form
            </h2>
            <p className="text-[10px] text-silgate-secondary/60 mt-0.5">
              2 fields in this form
            </p>
          </div>
        </div>

        {/* Required Count Badge */}
        <span className="text-[10px] font-semibold text-silgate-secondary bg-white px-2.5 py-1 rounded-md border border-silgate-outline-variant/15">
          2 required
        </span>
      </div>

      {/* Card Body */}
      <form onSubmit={handleSubmit} noValidate className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
          {/* Source Name */}
          <FieldWrapper
            label="Source Name"
            error={errors.sourceName}
            required
            type="text"
          >
            <input
              type="text"
              value={formData.sourceName}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  sourceName: e.target.value,
                }));
                if (errors.sourceName)
                  setErrors((prev) => ({ ...prev, sourceName: "" }));
              }}
              placeholder="Enter source name..."
              className="flex-1 text-xs text-silgate-primary placeholder:text-silgate-secondary/35 focus:outline-none bg-transparent"
            />
          </FieldWrapper>

          {/* Campaign Availability */}
          <div className="space-y-1.5 text-left">
            <label className="block text-[11px] font-semibold text-silgate-secondary/80">
              Campaign Availability{" "}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="p-2.5 bg-silgate-container-low/40 rounded-lg border border-silgate-outline-variant/15 flex flex-col gap-2 min-h-[42px] justify-center">
              <div className="flex flex-wrap gap-4">
                {["Silgate", "Talent Corner"].map((proj) => {
                  const isChecked = formData.project.includes(proj);
                  return (
                    <label
                      key={proj}
                      className="flex items-center gap-2 cursor-pointer select-none text-[11px] font-semibold text-silgate-primary"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleProjectCheckboxChange(proj)}
                          className="peer appearance-none w-4 h-4 rounded border border-silgate-outline-variant bg-white checked:bg-silgate-primary checked:border-silgate-primary transition-all duration-150 cursor-pointer"
                        />
                        {isChecked && (
                          <Check
                            size={8}
                            strokeWidth={4}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-silgate-tertiary pointer-events-none"
                          />
                        )}
                      </div>
                      <span>{proj}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            {errors.project && (
              <p className="text-[10px] font-medium text-red-500 flex items-center gap-1 mt-0.5 animate-pulse">
                <AlertCircle size={10} className="shrink-0" /> {errors.project}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons at bottom aligned right */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-silgate-outline-variant/15">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-silgate-outline-variant/40 text-xs font-semibold text-silgate-secondary hover:bg-silgate-container-low transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-silgate-primary text-white text-xs font-semibold hover:bg-silgate-primary/95 transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Save size={13} className="text-silgate-tertiary" />
            )}
            {isEdit ? "Save Changes" : "Submit Entry"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SourceForm;

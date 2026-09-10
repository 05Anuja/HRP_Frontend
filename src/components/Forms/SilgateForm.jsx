import React, { useState, useEffect } from "react";
import Axios from "@/utils/axiosConfig";
import {
  Save,
  AlertCircle,
  Type,
  Hash,
  MapPin,
  Globe,
  ChevronDown,
  ClipboardList,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";
import { uploadLink } from "../../../constants";

// Icon and background configuration matching the design
const FIELD_META = {
  text: { icon: Type, color: "text-blue-500", bg: "bg-blue-50" },
  phone: { icon: Hash, color: "text-emerald-500", bg: "bg-emerald-50" },
  location: { icon: MapPin, color: "text-blue-500", bg: "bg-blue-50" },
  language: { icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
  select: { icon: ChevronDown, color: "text-amber-500", bg: "bg-amber-50" },
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
        <p className="text-[10px] font-medium text-red-500 flex items-center gap-1 mt-0.5">
          <AlertCircle size={10} className="shrink-0" /> {error}
        </p>
      )}
    </div>
  );
};

const SilgateForm = ({ initialData, onClose, onSuccess }) => {
  const isEdit = Boolean(initialData);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Designation
  const [designations, setDesignations] = useState([]);
  const [loadingDesignations, setLoadingDesignations] = useState(false);

  // Source
  const [sources, setSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(false);

  // Disposition
  const [dispositions, setDispositions] = useState([]);
  const [loadingDispositions, setLoadingDispositions] = useState(false);

  // Assigned To
  // const [assignedTo, setassignedTo] = useState([]);
  // const [loadingassignedTo, setLoadingassignedTo] = useState(false);

  const [formData, setFormData] = useState({
    candidateName: "",
    candidatePhone: "",
    candidateLocation: "",
    language: "",
    disposition: "",
    source: "",
    candidateDesignation: "",
    experience: "",
    resumeStatus: "",
    resume: null,
    resumeFileName: "",
    originalResumeName: "",
    // assignedTo: "",
  });

  // Fetch designations from backend
  useEffect(() => {
    const fetchDesignations = async () => {
      setLoadingDesignations(true);
      try {
        const res = await Axios.get("/designations", {
          params: { project: "Silgate", limit: 100 },
        });
        if (res.data && Array.isArray(res.data.data)) {
          setDesignations(res.data.data.map((d) => d.name));
        }
      } catch (err) {
        console.error("Failed to fetch designations", err);
      } finally {
        setLoadingDesignations(false);
      }
    };
    fetchDesignations();
  }, []);

  // Fetch Sources from backend
  useEffect(() => {
    const fetchSources = async () => {
      setLoadingSources(true);
      try {
        const res = await Axios.get("/sources", {
          params: { project: "Silgate", limit: 100 },
        });
        if (res.data && Array.isArray(res.data.data)) {
          setSources(res.data.data.map((i) => i.sourceName));
        }
      } catch (err) {
        console.error("Failed to fetch Sources", err);
      } finally {
        setLoadingSources(false);
      }
    };
    fetchSources();
  }, []);

  // Fetch Disposition from backend
  useEffect(() => {
    const fetchDispositions = async () => {
      setLoadingDispositions(true);
      try {
        const res = await Axios.get("/disposition", {
          params: { project: "Silgate", limit: 100 },
        });
        if (res.data && Array.isArray(res.data.data)) {
          setDispositions(res.data.data.map((i) => i.disposition));
        }
      } catch (err) {
        console.error("Failed to fetch Disposition", err);
      } finally {
        setLoadingDispositions(false);
      }
    };
    fetchDispositions();
  }, []);

  // Fetch HRs from backend
  // useEffect(() => {
  //   const fetchHRs = async () => {
  //     setLoadingassignedTo(true);
  //     try {
  //       const res = await Axios.get("/users/allHR", {
  //         params: { project: "Silgate", limit: 100 },
  //       });

  //       console.log(res);
  //       if (res.data && Array.isArray(res.data.hrUsers)) {
  //         setassignedTo(res.data.hrUsers.filter((hr) => hr.projects.includes("Silgate")));
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch Assign to", err);
  //     } finally {
  //       setLoadingassignedTo(false);
  //     }
  //   };
  //   fetchHRs();
  // }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        candidateName: initialData.candidateName || "",
        candidatePhone: initialData.candidatePhone || "",
        candidateLocation: initialData.candidateLocation || "",
        language: initialData.language || "",
        disposition: initialData.disposition || "",
        source: initialData.source || "",
        candidateDesignation: initialData.candidateDesignation || "",
        experience: initialData.experience || "",
        resumeStatus: initialData.resumeStatus || "",
        resume: null,
        resumeFileName: initialData.resumeFileName || "",
        originalResumeName: initialData.resumeOriginalName || "",
        // assignedTo: initialData.assignedTo || "",
      });
    } else {
      setFormData({
        candidateName: "",
        candidatePhone: "",
        candidateLocation: "",
        language: "",
        disposition: "",
        source: "",
        candidateDesignation: "",
        experience: "",
        resumeStatus: "",
        resume: null,
        resumeFileName: "",
        originalResumeName: "",
        // assignedTo: "",
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    handleChange("candidatePhone", val);
  };

  // Function to validate values
  const validate = () => {
    const errs = {};
    if (!formData.candidateName.trim())
      errs.candidateName = "Candidate name is required.";
    if (!formData.candidatePhone.trim())
      errs.candidatePhone = "Phone number is required.";
    else if (!/^\d{10}$/.test(formData.candidatePhone)) {
      errs.candidatePhone = "Phone number must be exactly 10 digits.";
    }
    if (!formData.language.trim()) errs.language = "Language is required.";
    if (!formData.disposition) errs.disposition = "Disposition is required.";
    if (!formData.source) errs.source = "Source is required.";
    if (!formData.candidateDesignation) {
      errs.candidateDesignation = "Designation is required.";
    }
    if (!formData.experience) {
      errs.experience = "Experience is required.";
    }
    if (!formData.resumeStatus)
      errs.resumeStatus = "Resume status is required.";
    // if (!formData.assignedTo)
    //   errs.assignedTo = "Assign To is required.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Function to handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;
    setSaving(true);

    if (!validate()) {
      setSaving(false);
      return;
    }

    try {
      const payload = new FormData();

      payload.append("candidateName", formData.candidateName);
      payload.append("candidatePhone", formData.candidatePhone);
      payload.append("candidateLocation", formData.candidateLocation);
      payload.append("language", formData.language);
      payload.append("disposition", formData.disposition);
      payload.append("source", formData.source);
      payload.append("candidateDesignation", formData.candidateDesignation);
      payload.append("experience", formData.experience);
      payload.append("resumeStatus", formData.resumeStatus);
      // payload.append("assignedTo", formData.assignedTo);

      if (formData.resume) {
        payload.append("resume", formData.resume);
      }

      if (isEdit && initialData?._id) {
        await Axios.patch(`/silgate/update/${initialData._id}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Record updated successfully.");
      } else {
        await Axios.post("/silgate/add", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Record added successfully.");
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  // Role to make decisions
  const user = JSON.parse(localStorage.getItem("user"));
  const { role } = user;

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
              7 fields in this form
            </p>
          </div>
        </div>

        {/* Required Count Badge */}
        <span className="text-[10px] font-semibold text-silgate-secondary bg-white px-2.5 py-1 rounded-md border border-silgate-outline-variant/15">
          6 required
        </span>
      </div>

      {/* Card Body with 2-column grid */}
      <form onSubmit={handleSubmit} noValidate className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
          {/* Candidate Name */}
          <FieldWrapper
            label="Candidate's Name"
            error={errors.candidateName}
            required
            type="text"
          >
            <input
              type="text"
              value={formData.candidateName}
              onChange={(e) => handleChange("candidateName", e.target.value)}
              placeholder="Enter candidate's name..."
              className="flex-1 text-xs text-silgate-primary placeholder:text-silgate-secondary/35 focus:outline-none bg-transparent"
            />
          </FieldWrapper>

          {/* Candidate Phone */}
          <FieldWrapper
            label="Candidate's Phone"
            error={errors.candidatePhone}
            required
            type="phone"
          >
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              value={formData.candidatePhone}
              onChange={handlePhoneChange}
              placeholder="Enter 10-digit mobile number..."
              className="flex-1 text-xs text-silgate-primary placeholder:text-silgate-secondary/35 focus:outline-none bg-transparent"
            />
          </FieldWrapper>

          {/* Candidate Location */}
          <FieldWrapper
            label="Candidate's Location (City)"
            error={errors.candidateLocation}
            type="location"
          >
            <input
              type="text"
              value={formData.candidateLocation}
              onChange={(e) =>
                handleChange("candidateLocation", e.target.value)
              }
              placeholder="Enter candidate's location (city)..."
              className="flex-1 text-xs text-silgate-primary placeholder:text-silgate-secondary/35 focus:outline-none bg-transparent"
            />
          </FieldWrapper>

          {/* Language */}
          <FieldWrapper
            label="Language"
            error={errors.language}
            required
            type="language"
          >
            <input
              type="text"
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
              placeholder="Enter language..."
              className="flex-1 text-xs text-silgate-primary placeholder:text-silgate-secondary/35 focus:outline-none bg-transparent"
            />
          </FieldWrapper>

          {/* Disposition */}
          <FieldWrapper
            label="Candidate's Disposition"
            error={errors.disposition}
            required
            type="select"
          >
            <div className="relative flex-1 flex items-center">
              <select
                value={formData.disposition}
                onChange={(e) => handleChange("disposition", e.target.value)}
                className="w-full text-xs text-silgate-primary bg-transparent focus:outline-none cursor-pointer appearance-none pr-6"
                disabled={loadingDispositions}
              >
                <option value="">
                  {loadingDispositions
                    ? "Loading dispositions..."
                    : "Select option..."}
                </option>
                {(() => {
                  const opts = [...dispositions];
                  if (
                    formData.disposition &&
                    !opts.includes(formData.disposition)
                  ) {
                    opts.push(formData.disposition);
                  }
                  return opts.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ));
                })()}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 text-silgate-secondary/50 pointer-events-none"
              />
            </div>
          </FieldWrapper>

          {/* Source */}
          <FieldWrapper
            label="Candidate's Source"
            error={errors.source}
            required
            type="select"
          >
            <div className="relative flex-1 flex items-center">
              <select
                value={formData.source}
                onChange={(e) => handleChange("source", e.target.value)}
                className="w-full text-xs text-silgate-primary bg-transparent focus:outline-none cursor-pointer appearance-none pr-6"
                disabled={loadingSources}
              >
                <option value="">
                  {loadingSources ? "Loading sources..." : "Select option..."}
                </option>
                {(() => {
                  const opts = [...sources];
                  if (formData.source && !opts.includes(formData.source)) {
                    opts.push(formData.source);
                  }
                  return opts.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ));
                })()}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 text-silgate-secondary/50 pointer-events-none"
              />
            </div>
          </FieldWrapper>

          {/* Candidate Designation */}
          <FieldWrapper
            label="Candidate's Designation"
            error={errors.candidateDesignation}
            required
            type="select"
          >
            <div className="relative flex-1 flex items-center">
              <select
                value={formData.candidateDesignation}
                onChange={(e) =>
                  handleChange("candidateDesignation", e.target.value)
                }
                className="w-full text-xs text-silgate-primary bg-transparent focus:outline-none cursor-pointer appearance-none pr-6"
                disabled={loadingDesignations}
              >
                <option value="">
                  {loadingDesignations
                    ? "Loading designations..."
                    : "Select option..."}
                </option>
                {(() => {
                  const opts = [...designations];
                  if (
                    formData.candidateDesignation &&
                    !opts.includes(formData.candidateDesignation)
                  ) {
                    opts.push(formData.candidateDesignation);
                  }
                  return opts.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ));
                })()}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 text-silgate-secondary/50 pointer-events-none"
              />
            </div>
          </FieldWrapper>

          {/* Experience */}
          <FieldWrapper
            label="Experience"
            error={errors.experience}
            required
            type="select"
          >
            <div className="relative flex-1 flex items-center">
              <select
                value={formData.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                className="w-full text-xs text-silgate-primary bg-transparent focus:outline-none cursor-pointer appearance-none pr-6"
              >
                <option value="">Select option...</option>
                {["Fresher", "Experienced"].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 text-silgate-secondary/50 pointer-events-none"
              />
            </div>
          </FieldWrapper>

          {/* Resume Status */}
          <FieldWrapper
            label="Resume Status"
            error={errors.resumeStatus}
            required
            type="select"
          >
            <div className="relative flex-1 flex items-center">
              <select
                value={formData.resumeStatus}
                onChange={(e) => handleChange("resumeStatus", e.target.value)}
                className="w-full text-xs text-silgate-primary bg-transparent focus:outline-none cursor-pointer appearance-none pr-6"
              >
                <option value="">Select option...</option>
                {["Sent", "Not Sent"].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 text-silgate-secondary/50 pointer-events-none"
              />
            </div>
          </FieldWrapper>

          {/* Resume Upload */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">
              Resume Upload
            </label>

            {/* Upload Row */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="resume"
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer transition"
              >
                <Upload className="h-5 w-5 text-gray-600" />
              </label>

              <input
                id="resume"
                type="file"
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 file:mr-3 file:px-3 file:py-1.5 file:border-0 file:rounded-md file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                onChange={(e) =>
                  handleChange("resume", e.target.files?.[0] || null)
                }
              />
            </div>

            {/* Existing Resume */}
            {formData.resumeFileName && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Current Resume
                </p>

                <a
                  href={`${uploadLink}/uploads/resumes/${formData.resumeFileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
                >
                  📄 {formData.originalResumeName || formData.resumeFileName}
                </a>

                <p className="mt-1 text-xs text-gray-500">
                  Upload a new file only if you want to replace the existing
                  resume.
                </p>
              </div>
            )}

            {errors.candidateDesignation && (
              <p className="text-sm text-red-500">
                {errors.candidateDesignation}
              </p>
            )}
          </div>

          {/* Assign to */}
          {/* <FieldWrapper
            label="Assign to"
            error={errors.assignedTo}
            required
            type="select"
          >
            <div className="relative flex-1 flex items-center">
              <select
                value={formData.assignedTo}
                onChange={(e) => handleChange("assignedTo", e.target.value)}
                className="w-full text-xs text-silgate-primary bg-transparent focus:outline-none cursor-pointer appearance-none pr-6"
                disabled={loadingassignedTo}
              >
                <option value="">
                  {loadingassignedTo
                    ? "Loading Assign To..."
                    : "Select HR..."}
                </option>

                {assignedTo.map((hr) => (
                  <option key={hr._id} value={hr._id}>
                    {hr.name}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                className="absolute right-0 text-silgate-secondary/50 pointer-events-none"
              />
            </div>
          </FieldWrapper> */}
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

export default SilgateForm;

import Axios from "@/utils/axiosConfig";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  ArrowLeft,
  User,
  Lock,
  Briefcase,
  UserPlus,
  Edit3,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

// ── Defined OUTSIDE the component so React never remounts it on re-render ──
const InputField = ({ id, label, icon: Icon, error, hint, children }) => (
  <div>
    <label
      className="block text-[11px] font-semibold text-silgate-secondary/80 mb-1.5"
      htmlFor={id}
    >
      {label}
    </label>
    <div
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border bg-white transition-all duration-150
        ${error
          ? "border-red-300 ring-1 ring-red-200"
          : "border-silgate-outline-variant/40 focus-within:border-silgate-primary/60 focus-within:ring-1 focus-within:ring-silgate-primary/15"
        }`}
    >
      <Icon size={14} className="text-silgate-secondary/40 shrink-0" />
      {children}
    </div>
    {error && (
      <p className="mt-1 text-[10px] font-medium text-red-500">{error}</p>
    )}
    {!error && hint && (
      <p className="mt-1 text-[10px] text-silgate-secondary/50">{hint}</p>
    )}
  </div>
);

const HrForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const hrId = params?.id;
  const isEdit = Boolean(hrId);

  const [formdata, setFormData] = useState({
    name: "",
    ecn: "",
    password: "",
    confirmPassword: "",
    status: "active",
    projects: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const availableProjects = [
    { _id: "silgate", name: "Silgate", description: "Silgate Campaign logs and candidate lineups." },
    { _id: "talent_corner", name: "Talent Corner", description: "Talent Corner candidate tracking and CV logs." }
  ];

  // ── Prefill on edit ──
  useEffect(() => {
    if (!isEdit) return;

    const initialRow = location.state || null;
    const prefillFromRow = (row) => {
      if (!row) return false;
      setFormData((prev) => ({
        ...prev,
        name: row?.name || "",
        ecn: row?.ecn || row?.email || "",
        password: "",
        confirmPassword: "",
        status: row?.status ?? "active",
        projects: Array.isArray(row?.projects) ? row.projects : [],
      }));
      return true;
    };

    if (prefillFromRow(initialRow)) return;

    const fetchOne = async () => {
      setLoading(true);
      try {
        const response = await Axios.get("/users/allHR");
        const payload = response?.data;
        const list =
          (Array.isArray(payload) && payload) ||
          payload?.hrUsers ||
          payload?.data ||
          payload?.data?.hrUsers ||
          payload?.users ||
          payload?.hrs ||
          [];
        const match = Array.isArray(list)
          ? list.find((u) => u?._id === hrId)
          : null;
        prefillFromRow(match);
      } catch (err) {
        toast.error(
          err?.response?.data?.message || err?.message || "Failed to load HR",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [hrId, isEdit]);

  // ── Handlers ──
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => {
      const current = prev[name] ?? [];
      return {
        ...prev,
        [name]: checked
          ? [...current, value]
          : current.filter((v) => v !== value),
      };
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    // Also clear confirmPassword error when password changes
    if (name === "password" && errors.confirmPassword)
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formdata.name.trim()) errs.name = "Full name is required.";
    if (!formdata.ecn.trim()) errs.ecn = "ECN number is required.";
    else if (!/^\d{5}$/.test(formdata.ecn))
      errs.ecn = "ECN number must be exactly 5 digits.";
    if (!isEdit) {
      if (!formdata.password) errs.password = "Password is required.";
      else if (formdata.password.length < 6)
        errs.password = "Password must be at least 6 characters.";
      if (!formdata.confirmPassword)
        errs.confirmPassword = "Please confirm your password.";
      else if (formdata.password !== formdata.confirmPassword)
        errs.confirmPassword = "Passwords do not match.";
    } else {
      const wantsPasswordChange =
        Boolean(formdata.password) || Boolean(formdata.confirmPassword);
      if (wantsPasswordChange) {
        if (!formdata.password) errs.password = "Password is required.";
        else if (formdata.password.length < 6)
          errs.password = "Password must be at least 6 characters.";
        if (!formdata.confirmPassword)
          errs.confirmPassword = "Please confirm your password.";
        else if (formdata.password !== formdata.confirmPassword)
          errs.confirmPassword = "Passwords do not match.";
      }
    }
    if (!formdata.projects.length)
      errs.projects = "Select at least one project to grant access.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) {
        const payload = {
          name: formdata.name,
          ecn: formdata.ecn,
          projects: formdata.projects,
          status: formdata.status,
          ...(formdata.password ? { password: formdata.password } : {}),
        };
        await Axios.patch(`/users/updateAllHr/${hrId}`, payload);
        toast.success("HR account updated successfully.");
      } else {
        const data = {
          name: formdata.name,
          ecn: formdata.ecn,
          password: formdata.password,
          status: formdata.status,
          projects: formdata.projects,
        };

        // console.log("Sending:", data);
        await Axios.post("/users/createHR", data);
        toast.success("HR account created successfully.");
      }
      navigate("/hr");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Operation failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in-slide">
      {/* ── Back nav ── */}
      <button
        type="button"
        onClick={() => navigate("/hr")}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-silgate-secondary hover:text-silgate-primary transition-all cursor-pointer mb-6"
      >
        <ArrowLeft size={13} />
        Back to HR Management
      </button>

      {/* ── Page header ── */}
      <div className="mb-7">
        <p className="text-[10px] font-semibold tracking-[0.15em] text-silgate-tertiary uppercase mb-1">
          {isEdit ? "Edit Account" : "New Account"}
        </p>
        <h1 className="text-2xl font-bold text-silgate-primary tracking-tight">
          {isEdit ? "Configure HR Account" : "Create HR Account"}
        </h1>
        <p className="text-xs text-silgate-secondary mt-1">
          {isEdit
            ? "Update the administrator's profile details and project access."
            : "Fill in the account details and assign project access for the new HR administrator."}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* ── Loading banner (edit prefill) ── */}
        {loading && isEdit && (
          <div className="flex items-center gap-2 text-xs text-silgate-secondary bg-white border border-silgate-outline-variant/25 rounded-xl px-5 py-3.5 mb-5">
            <div className="h-3.5 w-3.5 rounded-full border-2 border-silgate-tertiary border-t-transparent animate-spin" />
            Loading account data…
          </div>
        )}

        <div className="space-y-5">
          {/* ══════════════════════════════════════
              Card 1 — Account Information
          ══════════════════════════════════════ */}
          <div className="bg-white border border-silgate-outline-variant/25 rounded-xl overflow-hidden">
            {/* Card header */}
            <div className="px-6 py-4 border-b border-silgate-outline-variant/20 flex items-center gap-2.5">
              {isEdit ? (
                <Edit3 size={14} className="text-silgate-secondary" />
              ) : (
                <UserPlus size={14} className="text-silgate-secondary" />
              )}
              <h2 className="text-sm font-semibold text-silgate-primary">
                Account Information
              </h2>
            </div>

            {/* Fields grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <InputField
                  id="name"
                  label="Full Name"
                  icon={User}
                  error={errors.name}
                >
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formdata.name}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Jenkins"
                    autoComplete="off"
                    className="flex-1 text-xs text-silgate-primary placeholder:text-silgate-secondary/30 focus:outline-none bg-transparent"
                  />
                </InputField>

                {/* ECN number */}
                <InputField
                  id="ecn"
                  label="ECN Number"
                  icon={Briefcase}
                  error={errors.ecn}
                  hint={isEdit ? "ECN cannot be changed." : "5 digits only."}
                >
                  <input
                    id="ecn"
                    name="ecn"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{5}"
                    maxLength={5}
                    value={formdata.ecn}
                    onChange={handleChange}
                    placeholder="e.g. 12345"
                    autoComplete="off"
                    disabled={isEdit}
                    className="flex-1 text-xs text-silgate-primary placeholder:text-silgate-secondary/30 focus:outline-none bg-transparent"
                  />
                </InputField>

                {/* Password */}
                <InputField
                  id="password"
                  label="Password"
                  icon={Lock}
                  error={errors.password}
                  hint={
                    isEdit
                      ? "Leave blank to keep existing password."
                      : "At least 6 characters."
                  }
                >
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formdata.password}
                    onChange={handleChange}
                    placeholder={
                      isEdit
                        ? "New password (optional)"
                        : "Minimum 6 characters"
                    }
                    autoComplete="new-password"
                    className="flex-1 text-xs text-silgate-primary placeholder:text-silgate-secondary/30 focus:outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-silgate-secondary/40 hover:text-silgate-secondary transition-colors cursor-pointer shrink-0"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </InputField>

                {/* Confirm password */}
                <InputField
                  id="confirmPassword"
                  label="Confirm Password"
                  icon={ShieldCheck}
                  error={errors.confirmPassword}
                >
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formdata.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    className="flex-1 text-xs text-silgate-primary placeholder:text-silgate-secondary/30 focus:outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-silgate-secondary/40 hover:text-silgate-secondary transition-colors cursor-pointer shrink-0"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={13} />
                    ) : (
                      <Eye size={13} />
                    )}
                  </button>
                </InputField>

                {/* Password match indicator */}
                {formdata.password && formdata.confirmPassword && (
                  <div
                    className={`sm:col-span-2 flex items-center gap-2 text-[11px] font-medium rounded-lg px-3.5 py-2.5 border
                    ${formdata.password === formdata.confirmPassword
                        ? "bg-emerald-50 border-emerald-200/60 text-emerald-700"
                        : "bg-red-50 border-red-200/60 text-red-600"
                      }`}
                  >
                    {formdata.password === formdata.confirmPassword ? (
                      <>
                        <CheckCircle2 size={13} className="shrink-0" />
                        Passwords match — you're good to go.
                      </>
                    ) : (
                      <>
                        <span className="font-bold shrink-0">✕</span>
                        Passwords do not match.
                      </>
                    )}
                  </div>
                )}

                {/* Status toggle */}
                <InputField
                  id="status"
                  label="Status"
                  icon={ShieldCheck}
                  hint="Toggle to set account active or inactive."
                >
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <label
                      htmlFor="status-toggle"
                      className="inline-flex items-center cursor-pointer"
                    >
                      <input
                        id="status-toggle"
                        name="status"
                        type="checkbox"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: e.target.checked ? "active" : "inactive",
                          }))
                        }
                        className="sr-only"
                      />

                      <div
                        className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${formdata.status === "active"
                            ? "bg-silgate-primary"
                            : "bg-slate-200"
                          }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full transform transition-transform ${formdata.status === "active"
                              ? "translate-x-4"
                              : "translate-x-0"
                            }`}
                        />
                      </div>
                    </label>

                    <span className="text-[11px] text-silgate-secondary">
                      {formdata.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </InputField>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════
              Card 2 — Project Access
          ══════════════════════════════════════ */}
          <div className="bg-white border border-silgate-outline-variant/25 rounded-xl overflow-hidden">
            {/* Card header */}
            <div className="px-6 py-4 border-b border-silgate-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Briefcase size={14} className="text-silgate-secondary" />
                <div>
                  <h2 className="text-sm font-semibold text-silgate-primary">
                    Project Access
                  </h2>
                  <p className="text-[11px] text-silgate-secondary/60 mt-0.5">
                    Select one or more projects to grant this administrator
                    access.
                  </p>
                </div>
              </div>
              {/* Selected count badge */}
              {formdata.projects.length > 0 && (
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-silgate-primary text-white">
                  {formdata.projects.length} selected
                </span>
              )}
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableProjects.map((proj) => {
                  const isChecked = formdata.projects.includes(proj.name);
                  return (
                    <label
                      key={proj._id}
                      htmlFor={`proj-${proj._id}`}
                      className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all select-none group
                        ${isChecked
                          ? "bg-silgate-primary/5 border-silgate-primary/40 shadow-sm"
                          : "bg-white border-silgate-outline-variant/30 hover:border-silgate-outline-variant/60 hover:bg-silgate-container-low/30"
                        }`}
                    >
                      <input
                        id={`proj-${proj._id}`}
                        type="checkbox"
                        name="projects"
                        value={proj.name}
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className="sr-only"
                      />

                      {/* Custom checkbox */}
                      <div
                        className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all
                          ${isChecked
                            ? "bg-silgate-primary border-silgate-primary"
                            : "border-silgate-outline-variant/60 bg-white group-hover:border-silgate-outline-variant"
                          }`}
                      >
                        {isChecked && (
                          <CheckCircle2
                            size={9}
                            className="text-white stroke-[3]"
                          />
                        )}
                      </div>

                      {/* Project info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p
                            className={`text-xs font-semibold truncate ${isChecked ? "text-silgate-primary" : "text-silgate-primary/80"}`}
                          >
                            {proj.name}
                          </p>
                          {isChecked && (
                            <span className="text-[9px] font-bold text-silgate-primary bg-silgate-primary/10 px-1.5 py-0.5 rounded-md leading-none shrink-0">
                              GRANTED
                            </span>
                          )}
                        </div>
                        {proj.description && (
                          <p className="text-[10px] text-silgate-secondary/55 mt-1 line-clamp-2">
                            {proj.description}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {errors.projects && (
                <p className="mt-3 text-[11px] font-medium text-red-500 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-500 inline-block shrink-0" />
                  {errors.projects}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* end space-y-5 */}

        {/* ── Action bar ── */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/hr")}
            className="px-5 py-2.5 rounded-lg border border-silgate-outline-variant/40 text-xs font-semibold text-silgate-secondary hover:bg-silgate-container-low transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-silgate-primary text-white text-xs font-semibold hover:bg-silgate-primary/90 transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && (
              <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            )}
            {isEdit ? "Save Changes" : "Create Account"}
          </button>
        </div>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default HrForm;

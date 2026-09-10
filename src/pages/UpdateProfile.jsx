import Axios from "@/utils/axiosConfig";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  ArrowLeft,
  Briefcase,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";

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
        ${
          error
            ? "border-red-300 ring-1 ring-red-200"
            : "border-silgate-outline-variant/40 focus-within:border-silgate-primary/60 focus-within:ring-1 focus-within:ring-silgate-primary/15"
        }`}
    >
      <Icon size={14} className="text-silgate-secondary/40 shrink-0" />
      {children}
    </div>
    {error && <p className="mt-1 text-[10px] font-medium text-red-500">{error}</p>}
    {!error && hint && <p className="mt-1 text-[10px] text-silgate-secondary/50">{hint}</p>}
  </div>
);

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [formdata, setFormData] = useState({
    name: "",
    ecn: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "password" && errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formdata.name.trim()) errs.name = "Name is required.";

    if (!formdata.ecn.trim()) errs.ecn = "ECN number is required.";
    else if (!/^\d{5}$/.test(formdata.ecn))
      errs.ecn = "ECN number must be exactly 5 digits.";

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

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await Axios.get("/users/profile");
        const payload = res?.data;
        const profile = payload?.user || payload?.data || payload || {};
        setFormData((prev) => ({
          ...prev,
          name: profile?.name || "",
          ecn: profile?.ecn || profile?.ecnNumber || profile?.email || "",
          password: "",
          confirmPassword: "",
        }));
      } catch (err) {
        toast.error(
          err?.response?.data?.message || err?.message || "Failed to load profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: formdata.name,
        ecn: formdata.ecn,
        ...(formdata.password ? { password: formdata.password } : {}),
      };
      await Axios.patch("/users/profile", payload);

      // Keep localStorage user in sync (best-effort)
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (storedUser) {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...storedUser, name: formdata.name, ecn: formdata.ecn }),
          );
        }
      } catch {
        // ignore
      }

      toast.success("Profile updated successfully.");
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fade-in-slide">
      {/* Back nav */}
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-silgate-secondary hover:text-silgate-primary transition-all cursor-pointer mb-6"
      >
        <ArrowLeft size={13} />
        Back to Dashboard
      </button>

      <div className="space-y-5">
        <div className="bg-white border border-silgate-outline-variant/25 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-silgate-outline-variant/20 flex items-center gap-2.5">
            <User size={14} className="text-silgate-secondary" />
            <h2 className="text-sm font-semibold text-silgate-primary">
              Update Profile
            </h2>
          </div>

          {loading ? (
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-silgate-secondary bg-white border border-silgate-outline-variant/25 rounded-xl px-5 py-3.5">
                <div className="h-3.5 w-3.5 rounded-full border-2 border-silgate-tertiary border-t-transparent animate-spin" />
                Loading profile data...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField id="name" label="Name" icon={User} error={errors.name}>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formdata.name}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Jenkins"
                      autoComplete="off"
                      className="flex-1 text-xs text-silgate-primary placeholder:text-silgate-secondary/30 focus:outline-none bg-transparent"
                    />
                  </InputField>

                  <InputField
                    id="ecn"
                    label="ECN"
                    icon={Briefcase}
                    error={errors.ecn}
                    hint="5 digits only."
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
                      className="flex-1 text-xs text-silgate-primary placeholder:text-silgate-secondary/30 focus:outline-none bg-transparent"
                    />
                  </InputField>

                  <InputField
                    id="password"
                    label="Password"
                    icon={Lock}
                    error={errors.password}
                    hint="Leave blank to keep existing password."
                  >
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formdata.password}
                      onChange={handleChange}
                      placeholder="New password (optional)"
                      autoComplete="new-password"
                      className="flex-1 text-xs text-silgate-primary placeholder:text-silgate-secondary/30 focus:outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-silgate-secondary/40 hover:text-silgate-secondary transition-colors cursor-pointer shrink-0"
                    >
                      {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </InputField>

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
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="text-silgate-secondary/40 hover:text-silgate-secondary transition-colors cursor-pointer shrink-0"
                    >
                      {showConfirmPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </InputField>

                  {formdata.password && formdata.confirmPassword && (
                    <div
                      className={`sm:col-span-2 flex items-center gap-2 text-[11px] font-medium rounded-lg px-3.5 py-2.5 border
                      ${
                        formdata.password === formdata.confirmPassword
                          ? "bg-emerald-50 border-emerald-200/60 text-emerald-700"
                          : "bg-red-50 border-red-200/60 text-red-600"
                      }`}
                    >
                      {formdata.password === formdata.confirmPassword ? (
                        <>
                          <span className="font-bold shrink-0">✓</span>
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
                </div>
              </div>

              <div className="px-6 py-4 border-t border-silgate-outline-variant/10 bg-white flex items-center justify-end gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-silgate-primary text-white text-xs font-bold hover:bg-silgate-primary/95 transition-all shadow-sm active:scale-[0.98] cursor-pointer border border-white/5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Update Profile"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default UpdateProfile;

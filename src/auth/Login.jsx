import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "@/context/authcontext";
import { useNavigate } from "react-router-dom";
import Axios from "@/utils/axiosConfig";
import {
  Lock,
  Sparkle,
  Eye,
  EyeOff,
  LayoutDashboard,
  Shield,
  Award,
} from "lucide-react";

export const Login = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    ecn: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const validateErrors = {};
    if (!values.ecn) {
      validateErrors.ecn = "ECN number is required";
    } else if (!/^\d{5}$/.test(values.ecn)) {
      validateErrors.ecn = "ECN number must be exactly 5 digits";
    }

    if (!values.password) {
      validateErrors.password = "Password is required";
    }
    setErrors(validateErrors);
    return Object.keys(validateErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await Axios.post("/auth/login", {
        username: values.ecn,
        ecn: values.ecn,
        password: values.password,
      });
      if (response.status === 200) {
        login(response.data?.user, response.data?.token);
        toast.success("Authentication successful! Loading your dashboard...");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid credentials. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-silgate-background flex flex-col font-sans select-none">
      <main className="flex-1 grid w-full grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Showcase Panel */}
        <section className="relative hidden lg:flex flex-col justify-between p-12 bg-silgate-primary text-white overflow-hidden bg-dot-grid">
          {/* Decorative Back Blur Spheres */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-silgate-tertiary/20 to-transparent blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-3xl opacity-40 pointer-events-none" />

          {/* Logo Mark */}
          <div className="relative flex items-center gap-3 z-10">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-silgate-tertiary/20 to-transparent border border-silgate-tertiary/30">
              <Sparkle className="text-silgate-tertiary w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-extrabold text-lg tracking-wider">SILGATE</h1>
              <span className="text-[10px] tracking-widest text-silgate-tertiary font-bold uppercase -mt-0.5">
                Solutions
              </span>
            </div>
          </div>

          {/* Core Banner Showcase Card */}
          <div className="relative z-10 max-w-lg space-y-6 my-auto">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
              Elevating the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-silgate-tertiary">
                Human Capital
              </span>{" "}
              <br />
              Experience Through Data.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Discover a highly-tuned employee analytics dashboard designed to
              optimize retention, track recruitments, and monitor overall
              workspace health.
            </p>

            {/* Live Stats Mockup Widget */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutDashboard
                    size={14}
                    className="text-silgate-tertiary"
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Live Workspace Status
                  </span>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white/3 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Total HR
                  </span>
                  <span className="text-base font-bold mt-1 block">1,284</span>
                </div>
                <div className="p-3 bg-white/3 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Talents
                  </span>
                  <span className="text-base font-bold text-silgate-tertiary mt-1 block">
                    342
                  </span>
                </div>
                <div className="p-3 bg-white/3 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Open Roles
                  </span>
                  <span className="text-base font-bold mt-1 block">87</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer branding */}
          <div className="relative z-10 text-xs text-slate-500 flex items-center gap-4">
            <span>© 2026 Silgate Solutions. All rights reserved.</span>
            <span>•</span>
            <span>Enterprise Security</span>
          </div>
        </section>

        {/* Right Credentials Canvas */}
        <section className="flex items-center justify-center px-6 py-12 bg-silgate-background relative">
          {/* Subtle Mobile Decorative Orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-silgate-tertiary/5 rounded-full blur-3xl lg:hidden pointer-events-none" />

          <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-panel relative border border-white/40 shadow-xl flex flex-col justify-center animate-in fade-in duration-300">
            {/* Mobile Header Logo */}
            <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
              <Sparkle className="text-silgate-tertiary w-6 h-6" />
              <h1 className="font-extrabold text-xl tracking-tight text-silgate-primary">
                SILGATE
              </h1>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-silgate-tertiary font-bold">
                PORTAL AUTHENTICATION
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-silgate-primary">
                Sign In to Hub
              </h2>
              <p className="text-xs text-silgate-secondary">
                Provide secure credentials to enter your management dashboard.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {/* ECN Input */}
              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold text-silgate-primary"
                  htmlFor="ecn"
                >
                  ECN Number
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-silgate-outline-variant/30 bg-white px-3.5 py-3 focus-within:border-silgate-tertiary focus-within:ring-1 focus-within:ring-silgate-tertiary transition-all duration-200">
                  <Shield className="h-4 w-4 text-silgate-secondary/60" />
                  <input
                    id="ecn"
                    name="ecn"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{5}"
                    maxLength={5}
                    value={values.ecn}
                    onChange={handleChange}
                    placeholder="e.g. 12345"
                    className="w-full bg-transparent text-xs outline-none placeholder:text-silgate-secondary/40 text-silgate-primary font-medium"
                  />
                </div>
                {errors.ecn && (
                  <p className="text-[10px] font-medium text-red-500 mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.ecn}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    className="text-xs font-semibold text-silgate-primary"
                    htmlFor="password"
                  >
                    Account Password
                  </label>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-silgate-outline-variant/30 bg-white px-3.5 py-3 focus-within:border-silgate-tertiary focus-within:ring-1 focus-within:ring-silgate-tertiary transition-all duration-200">
                  <Lock className="h-4 w-4 text-silgate-secondary/60" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-xs outline-none placeholder:text-silgate-secondary/40 text-silgate-primary font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] font-medium text-red-500 mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-silgate-primary px-4 py-3.5 text-xs font-bold text-white hover:bg-silgate-primary/95 transition-all duration-200 border border-white/5 shadow-md active:scale-[0.98] cursor-pointer"
              >
                Login
              </button>
            </form>
          </div>
        </section>
      </main>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Login;

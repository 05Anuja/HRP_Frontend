import Axios from "@/utils/axiosConfig";
import LogosilF from "@/assets/LogosilF.jpeg";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  PanelRightOpen,
  PanelRightClose,
  Layers,
  ShieldAlert,
  ClipboardCheck,
  Database,
  ListChecks,
  CloudUpload,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    if (path === "/dashboard") {
      return (
        location.pathname === "/" || location.pathname.startsWith("/dashboard")
      );
    }
    return location.pathname.startsWith(path);
  };

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
  const role = user?.role;
  const userProjects = user?.projects ?? [];
  const isSuperadmin = role === "superadmin";

  const showSilgate = isSuperadmin || userProjects.includes("Silgate");
  const showTalentCorner = isSuperadmin || userProjects.includes("Talent Corner");

  const menuItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      show: true,
    },
    {
      id: "hr",
      icon: Users,
      label: "Users",
      path: "/hr",
      show: isSuperadmin,
    },
    {
      id: "designations",
      icon: Layers,
      label: "Designation",
      path: "/designations",
      show: isSuperadmin,
    },
    {
      id: "interviewstatus",
      icon: ClipboardCheck,
      label: "Interview Status",
      path: "/interviewstatus",
      show: isSuperadmin,
    },
    {
      id: "sources",
      icon: Database,
      label: "Sources",
      path: "/sources",
      show: isSuperadmin,
    },
    {
      id: "disposition",
      icon: ListChecks,
      label: "Disposition",
      path: "/disposition",
      show: isSuperadmin,
    },
    {
      id: "uploads",
      icon: CloudUpload,
      label: "Uploads",
      path: "/uploads",
      show: isSuperadmin,
    },
    {
      id: "audit-logs",
      icon: ShieldAlert,
      label: "System Logs",
      path: "/audit-logs",
      show: true,
    },
  ];

  return (
    <aside
      className={`group relative min-h-screen bg-silgate-primary border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out ${collapsed ? "w-20 2xl:w-24" : "w-60 2xl:w-68"
        }`}
    >
      {/* TOGGLE BUTTON */}
      <div className="relative group">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`peer absolute -right-3 top-6 z-50 bg-silgate-primary border border-white/10 text-slate-400 hover:text-white shadow-lg rounded-full p-1.5 transition-all duration-300 cursor-pointer ${collapsed ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            }`}
        >
          {collapsed ? (
            <PanelRightClose size={14} />
          ) : (
            <PanelRightOpen size={14} />
          )}
        </button>
        {/* Tooltip */}
        <span className="z-50 absolute -right-24 top-5 whitespace-nowrap bg-silgate-primary border border-white/10 text-slate-200 text-xs px-2.5 py-1.5 rounded opacity-0 pointer-events-none peer-hover:opacity-100 transition duration-200">
          {collapsed ? "Expand Menu" : "Collapse Menu"}
        </span>
      </div>

      {/* LOGO */}
      <div className="px-6 py-7 flex items-center justify-center border-b border-white/5">
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="p-2 rounded-xl bg-gradient-to-tr from-silgate-tertiary/20 to-silgate-tertiary/5 border border-silgate-tertiary/30 shadow-inner">
            <img
              src={LogosilF}
              alt="Silgate Solutions"
              className="w-6 h-6 object-contain"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="font-bold text-base tracking-wider text-white">
                SILGATE
              </h1>
              <span className="text-[10px] tracking-widest text-silgate-tertiary font-semibold uppercase -mt-0.5">
                Solutions
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {menuItems
          .filter((item) => item.show)
          .map((item) => {
            const isItemActive = isActive(item.path);

            return (
              <div key={item.id} className="relative group/item">
                {/* ACTIVE INDICATOR (Gold line) */}
                {isItemActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-silgate-tertiary transition-all duration-300" />
                )}

                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer
                  ${collapsed ? "justify-center" : ""}
                  ${isItemActive
                      ? "text-white font-medium bg-white/5 border border-white/5 shadow-inner"
                      : "text-slate-400 hover:text-white hover:bg-white/3 border border-transparent"
                    }
                `}
                >
                  <item.icon
                    strokeWidth={isItemActive ? 2 : 1.75}
                    className={`w-5 h-5 ${collapsed ? "" : "mr-3"} transition-colors duration-200
                    ${isItemActive ? "text-silgate-tertiary" : "text-slate-400 group-hover/item:text-slate-200"}`}
                  />

                  {!collapsed && (
                    <span className="tracking-wide text-[13px]">
                      {item.label}
                    </span>
                  )}
                </button>

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute z-50 left-full ml-4 top-1/2 -translate-y-1/2 hidden group-hover/item:block bg-silgate-primary border border-white/10 text-white text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-xl">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}

        {/* CAMPAIGNS SECTION */}
        {(showSilgate || showTalentCorner) && (
          <div className="pt-4 space-y-1.5">
            {!collapsed ? (
              <div className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-slate-500 border-t border-white/5 mt-2">
                Active Campaigns
              </div>
            ) : (
              <div className="border-t border-white/5 my-2" />
            )}

            {/* Silgate Submissions */}
            {showSilgate && (
              <div className="relative group/item">
                {location.pathname.startsWith("/submissions/silgate") && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-silgate-tertiary transition-all duration-300" />
                )}

                <button
                  onClick={() => navigate("/submissions/silgate")}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer
                  ${collapsed ? "justify-center" : ""}
                  ${location.pathname.startsWith("/submissions/silgate")
                      ? "text-white font-medium bg-white/5 border border-white/5 shadow-inner"
                      : "text-slate-400 hover:text-white hover:bg-white/3 border border-transparent"
                    }
                `}
                >
                  <ClipboardList
                    strokeWidth={location.pathname.startsWith("/submissions/silgate") ? 2 : 1.75}
                    className={`w-5 h-5 ${collapsed ? "" : "mr-3"} transition-colors duration-200
                    ${location.pathname.startsWith("/submissions/silgate") ? "text-silgate-tertiary" : "text-slate-400 group-hover/item:text-slate-200"}`}
                  />

                  {!collapsed && (
                    <span className="tracking-wide text-[13px] truncate">
                      Silgate
                    </span>
                  )}
                </button>

                {collapsed && (
                  <div className="absolute z-50 left-full ml-4 top-1/2 -translate-y-1/2 hidden group-hover/item:block bg-silgate-primary border border-white/10 text-white text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-xl">
                    Silgate
                  </div>
                )}
              </div>
            )}

            {/* Talent Corner Submissions */}
            {showTalentCorner && (
              <div className="relative group/item">
                {location.pathname.startsWith("/submissions/talent-corner") && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-silgate-tertiary transition-all duration-300" />
                )}

                <button
                  onClick={() => navigate("/submissions/talent-corner")}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer
                  ${collapsed ? "justify-center" : ""}
                  ${location.pathname.startsWith("/submissions/talent-corner")
                      ? "text-white font-medium bg-white/5 border border-white/5 shadow-inner"
                      : "text-slate-400 hover:text-white hover:bg-white/3 border border-transparent"
                    }
                `}
                >
                  <ClipboardList
                    strokeWidth={location.pathname.startsWith("/submissions/talent-corner") ? 2 : 1.75}
                    className={`w-5 h-5 ${collapsed ? "" : "mr-3"} transition-colors duration-200
                    ${location.pathname.startsWith("/submissions/talent-corner") ? "text-silgate-tertiary" : "text-slate-400 group-hover/item:text-slate-200"}`}
                  />

                  {!collapsed && (
                    <span className="tracking-wide text-[13px] truncate">
                      Talent Corner
                    </span>
                  )}
                </button>

                {collapsed && (
                  <div className="absolute z-50 left-full ml-4 top-1/2 -translate-y-1/2 hidden group-hover/item:block bg-silgate-primary border border-white/10 text-white text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-xl">
                    Talent Corner
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* FOOTER METRIC IN COLLAPSE
      <div className="p-4 border-t border-white/5 flex items-center justify-center">
        {!collapsed ? (
          <div className="text-[10px] text-slate-500 font-medium tracking-wider">
            v2.2.0 © Silgate Corp          </div>
        ) : (
          <div className="text-[9px] text-silgate-tertiary font-bold tracking-widest uppercase">
            SG
          </div>
        )}
      </div> */}
    </aside>
  );
};

export default Sidebar;

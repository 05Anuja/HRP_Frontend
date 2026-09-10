import { Bell, ChevronDown, LogOut, Search, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";
import Axios from "../../utils/axiosConfig";
import { useAuth } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";

const Header = ({ sideBarCollapsed, onToggleSidebar }) => {
  const [userData, setUserData] = useState([]);
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await Axios.get(`/users/profile`);
    const user = response?.data;
    setUserData(user);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-md border-b border-silgate-outline-variant/20 px-8 py-4 flex items-center justify-between">
      {/* Title/Context Placeholder or Spacing */}
      <div className="flex items-center">
        <h2 className="text-sm font-semibold tracking-wider text-silgate-secondary uppercase">
          Performance Hub
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}

        {/* Profile Dropdown */}
        <div className="relative">
          {/* Trigger */}
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-3 pl-4 border-l border-silgate-outline-variant/30 cursor-pointer select-none"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full border border-silgate-tertiary/40 bg-silgate-primary text-white text-xs font-semibold flex items-center justify-center shadow-inner tracking-wider">
              {userData?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* Name + Role */}
            <div className="hidden md:block min-w-0 text-left">
              <p className="text-xs font-semibold text-silgate-primary truncate">
                {userData?.name
                  ? userData.name.charAt(0).toUpperCase() +
                    userData.name.slice(1)
                  : "User"}
              </p>
              <p className="text-[10px] text-silgate-secondary truncate font-medium mt-0.5">
                {userData?.ecn}
              </p>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-silgate-secondary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </div>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white border border-silgate-outline-variant/20 shadow-xl py-2 z-50 animate-in fade-in-50 duration-150">
              {/* Header Info */}
              <div className="px-4 py-3.5 border-b border-silgate-outline-variant/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-silgate-tertiary/30 bg-silgate-primary text-white flex items-center justify-center font-bold text-sm">
                  {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-silgate-primary truncate">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-[10px] text-silgate-secondary truncate capitalize font-medium">
                    {userData?.role?.toLowerCase()} Profile
                  </p>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="p-1">
                <button
                  onClick={() => {
                    navigate("/updateprofile");
                  }}
                  className="w-full flex items-center px-3.5 py-2.5 text-xs font-medium rounded-xl text-red-500 hover:bg-red-50/60 transition-colors cursor-pointer"
                >
                  <Settings className="mr-2.5 h-4 w-4" />
                  Update Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center px-3.5 py-2.5 text-xs font-medium rounded-xl text-red-500 hover:bg-red-50/60 transition-colors cursor-pointer"
                >
                  <LogOut className="mr-2.5 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

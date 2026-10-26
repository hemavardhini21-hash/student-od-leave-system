import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ROLE_LABELS = {
  student: "Student",
  faculty: "Faculty",
  hod: "HOD",
  coordinator: "Attendance Coordinator",
  admin: "Administrator",
};

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-ink-50 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-xl text-ink-600" onClick={onMenuClick}>
          ☰
        </button>
        <span className="text-sm text-slate-500 hidden sm:inline">
          {ROLE_LABELS[user?.role] || ""} Dashboard
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-ink-800 leading-tight">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.department}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-campus-600 text-white flex items-center justify-center font-serif font-semibold text-sm">
          {user?.name?.charAt(0) || "U"}
        </div>
        <button className="btn-secondary !px-3 !py-1.5 text-xs" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;

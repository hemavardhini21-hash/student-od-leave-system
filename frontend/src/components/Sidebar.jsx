import React from "react";
import { NavLink } from "react-router-dom";

// Role -> nav links map. Keeps navigation centrally defined and easy to extend.
const NAV_LINKS = {
  student: [
    { to: "/student", label: "Dashboard", icon: "🏠", end: true },
    { to: "/student/apply-od", label: "Apply for OD", icon: "📝" },
    { to: "/student/apply-leave", label: "Apply for Leave", icon: "📋" },
    { to: "/student/requests", label: "My Requests", icon: "📑" },
    { to: "/student/attendance", label: "Attendance", icon: "✅" },
    { to: "/student/notifications", label: "Notifications", icon: "🔔" },
    { to: "/student/profile", label: "Profile", icon: "👤" },
  ],
  faculty: [
    { to: "/faculty", label: "Dashboard", icon: "🏠", end: true },
    { to: "/faculty/pending", label: "Pending Requests", icon: "⏳" },
    { to: "/faculty/history", label: "Request History", icon: "📚" },
    { to: "/faculty/notifications", label: "Notifications", icon: "🔔" },
  ],
  hod: [
    { to: "/hod", label: "Dashboard", icon: "🏠", end: true },
    { to: "/hod/pending", label: "Pending Approvals", icon: "⏳" },
    { to: "/hod/department", label: "Department Requests", icon: "🏢" },
    { to: "/hod/notifications", label: "Notifications", icon: "🔔" },
  ],
  coordinator: [
    { to: "/coordinator", label: "Dashboard", icon: "🏠", end: true },
    { to: "/coordinator/approved", label: "Approved Requests", icon: "✔️" },
    { to: "/coordinator/attendance", label: "Attendance Records", icon: "✅" },
    { to: "/coordinator/history", label: "Update History", icon: "🕘" },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: "🏠", end: true },
    { to: "/admin/students", label: "Manage Students", icon: "🎓" },
    { to: "/admin/faculty", label: "Manage Faculty", icon: "👨‍🏫" },
    { to: "/admin/departments", label: "Manage Departments", icon: "🏢" },
    { to: "/admin/attendance", label: "Manage Attendance", icon: "✅" },
    { to: "/admin/reports", label: "Reports", icon: "📊" },
  ],
};

const Sidebar = ({ role, open, onClose }) => {
  const links = NAV_LINKS[role] || [];

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-64 bg-campus-700 transform transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
          <span className="w-8 h-8 rounded-sm bg-white text-campus-700 flex items-center justify-center font-serif font-bold text-sm">
            OL
          </span>
          <span className="font-serif font-semibold text-parchment leading-tight text-[15px]">
            OD &amp; Leave Register
          </span>
        </div>
        <nav className="p-3 space-y-0.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 pl-3 pr-3 py-2.5 border-l-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-l-white bg-white/10 text-white"
                    : "border-l-transparent text-white/60 hover:text-white hover:bg-white/[0.06]"
                }`
              }
            >
              <span className="text-[15px] opacity-90">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

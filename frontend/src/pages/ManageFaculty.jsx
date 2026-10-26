import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ManageUsers from "../components/ManageUsers";

// Admin can manage faculty, HOD, and coordinator accounts from tabs on this page
const ROLES = [
  { key: "faculty", label: "Faculty" },
  { key: "hod", label: "HOD" },
  { key: "coordinator", label: "Attendance Coordinator" },
];

const ManageFaculty = () => {
  const [role, setRole] = useState("faculty");
  const active = ROLES.find((r) => r.key === role);

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">Manage Faculty & Staff</h1>
      <p className="text-sm text-slate-500 mb-6">Create, edit, and manage faculty, HOD, and coordinator accounts.</p>

      <div className="flex gap-2 mb-4">
        {ROLES.map((r) => (
          <button
            key={r.key}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${role === r.key ? "bg-primary-600 text-white" : "bg-white border border-ink-100 text-ink-600"}`}
            onClick={() => setRole(r.key)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <ManageUsers key={role} role={role} title={active.label} />
    </DashboardLayout>
  );
};

export default ManageFaculty;

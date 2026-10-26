import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ManageUsers from "../components/ManageUsers";

const ManageStudents = () => (
  <DashboardLayout>
    <h1 className="text-xl font-bold text-ink-800 mb-1">Manage Students</h1>
    <p className="text-sm text-slate-500 mb-6">Create, edit, and manage student accounts.</p>
    <ManageUsers role="student" title="Student" />
  </DashboardLayout>
);

export default ManageStudents;

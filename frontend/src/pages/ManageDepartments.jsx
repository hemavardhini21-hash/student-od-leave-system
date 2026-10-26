import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import adminService from "../services/adminService";

// Departments are derived from the users collection (distinct department values).
// This gives the admin a read-only view of departments currently in use, with headcounts.
const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [deptRes, userRes] = await Promise.all([adminService.getDepartments(), adminService.getUsers()]);
        setDepartments(deptRes.departments);
        setUsers(userRes.users);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">Manage Departments</h1>
      <p className="text-sm text-slate-500 mb-6">
        Departments are automatically derived from registered users. Add a new department by creating a
        student or faculty account with that department name.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const deptUsers = users.filter((u) => u.department === dept);
          const students = deptUsers.filter((u) => u.role === "student").length;
          const faculty = deptUsers.filter((u) => u.role === "faculty").length;
          const hod = deptUsers.find((u) => u.role === "hod");

          return (
            <div key={dept} className="card">
              <h3 className="font-semibold text-ink-800 mb-3">{dept}</h3>
              <dl className="text-sm space-y-1.5">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Students</dt>
                  <dd className="font-medium">{students}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Faculty</dt>
                  <dd className="font-medium">{faculty}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">HOD</dt>
                  <dd className="font-medium">{hod ? hod.name : "Not assigned"}</dd>
                </div>
              </dl>
            </div>
          );
        })}
        {departments.length === 0 && <p className="text-sm text-slate-500">No departments found yet.</p>}
      </div>
    </DashboardLayout>
  );
};

export default ManageDepartments;

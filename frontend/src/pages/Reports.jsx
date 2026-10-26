import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import odService from "../services/odService";
import leaveService from "../services/leaveService";
import adminService from "../services/adminService";

const Reports = () => {
  const [odRequests, setOdRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [odRes, leaveRes, deptRes] = await Promise.all([
          odService.getAll(),
          leaveService.getAll(),
          adminService.getDepartments(),
        ]);
        setOdRequests(odRes.requests);
        setLeaveRequests(leaveRes.requests);
        setDepartments(deptRes.departments);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  const deptData = departments.map((dept) => ({
    name: dept,
    OD: odRequests.filter((r) => r.department === dept).length,
    Leave: leaveRequests.filter((r) => r.department === dept).length,
  }));

  const allRequests = [...odRequests, ...leaveRequests];
  const approvalRate = allRequests.length
    ? (((allRequests.filter((r) => ["Fully Approved", "Attendance Updated"].includes(r.status)).length) / allRequests.length) * 100).toFixed(1)
    : "0.0";

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">Reports & Analytics</h1>
      <p className="text-sm text-slate-500 mb-6">Department-wise request volume and overall approval statistics.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-slate-500">Overall Approval Rate</p>
          <p className="text-2xl font-bold mt-1">{approvalRate}%</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Total OD Requests</p>
          <p className="text-2xl font-bold mt-1">{odRequests.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Total Leave Requests</p>
          <p className="text-2xl font-bold mt-1">{leaveRequests.length}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-ink-800 mb-4">Requests by Department</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={deptData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis allowDecimals={false} fontSize={12} />
            <Tooltip />
            <Bar dataKey="OD" fill="#2C79AC" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Leave" fill="#8FCBEE" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
};

export default Reports;

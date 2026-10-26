import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import Loader from "../components/Loader";
import adminService from "../services/adminService";
import useAuth from "../hooks/useAuth";

const COLORS = ["#f59e0b", "#10b981", "#ef4444"];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getAnalytics()
      .then((res) => setAnalytics(res.analytics))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  const statusData = [
    { name: "Pending", value: analytics.pendingRequests },
    { name: "Approved", value: analytics.approvedRequests },
    { name: "Rejected", value: analytics.rejectedRequests },
  ];

  const typeData = [
    { name: "OD Requests", count: analytics.totalODRequests },
    { name: "Leave Requests", count: analytics.totalLeaveRequests },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">Welcome, {user?.name}</h1>
      <p className="text-sm text-slate-500 mb-6">Administrator Dashboard · Full system overview</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Total Students" value={analytics.totalStudents} icon="🎓" />
        <DashboardCard title="Total Faculty" value={analytics.totalFaculty} icon="👨‍🏫" />
        <DashboardCard title="Pending Requests" value={analytics.pendingRequests} icon="⏳" color="amber" />
        <DashboardCard title="Approved Requests" value={analytics.approvedRequests} icon="✅" color="green" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="OD Requests" value={analytics.totalODRequests} icon="📝" />
        <DashboardCard title="Leave Requests" value={analytics.totalLeaveRequests} icon="📋" color="purple" />
        <DashboardCard title="Rejected Requests" value={analytics.rejectedRequests} icon="❌" color="red" />
        <DashboardCard title="Total Requests" value={analytics.totalODRequests + analytics.totalLeaveRequests} icon="📊" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-ink-800 mb-4">Request Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold text-ink-800 mb-4">Requests by Type</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#2C79AC" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

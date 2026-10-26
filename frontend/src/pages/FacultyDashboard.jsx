import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import StatusBadge from "../components/StatusBadge";
import Loader from "../components/Loader";
import odService from "../services/odService";
import leaveService from "../services/leaveService";
import useAuth from "../hooks/useAuth";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [odRes, leaveRes] = await Promise.all([odService.getAll(), leaveService.getAll()]);
        setRequests([
          ...odRes.requests.map((r) => ({ ...r, type: "OD", title: r.eventName })),
          ...leaveRes.requests.map((r) => ({ ...r, type: "Leave", title: r.leaveType })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pending = requests.filter((r) => r.status === "Pending");
  const approved = requests.filter((r) => !r.status.includes("Rejected") && r.status !== "Pending");
  const rejected = requests.filter((r) => r.status.includes("Rejected"));

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">Welcome, {user?.name}</h1>
      <p className="text-sm text-slate-500 mb-6">{user?.department} · Faculty Dashboard</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Total Requests" value={requests.length} icon="📑" />
        <DashboardCard title="Pending Requests" value={pending.length} icon="⏳" color="amber" />
        <DashboardCard title="Approved" value={approved.length} icon="✅" color="green" />
        <DashboardCard title="Rejected" value={rejected.length} icon="❌" color="red" />
      </div>

      <div className="card">
        <h2 className="font-semibold text-ink-800 mb-4">Recent Requests</h2>
        {loading ? (
          <Loader />
        ) : requests.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">No requests assigned to you yet.</p>
        ) : (
          <div className="space-y-3">
            {requests.slice(0, 6).map((r) => (
              <div key={r._id} className="flex items-center justify-between border-b border-parchment-200 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-ink-800">
                    {r.studentName} — {r.title} ({r.type})
                  </p>
                  <p className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;

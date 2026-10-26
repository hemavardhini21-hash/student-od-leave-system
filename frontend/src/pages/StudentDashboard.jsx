import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import StatusBadge from "../components/StatusBadge";
import Loader from "../components/Loader";
import odService from "../services/odService";
import leaveService from "../services/leaveService";
import useAuth from "../hooks/useAuth";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [odRequests, setOdRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [odRes, leaveRes] = await Promise.all([odService.getAll(), leaveService.getAll()]);
        setOdRequests(odRes.requests);
        setLeaveRequests(leaveRes.requests);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const allRequests = [
    ...odRequests.map((r) => ({ ...r, type: "OD" })),
    ...leaveRequests.map((r) => ({ ...r, type: "Leave" })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const pendingCount = allRequests.filter((r) => ["Pending", "Faculty Approved"].includes(r.status)).length;
  const approvedCount = allRequests.filter((r) => ["Fully Approved", "Attendance Updated"].includes(r.status)).length;
  const rejectedCount = allRequests.filter((r) => r.status.includes("Rejected")).length;

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">Welcome, {user?.name} 👋</h1>
      <p className="text-sm text-slate-500 mb-6">
        {user?.department} · Year {user?.year} · Section {user?.section} · Reg No: {user?.registerNumber}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Total Requests" value={allRequests.length} icon="📑" />
        <DashboardCard title="Pending" value={pendingCount} icon="⏳" color="amber" />
        <DashboardCard title="Approved" value={approvedCount} icon="✅" color="green" />
        <DashboardCard title="Rejected" value={rejectedCount} icon="❌" color="red" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Link to="/student/apply-od" className="card hover:shadow-md transition-shadow flex items-center gap-4">
          <span className="text-3xl">📝</span>
          <div>
            <p className="font-semibold text-ink-800">Apply for OD</p>
            <p className="text-xs text-slate-500">Submit a new On-Duty request</p>
          </div>
        </Link>
        <Link to="/student/apply-leave" className="card hover:shadow-md transition-shadow flex items-center gap-4">
          <span className="text-3xl">📋</span>
          <div>
            <p className="font-semibold text-ink-800">Apply for Leave</p>
            <p className="text-xs text-slate-500">Submit a new leave request</p>
          </div>
        </Link>
      </div>

      <div className="card">
        <h2 className="font-semibold text-ink-800 mb-4">Recent Requests</h2>
        {loading ? (
          <Loader />
        ) : allRequests.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">No requests submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {allRequests.slice(0, 5).map((r) => (
              <div key={r._id} className="flex items-center justify-between border-b border-parchment-200 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-ink-800">
                    {r.type === "OD" ? r.eventName : r.leaveType}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(r.createdAt).toLocaleDateString()} · {r.type}
                  </p>
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

export default StudentDashboard;

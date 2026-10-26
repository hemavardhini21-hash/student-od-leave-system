import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import StatusBadge from "../components/StatusBadge";
import Loader from "../components/Loader";
import attendanceService from "../services/attendanceService";
import odService from "../services/odService";
import leaveService from "../services/leaveService";
import useAuth from "../hooks/useAuth";

const CoordinatorDashboard = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [approvedOD, setApprovedOD] = useState([]);
  const [approvedLeave, setApprovedLeave] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [attRes, odRes, leaveRes] = await Promise.all([
          attendanceService.getAll(),
          odService.getAll(),
          leaveService.getAll(),
        ]);
        setRecords(attRes.records);
        setApprovedOD(odRes.requests);
        setApprovedLeave(leaveRes.requests);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const odCount = records.filter((r) => r.status === "OD").length;
  const leaveCount = records.filter((r) => r.status === "Leave").length;
  const manualCorrections = records.filter((r) => r.updatedManually).length;

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">Welcome, {user?.name}</h1>
      <p className="text-sm text-slate-500 mb-6">Attendance Coordinator Dashboard</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Total Attendance Records" value={records.length} icon="📊" />
        <DashboardCard title="OD Marked" value={odCount} icon="📝" />
        <DashboardCard title="Leave Marked" value={leaveCount} icon="📋" color="purple" />
        <DashboardCard title="Manual Corrections" value={manualCorrections} icon="✏️" color="amber" />
      </div>

      <div className="card">
        <h2 className="font-semibold text-ink-800 mb-4">Recently Auto-Updated Attendance</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-3">
            {records
              .filter((r) => r.status === "OD" || r.status === "Leave")
              .slice(0, 8)
              .map((r) => (
                <div key={r._id} className="flex items-center justify-between border-b border-parchment-200 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-ink-800">{r.student?.name}</p>
                    <p className="text-xs text-slate-500">{new Date(r.date).toLocaleDateString()} · {r.subject}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            {records.filter((r) => r.status === "OD" || r.status === "Leave").length === 0 && (
              <p className="text-sm text-slate-500 py-6 text-center">No auto-updated attendance yet.</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorDashboard;

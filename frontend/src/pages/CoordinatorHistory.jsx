import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import attendanceService from "../services/attendanceService";

// Displays the AuditLog: every attendance change with previous/new status, who made it, and when.
const CoordinatorHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService
      .getAuditLog()
      .then((res) => setLogs(res.logs))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "student", label: "Student", render: (r) => (
        <div>
          <p className="font-medium text-ink-800">{r.student?.name}</p>
          <p className="text-xs text-slate-400">{r.student?.registerNumber}</p>
        </div>
      ) },
    { key: "requestType", label: "Request Type" },
    { key: "previousStatus", label: "Previous Status", render: (r) => <StatusBadge status={r.previousStatus} /> },
    { key: "newStatus", label: "New Status", render: (r) => <StatusBadge status={r.newStatus} /> },
    { key: "updatedBy", label: "Updated By", render: (r) => `${r.updatedBy?.name || "System"} ${r.updatedBy?.role ? `(${r.updatedBy.role})` : ""}` },
    { key: "updatedAt", label: "Updated At", render: (r) => new Date(r.updatedAt).toLocaleString() },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">Attendance Update History</h1>
      <p className="text-sm text-slate-500 mb-6">Full audit trail of every attendance change, automatic or manual.</p>

      <div className="card">
        <DataTable columns={columns} data={logs} loading={loading} emptyMessage="No audit history yet" />
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorHistory;

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import attendanceService from "../services/attendanceService";

const STATUS_OPTIONS = ["Present", "Absent", "OD", "Leave"];

const CoordinatorAttendanceRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getAll();
      setRecords(res.records);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCorrect = async (id, newStatus) => {
    try {
      await attendanceService.update(id, { status: newStatus });
      toast.success("Attendance record updated");
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const columns = [
    { key: "student", label: "Student", render: (r) => (
        <div>
          <p className="font-medium text-ink-800">{r.student?.name}</p>
          <p className="text-xs text-slate-400">{r.student?.registerNumber}</p>
        </div>
      ) },
    { key: "date", label: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
    { key: "subject", label: "Subject" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "updatedManually", label: "Source", render: (r) => (r.updatedManually ? "Manual" : r.relatedRequestId ? "Auto" : "Regular") },
    {
      key: "actions",
      label: "Correct",
      render: (r) =>
        editingId === r._id ? (
          <select
            className="input !w-auto !py-1"
            defaultValue={r.status}
            autoFocus
            onBlur={() => setEditingId(null)}
            onChange={(e) => handleCorrect(r._id, e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        ) : (
          <button className="btn-secondary !px-3 !py-1.5 text-xs" onClick={() => setEditingId(r._id)}>
            Edit
          </button>
        ),
    },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">Attendance Records</h1>
      <p className="text-sm text-slate-500 mb-6">View and manually correct attendance records when required.</p>

      <div className="card">
        <DataTable columns={columns} data={records} loading={loading} emptyMessage="No attendance records found" />
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorAttendanceRecords;

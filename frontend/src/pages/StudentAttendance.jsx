import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import DashboardCard from "../components/DashboardCard";
import attendanceService from "../services/attendanceService";

const StudentAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService
      .getAll()
      .then((res) => setRecords(res.records))
      .finally(() => setLoading(false));
  }, []);

  const total = records.length;
  const present = records.filter((r) => r.status === "Present").length;
  const od = records.filter((r) => r.status === "OD").length;
  const leave = records.filter((r) => r.status === "Leave").length;
  const absent = records.filter((r) => r.status === "Absent").length;
  const percentage = total > 0 ? (((present + od + leave) / total) * 100).toFixed(1) : "0.0";

  const columns = [
    { key: "date", label: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
    { key: "subject", label: "Subject" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">My Attendance</h1>
      <p className="text-sm text-slate-500 mb-6">Overview of your attendance records, including auto-updated OD/Leave entries.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <DashboardCard title="Overall %" value={`${percentage}%`} icon="📊" />
        <DashboardCard title="Present" value={present} icon="✅" color="green" />
        <DashboardCard title="OD" value={od} icon="📝" />
        <DashboardCard title="Leave" value={leave} icon="📋" color="purple" />
        <DashboardCard title="Absent" value={absent} icon="❌" color="red" />
      </div>

      <div className="card">
        <DataTable columns={columns} data={records} loading={loading} emptyMessage="No attendance records yet" />
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;

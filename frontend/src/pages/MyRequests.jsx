import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import odService from "../services/odService";
import leaveService from "../services/leaveService";

const MyRequests = () => {
  const [tab, setTab] = useState("OD");
  const [odRequests, setOdRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
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

  const odColumns = [
    { key: "eventName", label: "Event" },
    { key: "odStartDate", label: "Start Date", render: (r) => new Date(r.odStartDate).toLocaleDateString() },
    { key: "odEndDate", label: "End Date", render: (r) => new Date(r.odEndDate).toLocaleDateString() },
    { key: "facultyInCharge", label: "Faculty", render: (r) => r.facultyInCharge?.name || "-" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "facultyRemarks", label: "Faculty Remarks", render: (r) => r.facultyRemarks || "-" },
    { key: "hodRemarks", label: "HOD Remarks", render: (r) => r.hodRemarks || "-" },
  ];

  const leaveColumns = [
    { key: "leaveType", label: "Type" },
    { key: "startDate", label: "Start Date", render: (r) => new Date(r.startDate).toLocaleDateString() },
    { key: "endDate", label: "End Date", render: (r) => new Date(r.endDate).toLocaleDateString() },
    { key: "numberOfDays", label: "Days" },
    { key: "facultyInCharge", label: "Faculty", render: (r) => r.facultyInCharge?.name || "-" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "remarks", label: "Faculty Remarks", render: (r) => r.remarks || "-" },
    { key: "hodRemarks", label: "HOD Remarks", render: (r) => r.hodRemarks || "-" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">My Requests</h1>
      <p className="text-sm text-slate-500 mb-6">Track the status of your OD and Leave requests.</p>

      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-lg ${tab === "OD" ? "bg-primary-600 text-white" : "bg-white border border-ink-100 text-ink-600"}`}
          onClick={() => setTab("OD")}
        >
          OD Requests ({odRequests.length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-lg ${tab === "Leave" ? "bg-primary-600 text-white" : "bg-white border border-ink-100 text-ink-600"}`}
          onClick={() => setTab("Leave")}
        >
          Leave Requests ({leaveRequests.length})
        </button>
      </div>

      <div className="card">
        {tab === "OD" ? (
          <DataTable columns={odColumns} data={odRequests} loading={loading} emptyMessage="No OD requests yet" />
        ) : (
          <DataTable columns={leaveColumns} data={leaveRequests} loading={loading} emptyMessage="No leave requests yet" />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyRequests;

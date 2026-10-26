import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import RequestApprovalList from "../components/RequestApprovalList";
import odService from "../services/odService";
import leaveService from "../services/leaveService";

// Shows all requests (any status) handled by / assigned to this faculty member,
// with filtering by status and department.
const FacultyHistory = () => {
  const [tab, setTab] = useState("OD");
  const [odRequests, setOdRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const [odRes, leaveRes] = await Promise.all([odService.getAll(params), leaveService.getAll(params)]);
      setOdRequests(odRes.requests);
      setLeaveRequests(leaveRes.requests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const statuses = [
    "Pending",
    "Faculty Approved",
    "Faculty Rejected",
    "HOD Approved",
    "HOD Rejected",
    "Fully Approved",
    "Attendance Updated",
  ];

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">Request History</h1>
      <p className="text-sm text-slate-500 mb-6">All requests you've reviewed or that are assigned to you.</p>

      <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-lg ${tab === "OD" ? "bg-primary-600 text-white" : "bg-white border border-ink-100 text-ink-600"}`}
            onClick={() => setTab("OD")}
          >
            OD Requests
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-lg ${tab === "Leave" ? "bg-primary-600 text-white" : "bg-white border border-ink-100 text-ink-600"}`}
            onClick={() => setTab("Leave")}
          >
            Leave Requests
          </button>
        </div>
        <select className="input !w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <RequestApprovalList
          requests={tab === "OD" ? odRequests : leaveRequests}
          loading={loading}
          type={tab}
          showActions={false}
        />
      </div>
    </DashboardLayout>
  );
};

export default FacultyHistory;

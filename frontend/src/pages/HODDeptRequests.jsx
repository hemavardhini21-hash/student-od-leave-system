import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import RequestApprovalList from "../components/RequestApprovalList";
import odService from "../services/odService";
import leaveService from "../services/leaveService";

// All department requests (any status), with status filter - view-only history for HOD
const HODDeptRequests = () => {
  const [tab, setTab] = useState("OD");
  const [odRequests, setOdRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
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

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

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
      <h1 className="text-xl font-bold text-ink-800 mb-1">Department Requests</h1>
      <p className="text-sm text-slate-500 mb-6">All OD and Leave requests submitted within your department.</p>

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
        <div className="flex gap-2">
          <form onSubmit={handleSearch}>
            <input
              className="input !w-auto"
              placeholder="Search student / register no."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <select className="input !w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <RequestApprovalList requests={tab === "OD" ? odRequests : leaveRequests} loading={loading} type={tab} showActions={false} />
      </div>
    </DashboardLayout>
  );
};

export default HODDeptRequests;

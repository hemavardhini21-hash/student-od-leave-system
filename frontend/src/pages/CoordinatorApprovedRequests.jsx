import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import RequestApprovalList from "../components/RequestApprovalList";
import odService from "../services/odService";
import leaveService from "../services/leaveService";

// Coordinator view of fully approved / attendance-updated requests, to verify
// that attendance was correctly reflected.
const CoordinatorApprovedRequests = () => {
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

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">Approved Requests</h1>
      <p className="text-sm text-slate-500 mb-6">Fully approved OD and Leave requests with attendance updates applied.</p>

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
        <RequestApprovalList requests={tab === "OD" ? odRequests : leaveRequests} loading={loading} type={tab} showActions={false} />
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorApprovedRequests;

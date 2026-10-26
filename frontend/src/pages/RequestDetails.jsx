import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import Loader from "../components/Loader";
import odService from "../services/odService";
import leaveService from "../services/leaveService";
import useAuth from "../hooks/useAuth";

// Generic detail view for a single OD or Leave request, reused by faculty/hod/admin.
// Route: /:role/request/:type/:id  where type is "od" or "leave"
const RequestDetails = () => {
  const { type, id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(null);

  const service = type === "od" ? odService : leaveService;

  const load = async () => {
    setLoading(true);
    try {
      const res = await service.getById(id);
      setRequest(res.request);
    } catch (err) {
      toast.error("Request not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  const handleConfirm = async (remarks) => {
    try {
      if (dialog.action === "approve") {
        await service.approve(id, remarks);
        toast.success("Request approved");
      } else {
        await service.reject(id, remarks);
        toast.success("Request rejected");
      }
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setDialog(null);
    }
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;
  if (!request) return <DashboardLayout><p className="text-sm text-slate-500">Request not found.</p></DashboardLayout>;

  const canAct = ["faculty", "hod"].includes(user?.role) && ["Pending", "Faculty Approved"].includes(request.status);

  return (
    <DashboardLayout>
      <button className="text-sm text-primary-600 mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-ink-800">
            {type === "od" ? "OD Request Details" : "Leave Request Details"}
          </h1>
          <StatusBadge status={request.status} />
        </div>

        <dl className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <dt className="text-slate-400">Student</dt>
            <dd className="font-medium text-ink-700">{request.studentName || request.student?.name}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Register Number</dt>
            <dd className="font-medium text-ink-700">{request.registerNumber}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Department</dt>
            <dd className="font-medium text-ink-700">{request.department}</dd>
          </div>

          {type === "od" ? (
            <>
              <div>
                <dt className="text-slate-400">Event Name</dt>
                <dd className="font-medium text-ink-700">{request.eventName}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Event Location</dt>
                <dd className="font-medium text-ink-700">{request.eventLocation}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Dates</dt>
                <dd className="font-medium text-ink-700">
                  {new Date(request.odStartDate).toLocaleDateString()} - {new Date(request.odEndDate).toLocaleDateString()}
                </dd>
              </div>
            </>
          ) : (
            <>
              <div>
                <dt className="text-slate-400">Leave Type</dt>
                <dd className="font-medium text-ink-700">{request.leaveType}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Dates</dt>
                <dd className="font-medium text-ink-700">
                  {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()} ({request.numberOfDays} days)
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Emergency Contact</dt>
                <dd className="font-medium text-ink-700">{request.emergencyContact}</dd>
              </div>
            </>
          )}

          <div className="sm:col-span-2">
            <dt className="text-slate-400">Reason</dt>
            <dd className="font-medium text-ink-700">{request.reason}</dd>
          </div>

          <div>
            <dt className="text-slate-400">Faculty In-Charge</dt>
            <dd className="font-medium text-ink-700">{request.facultyInCharge?.name}</dd>
          </div>
          <div>
            <dt className="text-slate-400">HOD</dt>
            <dd className="font-medium text-ink-700">{request.hod?.name || "Pending"}</dd>
          </div>

          {request.document && (
            <div className="sm:col-span-2">
              <dt className="text-slate-400">Supporting Document</dt>
              <dd>
                <a href={request.document} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline text-sm">
                  View document
                </a>
              </dd>
            </div>
          )}

          <div>
            <dt className="text-slate-400">Faculty Remarks</dt>
            <dd className="font-medium text-ink-700">{request.facultyRemarks || request.remarks || "-"}</dd>
          </div>
          <div>
            <dt className="text-slate-400">HOD Remarks</dt>
            <dd className="font-medium text-ink-700">{request.hodRemarks || "-"}</dd>
          </div>
        </dl>

        {canAct && (
          <div className="flex gap-3">
            <button className="btn-success" onClick={() => setDialog({ action: "approve" })}>
              Approve
            </button>
            <button className="btn-danger" onClick={() => setDialog({ action: "reject" })}>
              Reject
            </button>
          </div>
        )}
      </div>

      {dialog && (
        <ConfirmDialog
          title={dialog.action === "approve" ? "Approve Request" : "Reject Request"}
          requireRemarks
          confirmLabel={dialog.action === "approve" ? "Approve" : "Reject"}
          danger={dialog.action === "reject"}
          onConfirm={handleConfirm}
          onCancel={() => setDialog(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default RequestDetails;

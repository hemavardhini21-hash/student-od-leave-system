import React, { useState } from "react";
import toast from "react-hot-toast";
import DataTable from "./DataTable";
import StatusBadge from "./StatusBadge";
import ConfirmDialog from "./ConfirmDialog";

// Shared table for faculty/HOD to review & approve/reject OD or Leave requests.
// `type` is "OD" or "Leave" and determines which fields/service to use.
const RequestApprovalList = ({ requests, loading, type, onApprove, onReject, showActions = true }) => {
  const [dialog, setDialog] = useState(null); // { requestId, action: 'approve' | 'reject' }

  const openDialog = (requestId, action) => setDialog({ requestId, action });
  const closeDialog = () => setDialog(null);

  const handleConfirm = async (remarks) => {
    if (!dialog) return;
    try {
      if (dialog.action === "approve") {
        await onApprove(dialog.requestId, remarks);
        toast.success("Request approved");
      } else {
        await onReject(dialog.requestId, remarks);
        toast.success("Request rejected");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      closeDialog();
    }
  };

  const baseColumns =
    type === "OD"
      ? [
          { key: "studentName", label: "Student", render: (r) => (
              <div>
                <p className="font-medium text-ink-800">{r.studentName}</p>
                <p className="text-xs text-slate-400">{r.registerNumber}</p>
              </div>
            ) },
          { key: "eventName", label: "Event" },
          { key: "odStartDate", label: "Dates", render: (r) => `${new Date(r.odStartDate).toLocaleDateString()} - ${new Date(r.odEndDate).toLocaleDateString()}` },
          { key: "eventLocation", label: "Location" },
        ]
      : [
          { key: "studentName", label: "Student", render: (r) => (
              <div>
                <p className="font-medium text-ink-800">{r.studentName}</p>
                <p className="text-xs text-slate-400">{r.registerNumber}</p>
              </div>
            ) },
          { key: "leaveType", label: "Type" },
          { key: "startDate", label: "Dates", render: (r) => `${new Date(r.startDate).toLocaleDateString()} - ${new Date(r.endDate).toLocaleDateString()}` },
          { key: "numberOfDays", label: "Days" },
        ];

  const columns = [
    ...baseColumns,
    { key: "department", label: "Department" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  if (showActions) {
    columns.push({
      key: "actions",
      label: "Actions",
      render: (r) =>
        ["Pending", "Faculty Approved"].includes(r.status) ? (
          <div className="flex gap-2">
            <button className="btn-success !px-3 !py-1.5 text-xs" onClick={() => openDialog(r._id, "approve")}>
              Approve
            </button>
            <button className="btn-danger !px-3 !py-1.5 text-xs" onClick={() => openDialog(r._id, "reject")}>
              Reject
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400">No action needed</span>
        ),
    });
  }

  return (
    <>
      <DataTable columns={columns} data={requests} loading={loading} emptyMessage={`No ${type} requests found`} />
      {dialog && (
        <ConfirmDialog
          title={dialog.action === "approve" ? "Approve Request" : "Reject Request"}
          description={dialog.action === "approve" ? "This will move the request to the next approval stage." : "Please provide a reason for rejection."}
          confirmLabel={dialog.action === "approve" ? "Approve" : "Reject"}
          requireRemarks
          danger={dialog.action === "reject"}
          onConfirm={handleConfirm}
          onCancel={closeDialog}
        />
      )}
    </>
  );
};

export default RequestApprovalList;

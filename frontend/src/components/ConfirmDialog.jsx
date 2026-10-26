import React, { useState } from "react";

// Generic confirm modal, used for approve/reject actions that need a remark
const ConfirmDialog = ({ title, description, confirmLabel = "Confirm", requireRemarks = false, danger = false, onConfirm, onCancel }) => {
  const [remarks, setRemarks] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
        {requireRemarks && (
          <div className="mb-4">
            <label className="label">Remarks / Comments</label>
            <textarea
              className="input"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add a comment (optional)"
            />
          </div>
        )}
        <div className="flex justify-end gap-3 mt-2">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className={danger ? "btn-danger" : "btn-primary"} onClick={() => onConfirm(remarks)}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

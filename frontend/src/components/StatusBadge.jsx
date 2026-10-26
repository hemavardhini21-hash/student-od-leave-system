import React from "react";

// Maps request/attendance statuses to a color scheme for quick visual scanning.
// Styled as bordered tags (like a stamp/marker on a record) rather than solid
// filled pills, to stay consistent with the register's restrained look.
const STYLES = {
  Pending: "border-amber-300 text-amber-700 bg-amber-50",
  "Faculty Approved": "border-sky-300 text-sky-700 bg-sky-50",
  "Faculty Rejected": "border-red-300 text-red-700 bg-red-50",
  "HOD Approved": "border-indigo-300 text-indigo-700 bg-indigo-50",
  "HOD Rejected": "border-red-300 text-red-700 bg-red-50",
  "Fully Approved": "border-emerald-400 text-emerald-700 bg-emerald-50",
  "Attendance Updated": "border-emerald-400 text-emerald-700 bg-emerald-50",
  Present: "border-emerald-400 text-emerald-700 bg-emerald-50",
  Absent: "border-red-300 text-red-700 bg-red-50",
  OD: "border-sky-300 text-sky-700 bg-sky-50",
  Leave: "border-purple-300 text-purple-700 bg-purple-50",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block px-2.5 py-1 rounded-full border text-xs font-medium whitespace-nowrap ${
      STYLES[status] || "border-ink-100 text-ink-700 bg-parchment-100"
    }`}
  >
    {status}
  </span>
);

export default StatusBadge;

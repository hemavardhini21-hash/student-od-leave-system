const Attendance = require("../models/Attendance");
const AuditLog = require("../models/AuditLog");

// Generates an array of Date objects between start and end (inclusive), one per day
const getDateRange = (start, end) => {
  const dates = [];
  const current = new Date(start);
  const last = new Date(end);
  current.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  while (current <= last) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// Marks attendance as OD or Leave for a student across a date range.
// Prevents duplicates by upserting on (student, date, subject).
// Logs every change (or creation) to the AuditLog for traceability.
const applyAttendanceForRange = async ({
  studentId,
  startDate,
  endDate,
  status, // "OD" or "Leave"
  requestId,
  requestModel, // "ODRequest" or "LeaveRequest"
  updatedBy,
  subject = "General",
}) => {
  const dates = getDateRange(startDate, endDate);
  const results = [];

  for (const date of dates) {
    const existing = await Attendance.findOne({ student: studentId, date, subject });
    const previousStatus = existing ? existing.status : "Not Marked";

    let record;
    if (existing) {
      existing.status = status;
      existing.relatedRequestId = requestId;
      existing.relatedRequestModel = requestModel;
      record = await existing.save();
    } else {
      record = await Attendance.create({
        student: studentId,
        date,
        subject,
        status,
        relatedRequestId: requestId,
        relatedRequestModel: requestModel,
      });
    }

    await AuditLog.create({
      requestId,
      requestType: requestModel,
      student: studentId,
      previousStatus,
      newStatus: status,
      updatedBy,
    });

    results.push(record);
  }

  return results;
};

module.exports = { getDateRange, applyAttendanceForRange };

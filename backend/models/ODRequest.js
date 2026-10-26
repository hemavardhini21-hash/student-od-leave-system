const mongoose = require("mongoose");

// Central list of valid statuses reused across OD and Leave workflows
const STATUS_VALUES = [
  "Pending",
  "Faculty Approved",
  "Faculty Rejected",
  "HOD Approved",
  "HOD Rejected",
  "Fully Approved",
  "Attendance Updated",
];

const odRequestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentName: { type: String, required: true },
    registerNumber: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    section: { type: String, required: true },
    odStartDate: { type: Date, required: true },
    odEndDate: { type: Date, required: true },
    eventName: { type: String, required: true },
    eventLocation: { type: String, required: true },
    reason: { type: String, required: true },
    facultyInCharge: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hod: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    document: { type: String }, // file path of uploaded supporting document
    status: { type: String, enum: STATUS_VALUES, default: "Pending" },
    facultyRemarks: { type: String, default: "" },
    hodRemarks: { type: String, default: "" },
    attendanceUpdated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

odRequestSchema.statics.STATUS_VALUES = STATUS_VALUES;

module.exports = mongoose.model("ODRequest", odRequestSchema);

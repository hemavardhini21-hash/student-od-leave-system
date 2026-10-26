const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    subject: { type: String, required: true, default: "General" },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["Present", "Absent", "OD", "Leave"],
      required: true,
      default: "Present",
    },
    // Reference to the OD/Leave request that caused this record to be auto-updated (if any)
    relatedRequestId: { type: mongoose.Schema.Types.ObjectId, refPath: "relatedRequestModel" },
    relatedRequestModel: { type: String, enum: ["ODRequest", "LeaveRequest"] },
    updatedManually: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent duplicate attendance records for same student/date/subject
attendanceSchema.index({ student: 1, date: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);

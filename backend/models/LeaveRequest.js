const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentName: { type: String, required: true },
    registerNumber: { type: String, required: true },
    department: { type: String, required: true },
    leaveType: {
      type: String,
      enum: ["Medical Leave", "Personal Leave", "Emergency Leave", "Other"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfDays: { type: Number, required: true },
    reason: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    document: { type: String },
    facultyInCharge: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hod: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: [
        "Pending",
        "Faculty Approved",
        "Faculty Rejected",
        "HOD Approved",
        "HOD Rejected",
        "Fully Approved",
        "Attendance Updated",
      ],
      default: "Pending",
    },
    remarks: { type: String, default: "" },
    hodRemarks: { type: String, default: "" },
    attendanceUpdated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);

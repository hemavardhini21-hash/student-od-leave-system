const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, required: true },
    requestType: { type: String, enum: ["ODRequest", "LeaveRequest"], required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    previousStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);

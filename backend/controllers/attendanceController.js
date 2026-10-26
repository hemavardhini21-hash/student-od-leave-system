const Attendance = require("../models/Attendance");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const { deptEquals } = require("../utils/deptMatch");

// @desc    Get attendance records (scoped: student sees own, faculty/coordinator/admin/hod see filtered)
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res, next) => {
  try {
    const { student, status, startDate, endDate, department } = req.query;
    let filter = {};

    if (req.user.role === "student") {
      filter.student = req.user._id;
    } else if (student) {
      filter.student = student;
    }

    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    let records = await Attendance.find(filter)
      .populate("student", "name registerNumber department year section")
      .populate("faculty", "name")
      .sort({ date: -1 });

    if (department && ["hod", "admin", "coordinator"].includes(req.user.role)) {
      records = records.filter((r) => r.student && deptEquals(r.student.department, department));
    } else if (req.user.role === "hod") {
      records = records.filter((r) => r.student && deptEquals(r.student.department, req.user.department));
    }

    res.json({ success: true, count: records.length, records });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually create an attendance record (e.g. daily marking by faculty)
// @route   POST /api/attendance
// @access  Private (faculty, coordinator, admin)
const createAttendance = async (req, res, next) => {
  try {
    const { student, date, subject, status } = req.body;
    if (!student || !date || !status) {
      return res.status(400).json({ success: false, message: "student, date and status are required" });
    }

    const existing = await Attendance.findOne({ student, date, subject: subject || "General" });
    if (existing) {
      return res.status(400).json({ success: false, message: "Attendance record already exists for this student/date/subject. Use update instead." });
    }

    const record = await Attendance.create({
      student,
      date,
      subject: subject || "General",
      status,
      faculty: req.user.role === "faculty" ? req.user._id : req.body.faculty,
    });

    await AuditLog.create({
      requestId: record._id,
      requestType: "ODRequest", // placeholder type for manual entries; not tied to a request
      student,
      previousStatus: "Not Marked",
      newStatus: status,
      updatedBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Attendance record created", record });
  } catch (error) {
    next(error);
  }
};

// @desc    Update / manually correct an attendance record
// @route   PUT /api/attendance/:id
// @access  Private (coordinator, admin, faculty)
const updateAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Attendance record not found" });

    const previousStatus = record.status;
    const { status, subject } = req.body;

    if (status) record.status = status;
    if (subject) record.subject = subject;
    record.updatedManually = true;

    await record.save();

    await AuditLog.create({
      requestId: record._id,
      requestType: "ODRequest",
      student: record.student,
      previousStatus,
      newStatus: record.status,
      updatedBy: req.user._id,
    });

    res.json({ success: true, message: "Attendance record updated", record });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance update / audit history
// @route   GET /api/attendance/audit-log
// @access  Private (coordinator, admin, hod)
const getAuditLog = async (req, res, next) => {
  try {
    const logs = await AuditLog.find({})
      .populate("student", "name registerNumber department")
      .populate("updatedBy", "name role")
      .sort({ updatedAt: -1 })
      .limit(500);

    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAttendance, createAttendance, updateAttendance, getAuditLog };

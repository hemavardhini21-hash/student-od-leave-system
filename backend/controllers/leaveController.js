const LeaveRequest = require("../models/LeaveRequest");
const notifyUser = require("../utils/notifyUser");
const { applyAttendanceForRange } = require("../utils/attendanceHelper");
const { deptFilter } = require("../utils/deptMatch");

// Calculates inclusive number of days between two dates
const calcDays = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : 1;
};

// @desc    Student submits a new Leave request
// @route   POST /api/leave
// @access  Private (student)
const createLeaveRequest = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason, emergencyContact, facultyInCharge } = req.body;

    if (!leaveType || !startDate || !endDate || !reason || !emergencyContact || !facultyInCharge) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const request = await LeaveRequest.create({
      student: req.user._id,
      studentName: req.user.name,
      registerNumber: req.user.registerNumber,
      department: req.user.department,
      leaveType,
      startDate,
      endDate,
      numberOfDays: calcDays(startDate, endDate),
      reason,
      emergencyContact,
      facultyInCharge,
      document: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    await notifyUser(facultyInCharge, `New ${leaveType} request submitted by ${req.user.name}.`, "Leave");

    res.status(201).json({ success: true, message: "Leave request submitted successfully", request });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leave requests - scoped by role
// @route   GET /api/leave
// @access  Private
const getLeaveRequests = async (req, res, next) => {
  try {
    const { status, department, startDate, endDate, search } = req.query;
    let filter = {};

    if (req.user.role === "student") {
      filter.student = req.user._id;
    } else if (req.user.role === "faculty") {
      filter.facultyInCharge = req.user._id;
    } else if (req.user.role === "hod") {
      filter.department = deptFilter(req.user.department);
    } else if (req.user.role === "coordinator") {
      filter.status = { $in: ["Fully Approved", "Attendance Updated"] };
    }

    if (status) filter.status = status;
    if (department && req.user.role === "admin") filter.department = deptFilter(department);
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: "i" } },
        { registerNumber: { $regex: search, $options: "i" } },
      ];
    }

    const requests = await LeaveRequest.find(filter)
      .populate("student", "name registerNumber department")
      .populate("facultyInCharge", "name")
      .populate("hod", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single leave request
// @route   GET /api/leave/:id
// @access  Private
const getLeaveRequestById = async (req, res, next) => {
  try {
    const request = await LeaveRequest.findById(req.params.id)
      .populate("student", "name registerNumber department year section")
      .populate("facultyInCharge", "name")
      .populate("hod", "name");

    if (!request) return res.status(404).json({ success: false, message: "Leave request not found" });

    res.json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a leave request (faculty then hod)
// @route   PUT /api/leave/:id/approve
// @access  Private (faculty, hod)
const approveLeaveRequest = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    const request = await LeaveRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Leave request not found" });

    if (req.user.role === "faculty") {
      if (request.status !== "Pending") {
        return res.status(400).json({ success: false, message: "This request is not pending faculty approval" });
      }
      request.status = "Faculty Approved";
      request.remarks = remarks || "";
      await notifyUser(request.student, `Your ${request.leaveType} request was approved by faculty and forwarded to HOD.`, "Leave");
    } else if (req.user.role === "hod") {
      if (request.status !== "Faculty Approved") {
        return res.status(400).json({ success: false, message: "This request is not pending HOD approval" });
      }
      request.hod = req.user._id;
      request.hodRemarks = remarks || "";
      await notifyUser(request.student, `Your ${request.leaveType} request has been approved by HOD.`, "Leave");

      request.status = "Fully Approved";
      await applyAttendanceForRange({
        studentId: request.student,
        startDate: request.startDate,
        endDate: request.endDate,
        status: "Leave",
        requestId: request._id,
        requestModel: "LeaveRequest",
        updatedBy: req.user._id,
      });
      request.status = "Attendance Updated";
      request.attendanceUpdated = true;
      await notifyUser(request.student, `Attendance updated to Leave for your approved ${request.leaveType} request.`, "Attendance");
    } else {
      return res.status(403).json({ success: false, message: "Only faculty or HOD can approve requests" });
    }

    await request.save();
    res.json({ success: true, message: "Request approved", request });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a leave request
// @route   PUT /api/leave/:id/reject
// @access  Private (faculty, hod)
const rejectLeaveRequest = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    const request = await LeaveRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Leave request not found" });

    if (req.user.role === "faculty") {
      request.status = "Faculty Rejected";
      request.remarks = remarks || "Rejected by faculty";
    } else if (req.user.role === "hod") {
      request.status = "HOD Rejected";
      request.hod = req.user._id;
      request.hodRemarks = remarks || "Rejected by HOD";
    } else {
      return res.status(403).json({ success: false, message: "Only faculty or HOD can reject requests" });
    }

    await request.save();
    await notifyUser(request.student, `Your ${request.leaveType} request was rejected. Reason: ${remarks || "N/A"}`, "Leave");

    res.json({ success: true, message: "Request rejected", request });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLeaveRequest,
  getLeaveRequests,
  getLeaveRequestById,
  approveLeaveRequest,
  rejectLeaveRequest,
};

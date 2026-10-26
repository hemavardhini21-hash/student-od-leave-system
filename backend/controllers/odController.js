const ODRequest = require("../models/ODRequest");
const AuditLog = require("../models/AuditLog");
const notifyUser = require("../utils/notifyUser");
const { applyAttendanceForRange } = require("../utils/attendanceHelper");
const { deptFilter } = require("../utils/deptMatch");

// @desc    Student submits a new OD request
// @route   POST /api/od
// @access  Private (student)
const createODRequest = async (req, res, next) => {
  try {
    const {
      odStartDate,
      odEndDate,
      eventName,
      eventLocation,
      reason,
      facultyInCharge,
    } = req.body;

    if (!odStartDate || !odEndDate || !eventName || !eventLocation || !reason || !facultyInCharge) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const request = await ODRequest.create({
      student: req.user._id,
      studentName: req.user.name,
      registerNumber: req.user.registerNumber,
      department: req.user.department,
      year: req.user.year,
      section: req.user.section,
      odStartDate,
      odEndDate,
      eventName,
      eventLocation,
      reason,
      facultyInCharge,
      document: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    await notifyUser(facultyInCharge, `New OD request submitted by ${req.user.name} for "${eventName}".`, "OD");

    res.status(201).json({ success: true, message: "OD request submitted successfully", request });
  } catch (error) {
    next(error);
  }
};

// @desc    Get OD requests - scoped by role (student: own, faculty: assigned, hod: dept + faculty-approved, admin: all)
// @route   GET /api/od
// @access  Private
const getODRequests = async (req, res, next) => {
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
    // admin: no restriction

    if (status) filter.status = status;
    if (department && req.user.role === "admin") filter.department = deptFilter(department);
    if (startDate || endDate) {
      filter.odStartDate = {};
      if (startDate) filter.odStartDate.$gte = new Date(startDate);
      if (endDate) filter.odStartDate.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: "i" } },
        { registerNumber: { $regex: search, $options: "i" } },
        { eventName: { $regex: search, $options: "i" } },
      ];
    }

    const requests = await ODRequest.find(filter)
      .populate("student", "name registerNumber department")
      .populate("facultyInCharge", "name")
      .populate("hod", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single OD request by id
// @route   GET /api/od/:id
// @access  Private
const getODRequestById = async (req, res, next) => {
  try {
    const request = await ODRequest.findById(req.params.id)
      .populate("student", "name registerNumber department year section")
      .populate("facultyInCharge", "name")
      .populate("hod", "name");

    if (!request) return res.status(404).json({ success: false, message: "OD request not found" });

    res.json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve an OD request (faculty or hod step, depending on current status)
// @route   PUT /api/od/:id/approve
// @access  Private (faculty, hod)
const approveODRequest = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    const request = await ODRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "OD request not found" });

    const previousStatus = request.status;

    if (req.user.role === "faculty") {
      if (request.status !== "Pending") {
        return res.status(400).json({ success: false, message: "This request is not pending faculty approval" });
      }
      request.status = "Faculty Approved";
      request.facultyRemarks = remarks || "";
      await notifyUser(request.student, `Your OD request for "${request.eventName}" was approved by faculty and forwarded to HOD.`, "OD");
    } else if (req.user.role === "hod") {
      if (request.status !== "Faculty Approved") {
        return res.status(400).json({ success: false, message: "This request is not pending HOD approval" });
      }
      request.status = "HOD Approved";
      request.hod = req.user._id;
      request.hodRemarks = remarks || "";
      await notifyUser(request.student, `Your OD request for "${request.eventName}" has been approved by HOD.`, "OD");

      // Final approval reached -> mark fully approved and auto-update attendance
      request.status = "Fully Approved";
      await applyAttendanceForRange({
        studentId: request.student,
        startDate: request.odStartDate,
        endDate: request.odEndDate,
        status: "OD",
        requestId: request._id,
        requestModel: "ODRequest",
        updatedBy: req.user._id,
      });
      request.status = "Attendance Updated";
      request.attendanceUpdated = true;
      await notifyUser(request.student, `Attendance updated to OD for your approved request "${request.eventName}".`, "Attendance");
    } else {
      return res.status(403).json({ success: false, message: "Only faculty or HOD can approve requests" });
    }

    await request.save();

    res.json({ success: true, message: "Request approved", request });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject an OD request
// @route   PUT /api/od/:id/reject
// @access  Private (faculty, hod)
const rejectODRequest = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    const request = await ODRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "OD request not found" });

    if (req.user.role === "faculty") {
      request.status = "Faculty Rejected";
      request.facultyRemarks = remarks || "Rejected by faculty";
    } else if (req.user.role === "hod") {
      request.status = "HOD Rejected";
      request.hod = req.user._id;
      request.hodRemarks = remarks || "Rejected by HOD";
    } else {
      return res.status(403).json({ success: false, message: "Only faculty or HOD can reject requests" });
    }

    await request.save();
    await notifyUser(request.student, `Your OD request for "${request.eventName}" was rejected. Reason: ${remarks || "N/A"}`, "OD");

    res.json({ success: true, message: "Request rejected", request });
  } catch (error) {
    next(error);
  }
};

module.exports = { createODRequest, getODRequests, getODRequestById, approveODRequest, rejectODRequest };

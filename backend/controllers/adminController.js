const User = require("../models/User");
const ODRequest = require("../models/ODRequest");
const LeaveRequest = require("../models/LeaveRequest");
const Attendance = require("../models/Attendance");

// @desc    Get all users, optionally filtered by role/department
// @route   GET /api/admin/users
// @access  Private (admin)
const getUsers = async (req, res, next) => {
  try {
    const { role, department, search } = req.query;
    let filter = {};
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { registerNumber: { $regex: search, $options: "i" } },
      ];
    }
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a user (admin can create students/faculty/hod/coordinator/admin)
// @route   POST /api/admin/users
// @access  Private (admin)
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, registerNumber, employeeId, department, year, section } = req.body;
    if (!name || !email || !password || !role || !department) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ success: false, message: "Email already in use" });

    const user = await User.create({ name, email, password, role, registerNumber, employeeId, department, year, section });
    res.status(201).json({ success: true, message: "User created", user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user
// @route   PUT /api/admin/users/:id
// @access  Private (admin)
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const fields = ["name", "role", "department", "year", "section", "registerNumber", "employeeId", "isActive"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) user[f] = req.body[f];
    });
    if (req.body.password) user.password = req.body.password;

    const updated = await user.save();
    res.json({ success: true, message: "User updated", user: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (deactivate) a user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    await user.deleteOne();
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of distinct departments
// @route   GET /api/admin/departments
// @access  Private (admin)
const getDepartments = async (req, res, next) => {
  try {
    const departments = await User.distinct("department");
    res.json({ success: true, departments: departments.filter(Boolean) });
  } catch (error) {
    next(error);
  }
};

// @desc    Dashboard analytics/statistics for admin
// @route   GET /api/admin/analytics
// @access  Private (admin)
const getAnalytics = async (req, res, next) => {
  try {
    const [totalStudents, totalFaculty, odRequests, leaveRequests] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "faculty" }),
      ODRequest.find({}),
      LeaveRequest.find({}),
    ]);

    const allRequests = [...odRequests, ...leaveRequests];
    const pending = allRequests.filter((r) => ["Pending", "Faculty Approved"].includes(r.status)).length;
    const approved = allRequests.filter((r) => ["Fully Approved", "Attendance Updated", "HOD Approved"].includes(r.status)).length;
    const rejected = allRequests.filter((r) => r.status.includes("Rejected")).length;

    res.json({
      success: true,
      analytics: {
        totalStudents,
        totalFaculty,
        totalODRequests: odRequests.length,
        totalLeaveRequests: leaveRequests.length,
        pendingRequests: pending,
        approvedRequests: approved,
        rejectedRequests: rejected,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser, getDepartments, getAnalytics };

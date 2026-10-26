const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user (defaults to student self-registration, but supports any role
//          being created — e.g. by an admin seeding faculty/hod/coordinator accounts)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, registerNumber, employeeId, department, year, section } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
      registerNumber,
      employeeId,
      department,
      year,
      section,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Your account has been deactivated" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged-in user's profile (limited fields)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ["name", "department", "year", "section"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    });
    const updated = await req.user.save();
    res.json({ success: true, message: "Profile updated", user: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };

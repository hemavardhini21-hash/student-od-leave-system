const User = require("../models/User");

// @desc    Get faculty members (optionally filtered by department) - used to populate
//          "Faculty In-Charge" dropdowns on the OD/Leave request forms.
// @route   GET /api/users/faculty
// @access  Private (any authenticated user)
const getFacultyList = async (req, res, next) => {
  try {
    const department = (req.query.department || req.user.department || "").trim();

    // Case-insensitive, whitespace-tolerant match: "Computer Science", "computer science ",
    // and "COMPUTER SCIENCE" should all be treated as the same department.
    const escaped = department.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const faculty = await User.find({
      role: "faculty",
      department: { $regex: `^${escaped}$`, $options: "i" },
    }).select("name email department");

    res.json({ success: true, faculty });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFacultyList };

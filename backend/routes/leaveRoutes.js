const express = require("express");
const router = express.Router();
const {
  createLeaveRequest,
  getLeaveRequests,
  getLeaveRequestById,
  approveLeaveRequest,
  rejectLeaveRequest,
} = require("../controllers/leaveController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

router.post("/", protect, authorize("student"), upload.single("document"), createLeaveRequest);
router.get("/", protect, getLeaveRequests);
router.get("/:id", protect, getLeaveRequestById);
router.put("/:id/approve", protect, authorize("faculty", "hod"), approveLeaveRequest);
router.put("/:id/reject", protect, authorize("faculty", "hod"), rejectLeaveRequest);

module.exports = router;

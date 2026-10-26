const express = require("express");
const router = express.Router();
const { getAttendance, createAttendance, updateAttendance, getAuditLog } = require("../controllers/attendanceController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/audit-log", protect, authorize("coordinator", "admin", "hod"), getAuditLog);
router.get("/", protect, getAttendance);
router.post("/", protect, authorize("faculty", "coordinator", "admin"), createAttendance);
router.put("/:id", protect, authorize("faculty", "coordinator", "admin"), updateAttendance);

module.exports = router;

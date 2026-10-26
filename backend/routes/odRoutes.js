const express = require("express");
const router = express.Router();
const {
  createODRequest,
  getODRequests,
  getODRequestById,
  approveODRequest,
  rejectODRequest,
} = require("../controllers/odController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

router.post("/", protect, authorize("student"), upload.single("document"), createODRequest);
router.get("/", protect, getODRequests);
router.get("/:id", protect, getODRequestById);
router.put("/:id/approve", protect, authorize("faculty", "hod"), approveODRequest);
router.put("/:id/reject", protect, authorize("faculty", "hod"), rejectODRequest);

module.exports = router;

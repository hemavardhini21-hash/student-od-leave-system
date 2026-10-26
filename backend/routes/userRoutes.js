const express = require("express");
const router = express.Router();
const { getFacultyList } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/faculty", protect, getFacultyList);

module.exports = router;

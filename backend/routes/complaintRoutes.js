const express = require("express");
const router = express.Router();
const {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  searchByLocation,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");

// IMPORTANT: /search must come before /:id to avoid route conflict
router.get("/search", protect, searchByLocation);

router.route("/")
  .post(protect, addComplaint)
  .get(protect, getAllComplaints);

router.route("/:id")
  .get(protect, getComplaintById)
  .put(protect, updateComplaintStatus)
  .delete(protect, deleteComplaint);

module.exports = router;

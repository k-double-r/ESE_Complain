const express = require("express");
const router = express.Router();
const { analyzeComplaint, quickAnalyze } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// Analyze a saved complaint by ID and store result
router.post("/analyze", protect, analyzeComplaint);

// Quick analyze without saving (live preview)
router.post("/quick-analyze", protect, quickAnalyze);

module.exports = router;

const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    trim: true,
    lowercase: true,
  },
  title: {
    type: String,
    required: [true, "Complaint title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [10, "Description must be at least 10 characters"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      "Water Supply",
      "Electricity",
      "Roads",
      "Sanitation",
      "Public Safety",
      "Healthcare",
      "Education",
      "Other",
    ],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved", "Rejected"],
    default: "Pending",
  },
  // AI-generated fields stored after analysis
  aiAnalysis: {
    priority: { type: String, default: null },       // High / Medium / Low
    department: { type: String, default: null },      // e.g. "Water Department"
    summary: { type: String, default: null },
    autoResponse: { type: String, default: null },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);

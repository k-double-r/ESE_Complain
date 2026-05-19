const Complaint = require("../models/Complaint");

// @desc    Add a new complaint
// @route   POST /api/complaints
// @access  Private
const addComplaint = async (req, res) => {
  try {
    const { name, email, title, description, category, location } = req.body;

    // Validate required fields
    if (!name || !email || !title || !description || !category || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const complaint = await Complaint.create({
      name,
      email,
      title,
      description,
      category,
      location,
    });

    res.status(201).json({
      message: "Complaint registered successfully",
      complaint,
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints (with optional category filter)
// @route   GET /api/complaints
// @access  Private
const getAllComplaints = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json({ count: complaints.length, complaints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Pending", "In Progress", "Resolved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Status updated successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search complaints by location
// @route   GET /api/complaints/search?location=Ghaziabad
// @access  Private
const searchByLocation = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: "Location query parameter is required" });
    }

    const complaints = await Complaint.find({
      location: { $regex: location, $options: "i" }, // case-insensitive search
    }).sort({ createdAt: -1 });

    res.json({ count: complaints.length, complaints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  searchByLocation,
};
